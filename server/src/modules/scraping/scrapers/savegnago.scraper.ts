import { Injectable } from "@nestjs/common";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";
import type { IMarketScraper } from "../interfaces/market-scraper.interface";
import type { ScrapedProduct } from "../types/scraped-product.type";

const BASE_URL = "https://www.savegnago.com.br";
const SEARCH_PATH = "/api/catalog_system/pub/products/search";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const EAN_REGEX = /^\d{4,5}$|^\d{8,14}$/;
const PLU_FALLBACK_REGEX = /^\d{4,5}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

@Injectable()
export class SavegnagoScraper implements IMarketScraper {
  readonly marketSlug = MARKET_SLUGS.SAVEGNAGO;
  readonly marketName = "Savegnago";
  readonly marketUrl = BASE_URL;

  async search(query: string): Promise<ScrapedProduct[]> {
    const url = `${BASE_URL}${SEARCH_PATH}?ft=${encodeURIComponent(query)}&_from=0&_to=49`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Savegnago search failed (${res.status}) for query "${query}"`);
    }
    const data = await res.json();
    return this.parse(data);
  }

  private parse(data: unknown): ScrapedProduct[] {
    if (!Array.isArray(data)) {
      throw new Error("Unexpected Savegnago product payload");
    }

    const products: ScrapedProduct[] = [];

    for (const product of data) {
      if (!isRecord(product)) continue;

      const items = product.items;
      if (!Array.isArray(items)) continue;

      for (const item of items) {
        if (!isRecord(item)) continue;

        const rawEan = typeof item.ean === "string" ? item.ean.trim() : "";
        const rawPlu =
          typeof product.productReference === "string" ? product.productReference.trim() : "";
        const ean = EAN_REGEX.test(rawEan) ? rawEan : PLU_FALLBACK_REGEX.test(rawPlu) ? rawPlu : "";
        if (!ean) continue;

        const sellers = item.sellers;
        const seller = Array.isArray(sellers) ? sellers[0] : undefined;
        const commertialOffer = isRecord(seller) ? seller.commertialOffer : undefined;
        const priceValue = isRecord(commertialOffer) ? commertialOffer.Price : undefined;
        const price = Number(priceValue);
        if (!Number.isFinite(price) || price <= 0) continue;

        const name = typeof product.productName === "string" ? product.productName.trim() : "";
        if (!name) continue;

        const images = item.images;
        const firstImage = Array.isArray(images) ? images[0] : undefined;
        const imageUrl = isRecord(firstImage) ? firstImage.imageUrl : undefined;

        products.push({
          ean,
          sku: typeof item.itemId === "string" ? item.itemId : ean,
          name,
          price,
          imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
          url: typeof product.link === "string" ? product.link : undefined,
          brand: typeof product.brand === "string" ? product.brand : undefined,
        });
      }
    }

    return products;
  }
}
