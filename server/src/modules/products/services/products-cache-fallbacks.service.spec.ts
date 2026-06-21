import { Test } from "@nestjs/testing";
import { ScrapingOrchestratorService } from "@/modules/scraping/scraping-orchestrator.service";
import { ProductsRepository } from "../repositories/products.repository";
import { ProductIngestService } from "./product-ingest.service";
import { ProductsService } from "./products.service";

describe("ProductsService cache fallbacks", () => {
  const repo = {
    findByQuery: jest.fn(),
    isQueryFresh: jest.fn(),
    touchQueryCache: jest.fn(),
  };
  const ingest = { ingest: jest.fn() };
  const orchestrator = {
    listScrapers: jest.fn(),
    search: jest.fn(),
  };
  let service: ProductsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: repo },
        { provide: ProductIngestService, useValue: ingest },
        { provide: ScrapingOrchestratorService, useValue: orchestrator },
      ],
    }).compile();
    service = moduleRef.get(ProductsService);
  });

  beforeEach(() => jest.clearAllMocks());

  it("falls back to cached results when no global scraper succeeds", async () => {
    repo.isQueryFresh.mockResolvedValueOnce(false);
    repo.findByQuery.mockResolvedValueOnce([]);
    orchestrator.search.mockResolvedValueOnce([]);
    orchestrator.listScrapers.mockReturnValueOnce([{}]);

    await expect(service.search("rice")).resolves.toEqual({ source: "cache", items: [] });

    expect(ingest.ingest).not.toHaveBeenCalled();
    expect(repo.touchQueryCache).not.toHaveBeenCalled();
  });

  it("does not refresh a selected scope when its scraper returns another market", async () => {
    repo.isQueryFresh.mockResolvedValueOnce(false);
    repo.findByQuery.mockResolvedValueOnce([]);
    orchestrator.search.mockResolvedValueOnce([
      {
        marketSlug: "OTHER",
        marketName: "Other",
        marketUrl: "https://other.test",
        products: [],
      },
    ]);

    await expect(service.search("rice", ["A"])).resolves.toEqual({
      source: "cache",
      items: [],
    });

    expect(ingest.ingest).not.toHaveBeenCalled();
    expect(repo.touchQueryCache).not.toHaveBeenCalled();
  });
});
