import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import "dotenv/config";
import { PrismaService } from "@database/prisma.service";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

@Injectable()
export class TendaAtacadoCronScraper {
  private readonly logger = new Logger(TendaAtacadoCronScraper.name);

  constructor(private readonly prisma: PrismaService) {}

  private async scrapeSingleProduct(originalUrl: string) {
    try {
      const url = originalUrl.includes("www.tendaatacado") 
        ? originalUrl 
        : originalUrl.replace("https://tendaatacado", "https://www.tendaatacado");

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      });

      if (res.status === 404) return { isAvailable: false };

      if (res.status === 403 || res.status === 429 || res.status === 503) {
        return { isBlocked: true };
      }

      if (!res.ok) throw new Error(`Falha na requisição: ${res.status}`);

      const html = await res.text();
      const $ = cheerio.load(html);

      let ean = "";
      let name = "";
      let price = NaN;

      // ESTRATÉGIA 1: Extração via Schema.org Microdata (atributos itemprop)
      // O Tenda coloca os dados essenciais diretamente nas tags HTML
      name = $('meta[itemprop="name"]').attr("content")?.trim() || "";
      
      const priceText = $('meta[itemprop="price"]').attr("content")?.trim();
      if (priceText) {
        price = Number(priceText);
      }

      // O EAN/SKU geralmente fica na meta tag sku (que o Tenda formata como 000000000000977660-UN)
      let skuRaw = $('meta[itemprop="sku"]').attr("content")?.trim();
      if (skuRaw) {
        // Remove os zeros à esquerda e o sufixo "-UN" para extrair o EAN puro
        ean = skuRaw.replace(/^0+/, "").split("-")[0];
      }

      // ESTRATÉGIA 2: Fallback para o script application/ld+json
      if (!ean || !name || !Number.isFinite(price)) {
        $('script[type="application/ld+json"]').each((_, el) => {
          try {
            const jsonLd = JSON.parse($(el).html() || "{}");
            if (jsonLd["@type"] === "Product" || jsonLd.name) {
              if (!name) name = jsonLd.name;
              if (!ean && jsonLd.gtin) ean = jsonLd.gtin;
              if (!ean && jsonLd.sku) {
                 ean = jsonLd.sku.replace(/^0+/, "").split("-")[0];
              }
              if (!Number.isFinite(price) && jsonLd.offers && jsonLd.offers.price) {
                price = Number(jsonLd.offers.price);
              }
              if (!Number.isFinite(price) && jsonLd.offers && jsonLd.offers.lowPrice) {
                price = Number(jsonLd.offers.lowPrice);
              }
            }
          } catch (e) {}
        });
      }

      if (!ean || !name || !Number.isFinite(price)) {
        this.logger.warn(`Não foi possível extrair os dados completos da página. (EAN: ${ean}, Nome: ${name}, Preço: ${price})`);
        return { isBlocked: true }; 
      }

      return { isAvailable: true, ean, name, price, url };

    } catch (error) {
      this.logger.error(`Erro ao acessar ${originalUrl}:`, (error as Error).message);
      return { isBlocked: true };
    }
  }

  async run() {
    this.logger.log("Iniciando atualização de preços via URL no Tenda Atacado...");

    const products = await this.prisma.marketProduct.findMany({
      where: {
        url: { not: null },
        market: { slug: "TENDA_ATACADO" },
      },
      select: {
        id: true,
        url: true,
        nameInMarket: true,
      },
    });

    this.logger.log(`Encontrados ${products.length} produtos para atualizar.`);

    for (const product of products) {
      if (!product.url) continue;

      this.logger.debug(`Raspando Tenda Atacado: ${product.url}`);

      const scrapedData = await this.scrapeSingleProduct(product.url);

      try {
        await this.prisma.$transaction(async (tx) => {
          if (scrapedData && "isBlocked" in scrapedData) {
            this.logger.warn(`Bloqueio/Falha de parser no produto ${product.id}. Pulando para proteger o BD.`);
            return;
          }

          if (scrapedData && scrapedData.isAvailable === false) {
            await tx.marketProduct.update({
              where: { id: product.id },
              data: {
                isAvailable: false,
                lastScrapedAt: new Date(),
              },
            });
            this.logger.warn(`Produto ${product.id} atualizado como indisponível (Erro 404).`);
          } else if (scrapedData && scrapedData.isAvailable === true) {
            await tx.marketProduct.update({
              where: { id: product.id },
              data: {
                nameInMarket: scrapedData.name,
                isAvailable: true,
                lastScrapedAt: new Date(),
              },
            });

            await tx.priceHistory.create({
              data: {
                price: scrapedData.price!,
                timestamp: new Date(),
                marketProductId: product.id,
              },
            });

            this.logger.log(
              `ID do Produto ${product.id}, Name: ${product.nameInMarket}, Preço atualizado: R$ ${scrapedData.price}`
            );
          }
        });
      } catch (error) {
        this.logger.error(`Erro ao salvar no banco o produto ${product.id}:`, error);
      }
      // Protege contra rate-limit
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    this.logger.log("Atualizaçã do Tenda Atacado finalizada!");
  }
}