import type { ScrapedProduct } from "../types/scraped-product.type";

export interface IMarketScraper {
  readonly marketSlug: string;
  readonly marketName: string;
  readonly marketUrl: string;
  search(query: string): Promise<ScrapedProduct[]>;
}
