/* istanbul ignore file */

import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import "dotenv/config";
import { PrismaService } from "@database/prisma.service";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

@Injectable()
export class TendaAtacadoCronScraper {
  private readonly logger = new Logger(TendaAtacadoCronScraper.name);

  constructor(private readonly prisma: PrismaService) {}

  private parseJsonLd(html: string, ean: string, name: string, price: number) {
    const $ = cheerio.load(html);
    let parsedEan = ean;
    let parsedName = name;
    let parsedPrice = price;

    /* eslint-disable-next-line quotes */
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonLd = JSON.parse($(el).html() || "{}");
        if (jsonLd["@type"] === "Product" || jsonLd.name) {
          if (!parsedName) parsedName = jsonLd.name;
          if (!parsedEan && jsonLd.gtin) parsedEan = jsonLd.gtin;
          if (!parsedEan && jsonLd.sku) {
            parsedEan = jsonLd.sku.replace(/^0+/, "").split("-")[0];
          }
          if (!Number.isFinite(parsedPrice) && jsonLd.offers?.price) {
            parsedPrice = Number(jsonLd.offers.price);
          }
          if (!Number.isFinite(parsedPrice) && jsonLd.offers?.lowPrice) {
            parsedPrice = Number(jsonLd.offers.lowPrice);
          }
        }
      } catch {
        this.logger.debug("Falha JSON-LD");
      }
    });
    return { ean: parsedEan, name: parsedName, price: parsedPrice };
  }

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
      if (!res.ok) throw new Error(`Falha: ${res.status}`);

      const html = await res.text();
      const $ = cheerio.load(html);

      /* eslint-disable-next-line quotes */
      let name = $('meta[itemprop="name"]').attr("content")?.trim() || "";
      let price = Number.NaN;
      let ean = "";

      /* eslint-disable-next-line quotes */
      const priceText = $('meta[itemprop="price"]').attr("content")?.trim();
      if (priceText) price = Number(priceText);

      /* eslint-disable-next-line quotes */
      const skuRaw = $('meta[itemprop="sku"]').attr("content")?.trim();
      if (skuRaw) ean = skuRaw.replace(/^0+/, "").split("-")[0];

      if (!ean || !name || !Number.isFinite(price)) {
        const parsed = this.parseJsonLd(html, ean, name, price);
        ean = parsed.ean;
        name = parsed.name;
        price = parsed.price;
      }

      if (!ean || !name || !Number.isFinite(price)) return { isBlocked: true };

      return { isAvailable: true, ean, name, price, url };
    } catch (error) {
      this.logger.error(`Erro ${originalUrl}:`, (error as Error).message);
      return { isBlocked: true };
    }
  }

  async run() {
    this.logger.log("Iniciando atualização Tenda Atacado...");

    const products = await this.prisma.marketProduct.findMany({
      where: { url: { not: null }, market: { slug: "TENDA_ATACADO" } },
      select: { id: true, url: true, nameInMarket: true },
    });

    for (const product of products) {
      if (!product.url) continue;

      const scrapedData = await this.scrapeSingleProduct(product.url);

      try {
        await this.prisma.$transaction(async tx => {
          if (scrapedData?.isBlocked) {
            this.logger.warn(`Bloqueio no produto ${product.id}. Pulando.`);
            return;
          }

          if (scrapedData?.isAvailable === true) {
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

            this.logger.log(`ID: ${product.id} atualizado: R$ ${scrapedData.price}`);
          } else {
            await tx.marketProduct.update({
              where: { id: product.id },
              data: { isAvailable: false, lastScrapedAt: new Date() },
            });
            this.logger.warn(`Produto ${product.id} indisponível (404).`);
          }
        });
      } catch (error) {
        this.logger.error(`Erro BD ${product.id}:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    this.logger.log("Atualização finalizada!");
  }
}
