/* istanbul ignore file */

import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import "dotenv/config";
import { PrismaService } from "@database/prisma.service";

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

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
      const price = priceAttr ? Number(priceAttr) : Number.NaN;
      if (!Number.isFinite(price) || price <= 0) return null;

      return { ean, name, price, url };
    } catch (error) {
      this.logger.error(`Erro ao acessar ${url}:`, error);
      return null;
    }
  }

  async run() {
    this.logger.log("Iniciando atualização de preços no Jau Serve...");

    const products = await this.prisma.marketProduct.findMany({
      where: { url: { not: null }, market: { slug: "JAU_SERVE" } },
      select: { id: true, url: true, nameInMarket: true },
    });

    for (const product of products) {
      if (!product.url) continue;

      const scrapedData = await this.scrapeSingleProduct(product.url);

      try {
        await this.prisma.$transaction(async tx => {
          if (scrapedData) {
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

            this.logger.log(`ID: ${product.id} atualizado: R$ ${scrapedData.price}`);
          } else {
            await tx.marketProduct.update({
              where: { id: product.id },
              data: { isAvailable: false, lastScrapedAt: new Date() },
            });
            this.logger.warn(`Produto ${product.id} indisponível.`);
          }
        });
      } catch (error) {
        this.logger.error(`Erro BD ${product.id}:`, error);
      }
    }
    this.logger.log("Atualização do Jau Serve finalizada!");
  }
}
