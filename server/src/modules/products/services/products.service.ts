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

  async search(query: string, marketSlug?: string) {
    const marketName = marketSlug
      ? this.orchestrator.findScraper(marketSlug)!.marketName
      : undefined;

    const cached = await this.repo.findFreshByQuery({ q: query, marketName });
    if (cached.length > 0) {
      return { source: "cache" as const, items: cached };
    }

    const batches = await this.orchestrator.search(query, marketSlug);
    for (const batch of batches) {
      if (batch.products.length > 0) {
        await this.ingest.ingest(batch);
      }
    }

    const fresh = await this.repo.findFreshByQuery({ q: query, marketName });
    return { source: "scrape" as const, items: fresh };
  }

  findAll() {
    return this.repo.findAll();
  }
}
