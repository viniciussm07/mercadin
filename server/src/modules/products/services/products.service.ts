import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductsRepository } from "../repositories/products.repository";
import { ProductIngestService } from "./product-ingest.service";
import { ScrapingOrchestratorService } from "@/modules/scraping/scraping-orchestrator.service";
import { rankResults } from "../utils/rank-results";

const SEARCH_QUERY_MIN_LENGTH = 2;

@Injectable()
export class ProductsService {
  constructor(
    private readonly repo: ProductsRepository,
    private readonly ingest: ProductIngestService,
    private readonly orchestrator: ScrapingOrchestratorService,
  ) {}

  async search(query: string, marketSlugs?: string[]) {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < SEARCH_QUERY_MIN_LENGTH) {
      throw new BadRequestException("Search query must have at least 2 characters.");
    }

    const normalizedQuery = trimmedQuery.toLowerCase();
    const selectedMarketSlugs =
      marketSlugs && marketSlugs.length > 0 ? [...new Set(marketSlugs)] : undefined;

    if (!selectedMarketSlugs) {
      const fresh = await this.repo.isQueryFresh(normalizedQuery, null);
      if (fresh) {
        return {
          source: "cache" as const,
          items: rankResults(
            normalizedQuery,
            await this.repo.findByQuery({ q: trimmedQuery }),
          ).slice(0, 100),
        };
      }

      const batches = await this.orchestrator.search(trimmedQuery);
      for (const batch of batches) {
        if (batch.products.length > 0) {
          await this.ingest.ingest(batch);
        }
      }

      if (batches.length === this.orchestrator.listScrapers().length) {
        await this.repo.touchQueryCache(normalizedQuery, null);
      }

      return {
        source: batches.length > 0 ? ("scrape" as const) : ("cache" as const),
        items: rankResults(normalizedQuery, await this.repo.findByQuery({ q: trimmedQuery })).slice(
          0,
          100,
        ),
      };
    }

    let source: "cache" | "scrape" = "cache";
    for (const marketSlug of selectedMarketSlugs) {
      const fresh = await this.repo.isQueryFresh(normalizedQuery, marketSlug);
      if (fresh) {
        continue;
      }

      const batches = await this.orchestrator.search(trimmedQuery, marketSlug);
      const scrapedMarket = batches.some(batch => batch.marketSlug === marketSlug);
      for (const batch of batches) {
        if (batch.products.length > 0) {
          await this.ingest.ingest(batch);
        }
      }

      if (scrapedMarket) {
        await this.repo.touchQueryCache(normalizedQuery, marketSlug);
        source = "scrape";
      }
    }

    return {
      source,
      items: rankResults(
        normalizedQuery,
        await this.repo.findByQuery({ q: trimmedQuery, marketSlugs: selectedMarketSlugs }),
      ).slice(0, 100),
    };
  }

  findAll() {
    return this.repo.findAll();
  }
}
