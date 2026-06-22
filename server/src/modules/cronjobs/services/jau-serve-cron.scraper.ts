import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import "dotenv/config";
import { PrismaService } from "@database/prisma.service";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

@Injectable()
export class JauServeCronScraper {
  private readonly logger = new Logger(JauServeCronScraper.name);

  constructor(private readonly prisma: PrismaService) {}

  private async scrapeSingleProduct(url: string) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Falha na requisição: ${res.status}`);

      const html = await res.text();
      const $ = cheerio.load(html);

      let ean = $(".product-detail").attr("data-pid")?.trim();
      if (!ean) {
        ean = $(".product-infos .product-id").text().replace(/[^\d]/g, "");
      }
      if (!ean || !/^\d{4,5}$|^\d{8,14}$/.test(ean)) return null;

      const name = $("h1.product-name").text().trim();
      if (!name) return null;

      const priceAttr = $(".prices .value").first().attr("content")?.trim();
      const price = priceAttr ? Number(priceAttr) : NaN;
      if (!Number.isFinite(price) || price <= 0) return null;

      return { ean, name, price, url };
    } catch (error) {
      this.logger.error(`Erro ao acessar ${url}:`, error);
      return null;
    }
  }

  async run() {
    this.logger.log("Iniciando atualização de preços via URL no Jau Serve...");

    const products = await this.prisma.marketProduct.findMany({
      where: {
        url: { not: null },
        market: { slug: "JAU_SERVE" },
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

      this.logger.debug(`Raspando Jau Serve: ${product.url}`);

      const scrapedData = await this.scrapeSingleProduct(product.url);

      try {
        await this.prisma.$transaction(async (tx) => {
          if (!scrapedData) {
            // Se o produto não existir (não foi possível fazer a raspagem) atualiza o isAvailable como false.
            await tx.marketProduct.update({
              where: { id: product.id },
              data: {
                isAvailable: false,
                lastScrapedAt: new Date(),
              },
            });
            this.logger.warn(`Produto ${product.id} atualizado como indisponível (não foi possível fazer a raspagem).`);
          } else {
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
                price: scrapedData.price,
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

      // Delay opcional para evitar rate-limit
      // await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    this.logger.log("Atualização do Jau Serve finalizada!");
  }
}