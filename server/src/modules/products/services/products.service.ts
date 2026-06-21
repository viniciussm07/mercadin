import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductsRepository } from "../repositories/products.repository";
import { ProductCatalogRepository } from "../repositories/product-catalog.repository";
import { ProductIngestService } from "./product-ingest.service";
import { ScrapingOrchestratorService } from "@/modules/scraping/scraping-orchestrator.service";
import { rankResults } from "../utils/rank-results";
import { normalizeSearchText } from "../utils/normalize-search-text";
import { ProductSearchGroup, ProductsSearchResponse } from "./types";

const SEARCH_QUERY_MIN_LENGTH = 2;

@Injectable()
export class ProductsService {
  constructor(
    private readonly repo: ProductsRepository,
    private readonly catalog: ProductCatalogRepository,
    private readonly ingest: ProductIngestService,
    private readonly orchestrator: ScrapingOrchestratorService,
  ) {}

  async search(query: string, marketSlugs?: string[]): Promise<ProductsSearchResponse> {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < SEARCH_QUERY_MIN_LENGTH) {
      throw new BadRequestException("Search query must have at least 2 characters.");
    }

    const normalizedQuery = normalizeSearchText(trimmedQuery);
    const selectedMarketSlugs =
      marketSlugs && marketSlugs.length > 0 ? [...new Set(marketSlugs)] : undefined;

    if (!selectedMarketSlugs) {
      const fresh = await this.repo.isQueryFresh(normalizedQuery, null);
      if (fresh) {
        return {
          source: "cache" as const,
          items: await this.findGroupedSearchResults(normalizedQuery),
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
        items: await this.findGroupedSearchResults(normalizedQuery),
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
      items: await this.findGroupedSearchResults(normalizedQuery, selectedMarketSlugs),
    };
  }

  private async findGroupedSearchResults(
    normalizedQuery: string,
    marketSlugs?: string[],
  ): Promise<ProductSearchGroup[]> {
    const products = await this.repo.findByQuery({ normalizedQuery, marketSlugs });
    const rankedProducts = rankResults(normalizedQuery, products);
    const groups = new Map<string, ProductSearchGroup>();

    for (const product of rankedProducts) {
      const groupKey = product.masterProductId;
      const currentGroup = groups.get(groupKey);

      if (currentGroup) {
        currentGroup.items.push(product);
        continue;
      }

      groups.set(groupKey, {
        ean: product.masterProduct.ean,
        masterProduct: product.masterProduct,
        items: [product],
      });
    }

    return Array.from(groups.values())
      .map(group => ({
        ...group,
        offers: group.items.sort((first, second) => first.currentPrice - second.currentPrice),
      }))
      .slice(0, 100);
  }

  findAll() {
    return this.catalog.findAll();
  }
}
