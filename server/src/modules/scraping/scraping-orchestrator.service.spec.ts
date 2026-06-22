import { Logger, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { IMarketScraper } from "./interfaces/market-scraper.interface";
import { ScrapingOrchestratorService } from "./scraping-orchestrator.service";
import { SCRAPERS } from "./tokens";

const createScraper = (slug: string): jest.Mocked<IMarketScraper> => ({
  marketSlug: slug,
  marketName: `Market ${slug}`,
  marketUrl: `https://${slug}.test`,
  search: jest.fn(),
});

describe("ScrapingOrchestratorService", () => {
  const first = createScraper("FIRST");
  const second = createScraper("SECOND");
  let service: ScrapingOrchestratorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ScrapingOrchestratorService, { provide: SCRAPERS, useValue: [first, second] }],
    }).compile();
    service = moduleRef.get(ScrapingOrchestratorService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("lists and finds registered scrapers", () => {
    expect(service.listScrapers()).toEqual([first, second]);
    expect(service.findScraper("SECOND")).toBe(second);
    expect(service.findScraper("UNKNOWN")).toBeUndefined();
  });

  it("searches all scrapers and builds batches", async () => {
    first.search.mockResolvedValueOnce([{ ean: "1234", sku: "1", name: "Rice", price: 10 }]);
    second.search.mockResolvedValueOnce([]);

    await expect(service.search("rice")).resolves.toEqual([
      {
        marketSlug: "FIRST",
        marketName: "Market FIRST",
        marketUrl: "https://FIRST.test",
        products: [{ ean: "1234", sku: "1", name: "Rice", price: 10 }],
      },
      {
        marketSlug: "SECOND",
        marketName: "Market SECOND",
        marketUrl: "https://SECOND.test",
        products: [],
      },
    ]);
  });

  it("searches only the selected market", async () => {
    second.search.mockResolvedValueOnce([]);

    await expect(service.search("rice", "SECOND")).resolves.toHaveLength(1);
    expect(first.search).not.toHaveBeenCalled();
    expect(second.search).toHaveBeenCalledWith("rice");
  });

  it("keeps successful batches when a scraper fails", async () => {
    jest.spyOn(Logger.prototype, "error").mockImplementation();
    first.search.mockRejectedValueOnce(new Error("offline"));
    second.search.mockResolvedValueOnce([]);

    await expect(service.search("rice")).resolves.toEqual([
      {
        marketSlug: "SECOND",
        marketName: "Market SECOND",
        marketUrl: "https://SECOND.test",
        products: [],
      },
    ]);
  });

  it("rejects an unknown selected market", async () => {
    await expect(service.search("rice", "UNKNOWN")).rejects.toBeInstanceOf(NotFoundException);
  });
});
