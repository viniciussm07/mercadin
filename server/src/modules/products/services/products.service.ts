import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../repositories/products.repository";
import { ProductIngestService } from "./product-ingest.service";
import { ScrapingOrchestratorService } from "@/modules/scraping/scraping-orchestrator.service";

@Injectable()
export class ProductsService {
  constructor(
    private readonly repo: ProductsRepository,
    private readonly ingest: ProductIngestService,
    private readonly orchestrator: ScrapingOrchestratorService,
  ) {}

  async search(query: string, marketSlugs?: string[]) {
    const normalizedQuery = query.trim().toLowerCase();
    const marketNames =
      marketSlugs && marketSlugs.length > 0
        ? marketSlugs.map(marketSlug => this.orchestrator.findScraper(marketSlug)!.marketName)
        : undefined;

    if (!marketSlugs || marketSlugs.length === 0) {
      const fresh = await this.repo.isQueryFresh(normalizedQuery, null);
      if (fresh) {
        return {
          source: "cache" as const,
          items: await this.repo.findByQuery({ q: query }),
        };
      }

      const batches = await this.orchestrator.search(query);
      for (const batch of batches) {
        if (batch.products.length > 0) {
          await this.ingest.ingest(batch);
        }
      }

      if (batches.length === this.orchestrator.listScrapers().length) {
        await this.repo.touchQueryCache(normalizedQuery, null);
      }

      return {
        source: "scrape" as const,
        items: await this.repo.findByQuery({ q: query }),
      };
    }

    let source: "cache" | "scrape" = "cache";
    for (const marketSlug of marketSlugs) {
      const fresh = await this.repo.isQueryFresh(normalizedQuery, marketSlug);
      if (fresh) {
        continue;
      }

      const batches = await this.orchestrator.search(query, marketSlug);
      const scrapedMarket = batches.some(batch => batch.marketSlug === marketSlug);
      for (const batch of batches) {
        if (batch.products.length > 0) {
          await this.ingest.ingest(batch);
        }
      }

      if (scrapedMarket) {
        await this.repo.touchQueryCache(normalizedQuery, marketSlug);
      }
      source = "scrape";
    }

    return {
      source,
      items: await this.repo.findByQuery({ q: query, marketNames }),
    };
  }

  findAll() {
    return this.repo.findAll();
  }
}
