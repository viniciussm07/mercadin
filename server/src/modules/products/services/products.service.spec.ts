import { BadRequestException } from "@nestjs/common";
import { createProductsServiceTestContext } from "../../../../test/helpers/create-products-service-test-context";
import type { SearchProduct } from "./types";

const createProduct = (
  id: string,
  masterProductId: string,
  nameInMarket: string,
  currentPrice: number,
): SearchProduct =>
  ({
    id,
    masterProductId,
    nameInMarket,
    currentPrice,
    masterProduct: {
      id: masterProductId,
      ean: `ean-${masterProductId}`,
      name: nameInMarket,
    },
  }) as SearchProduct;

describe("ProductsService", () => {
  let context: Awaited<ReturnType<typeof createProductsServiceTestContext>>;

  beforeAll(async () => {
    context = await createProductsServiceTestContext();
  });

  beforeEach(() => jest.clearAllMocks());

  it("rejects short normalized queries", async () => {
    const { service } = context;
    await expect(service.search(" a ")).rejects.toBeInstanceOf(BadRequestException);
  });

  it("returns grouped and price-sorted cached results", async () => {
    const { orchestrator, repo, service } = context;
    repo.isQueryFresh.mockResolvedValueOnce(true);
    repo.findByQuery.mockResolvedValueOnce([
      createProduct("offer-1", "master-1", "Arroz", 12),
      createProduct("offer-2", "master-1", "Arroz", 9),
    ]);

    const result = await service.search("  Arroz  ");

    expect(result.source).toBe("cache");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].items.map(offer => offer.currentPrice)).toEqual([9, 12]);
    expect(repo.findByQuery).toHaveBeenCalledWith({ normalizedQuery: "arroz" });
    expect(orchestrator.search).not.toHaveBeenCalled();
  });

  it("scrapes all markets, ingests products and refreshes the global cache", async () => {
    const { ingest, orchestrator, repo, service } = context;
    const batch = {
      marketSlug: "MARKET",
      marketName: "Market",
      marketUrl: "https://market.test",
      products: [{ ean: "1234", sku: "1", name: "Rice", price: 10 }],
    };
    repo.isQueryFresh.mockResolvedValueOnce(false);
    repo.findByQuery.mockResolvedValueOnce([]);
    orchestrator.search.mockResolvedValueOnce([batch, { ...batch, products: [] }]);
    orchestrator.listScrapers.mockReturnValueOnce([{}, {}]);

    await expect(service.search("rice")).resolves.toEqual({ source: "scrape", items: [] });

    expect(ingest.ingest).toHaveBeenCalledTimes(1);
    expect(ingest.ingest).toHaveBeenCalledWith(batch);
    expect(repo.touchQueryCache).toHaveBeenCalledWith("rice", null);
  });

  it("keeps cache source when every selected market is fresh", async () => {
    const { repo, service } = context;
    repo.isQueryFresh.mockResolvedValue(true);
    repo.findByQuery.mockResolvedValueOnce([]);

    await expect(service.search("rice", ["A", "A", "B"])).resolves.toEqual({
      source: "cache",
      items: [],
    });

    expect(repo.isQueryFresh).toHaveBeenCalledTimes(2);
    expect(repo.findByQuery).toHaveBeenCalledWith({
      normalizedQuery: "rice",
      marketSlugs: ["A", "B"],
    });
  });

  it("scrapes stale selected markets and refreshes only successful scopes", async () => {
    const { ingest, orchestrator, repo, service } = context;
    const batch = {
      marketSlug: "B",
      marketName: "Market B",
      marketUrl: "https://b.test",
      products: [{ ean: "1234", sku: "1", name: "Rice", price: 10 }],
    };
    repo.isQueryFresh.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    repo.findByQuery.mockResolvedValueOnce([]);
    orchestrator.search.mockResolvedValueOnce([batch]);

    await expect(service.search("rice", ["A", "B"])).resolves.toEqual({
      source: "scrape",
      items: [],
    });

    expect(orchestrator.search).toHaveBeenCalledWith("rice", "B");
    expect(ingest.ingest).toHaveBeenCalledWith(batch);
    expect(repo.touchQueryCache).toHaveBeenCalledWith("rice", "B");
  });

  it("delegates full product listing", () => {
    const { catalog, service } = context;
    service.findAll();
    expect(catalog.findAll).toHaveBeenCalledTimes(1);
  });
});
