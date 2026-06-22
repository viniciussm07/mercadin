/* istanbul ignore file */
import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import { PrismaService } from "@database/prisma.service";
import { BaseScraper } from "./base-scraper";

@Injectable()
export class TendaAtacadoCronScraper extends BaseScraper {
  protected readonly logger = new Logger(TendaAtacadoCronScraper.name);

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  private parseJsonLd(html: string) {
    const $ = cheerio.load(html);
    let result = { ean: "", name: "", price: Number.NaN };
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonLd = JSON.parse($(el).html() || "{}");
        if (jsonLd["@type"] === "Product" || jsonLd.name) {
          if (!result.name) result.name = jsonLd.name;
          if (!result.ean && jsonLd.gtin) result.ean = jsonLd.gtin;
          if (!result.ean && jsonLd.sku) result.ean = jsonLd.sku.replace(/^0+/, "").split("-")[0];
          const price = jsonLd.offers?.price || jsonLd.offers?.lowPrice;
          if (!Number.isFinite(result.price) && price) result.price = Number(price);
        }
      } catch {}
    });
    return result;
  }

  private async scrapeSingleProduct(url: string) {
    try {
      const res = await fetch(url.replace("https://tendaatacado", "https://www.tendaatacado"), { headers: { "User-Agent": "..." } });
      if (res.status === 404) return { isAvailable: false };
      
      const html = await res.text();
      const $ = cheerio.load(html);
      
      /* eslint-disable-next-line quotes */
      let name = $('meta[itemprop="name"]').attr("content")?.trim() || "";
      let price = Number($('meta[itemprop="price"]').attr("content")?.trim() || NaN);
      let ean = $('meta[itemprop="sku"]').attr("content")?.trim()?.replace(/^0+/, "").split("-")[0] || "";

      if (!ean || !name || !Number.isFinite(price)) {
        const parsed = this.parseJsonLd(html);
        ean = parsed.ean || ean; name = parsed.name || name; price = parsed.price || price;
      }
      return { isAvailable: true, ean, name, price, url };
    } catch { return { isBlocked: true }; }
  }

  async run() {
    this.logger.log("Iniciando Tenda...");
    const products = await this.prisma.marketProduct.findMany({
      where: { url: { not: null }, market: { slug: "TENDA_ATACADO" } },
      select: { id: true, url: true },
    });

    for (const product of products) {
      const data = await this.scrapeSingleProduct(product.url!);
      await this.updateDatabase(product, data, "TENDA_ATACADO");
      await new Promise(r => setTimeout(r, 500));
    }
  }
}