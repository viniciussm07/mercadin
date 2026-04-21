import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { IMarketScraper } from "./interfaces/market-scraper.interface";
import type { ScrapedProduct } from "./types/scraped-product.type";
import { SCRAPERS } from "./tokens";

export interface ScrapedBatch {
  marketSlug: string;
  marketName: string;
  marketUrl: string;
  products: ScrapedProduct[];
}

@Injectable()
export class ScrapingOrchestratorService {
  private readonly logger = new Logger(ScrapingOrchestratorService.name);

  constructor(@Inject(SCRAPERS) private readonly scrapers: IMarketScraper[]) {}

  listScrapers(): IMarketScraper[] {
    return this.scrapers;
  }

  findScraper(marketSlug: string): IMarketScraper | undefined {
    return this.scrapers.find(s => s.marketSlug === marketSlug);
  }

  async search(query: string, marketSlug?: string): Promise<ScrapedBatch[]> {
    const targets = marketSlug
      ? [this.findScraper(marketSlug) ?? this.throwUnknown(marketSlug)]
      : this.scrapers;

    const results = await Promise.allSettled(
      targets.map(async scraper => {
        const products = await scraper.search(query);
        return {
          marketSlug: scraper.marketSlug,
          marketName: scraper.marketName,
          marketUrl: scraper.marketUrl,
          products,
        } satisfies ScrapedBatch;
      }),
    );

    const batches: ScrapedBatch[] = [];
    for (const [idx, result] of results.entries()) {
      if (result.status === "fulfilled") {
        batches.push(result.value);
      } else {
        this.logger.error(
          `Scraper "${targets[idx].marketSlug}" failed for query "${query}": ${String(result.reason)}`,
        );
      }
    }
    return batches;
  }

  private throwUnknown(slug: string): never {
    throw new NotFoundException(`Unknown market: ${slug}`);
  }
}
