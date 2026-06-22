import { Test } from "@nestjs/testing";
import { ProductCatalogRepository } from "@/modules/products/repositories/product-catalog.repository";
import { ProductsRepository } from "@/modules/products/repositories/products.repository";
import { ProductIngestService } from "@/modules/products/services/product-ingest.service";
import { ProductsService } from "@/modules/products/services/products.service";
import { ScrapingOrchestratorService } from "@/modules/scraping/scraping-orchestrator.service";

export async function createProductsServiceTestContext() {
  const repo = {
    findByQuery: jest.fn(),
    isQueryFresh: jest.fn(),
    touchQueryCache: jest.fn(),
  };
  const catalog = { findAll: jest.fn() };
  const ingest = { ingest: jest.fn() };
  const orchestrator = {
    listScrapers: jest.fn(),
    search: jest.fn(),
  };
  const moduleRef = await Test.createTestingModule({
    providers: [
      ProductsService,
      { provide: ProductsRepository, useValue: repo },
      { provide: ProductCatalogRepository, useValue: catalog },
      { provide: ProductIngestService, useValue: ingest },
      { provide: ScrapingOrchestratorService, useValue: orchestrator },
    ],
  }).compile();

  return {
    catalog,
    ingest,
    orchestrator,
    repo,
    service: moduleRef.get(ProductsService),
  };
}
