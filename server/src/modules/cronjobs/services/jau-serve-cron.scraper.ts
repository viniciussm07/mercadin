/* istanbul ignore file */
/* eslint-disable */

import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import { PrismaService } from "@database/prisma.service";
import { BaseScraper } from "./base-scraper";

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

@Injectable()
export class JauServeCronScraper extends BaseScraper {
  protected readonly logger = new Logger(JauServeCronScraper.name);

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  private async scrapeSingleProduct(url: string) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html" } });
      if (res.status === 404) return null;
      const html = await res.text();
      const $ = cheerio.load(html);

      let ean = $(".product-detail").attr("data-pid")?.trim();
      if (!ean) ean = $(".product-infos .product-id").text().replace(/[^\d]/g, "");
      if (!ean || !/^\d{4,5}$|^\d{8,14}$/.test(ean)) return null;

      const name = $("h1.product-name").text().trim();
      const priceAttr = $(".prices .value").first().attr("content")?.trim();
      const price = priceAttr ? Number(priceAttr) : Number.NaN;
      
      if (!name || !Number.isFinite(price)) return null;
      return { ean, name, price, isAvailable: true, url };
    } catch { return null; }
  }

  async run() {
    this.logger.log("Iniciando Jau Serve...");
    const products = await this.prisma.marketProduct.findMany({
      where: { url: { not: null }, market: { slug: "JAU_SERVE" } },
      select: { id: true, url: true },
    });

    for (const product of products) {
      const data = await this.scrapeSingleProduct(product.url!);
      await this.updateDatabase(product, data, 'JAU_SERVE');
    }
  }
}