import { Injectable, Logger } from "@nestjs/common";
import * as cheerio from "cheerio";
import type { IMarketScraper } from "../interfaces/market-scraper.interface";
import type { ScrapedProduct } from "../types/scraped-product.type";

const BASE_URL = "https://www.jauserve.com.br";
const SEARCH_PATH = "/on/demandware.store/Sites-JauServe-Site/pt_BR/Search-Show";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

@Injectable()
export class JauserveScraper implements IMarketScraper {
  readonly marketSlug = "jauserve";
  readonly marketName = "Jaú Serve";
  readonly marketUrl = BASE_URL;

  private readonly logger = new Logger(JauserveScraper.name);

  async search(query: string): Promise<ScrapedProduct[]> {
    const url = `${BASE_URL}${SEARCH_PATH}?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });
    if (!res.ok) {
      this.logger.warn(`Jauserve search failed (${res.status}) for query "${query}"`);
      return [];
    }
    const html = await res.text();
    return this.parse(html);
  }

  private parse(html: string): ScrapedProduct[] {
    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = [];

    $("div.grid-tile").each((_, el) => {
      const tile = $(el);
      const ean = tile.attr("data-pid")?.trim();
      if (!ean || !/^\d{8,14}$/.test(ean)) return;

      const anchor = tile.find("a.link.txt-ellipsis").first();
      const href = anchor.attr("href")?.trim();
      const name = anchor.text().trim() || tile.find("img.tile-image").attr("title")?.trim();
      if (!name) return;

      const priceAttr = tile.find("span.value").first().attr("content")?.trim();
      const price = priceAttr ? Number(priceAttr) : NaN;
      if (!Number.isFinite(price) || price <= 0) return;

      const imageUrl = tile.find("img.tile-image").attr("src")?.trim();
      const productUrl = href?.startsWith("http") ? href : href ? `${BASE_URL}${href}` : undefined;

      products.push({
        ean,
        sku: ean,
        name,
        price,
        imageUrl,
        url: productUrl,
      });
    });

    return products;
  }
}
