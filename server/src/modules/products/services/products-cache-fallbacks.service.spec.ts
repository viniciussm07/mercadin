import { createProductsServiceTestContext } from "../../../../test/helpers/create-products-service-test-context";

describe("ProductsService cache fallbacks", () => {
  let context: Awaited<ReturnType<typeof createProductsServiceTestContext>>;

  beforeAll(async () => {
    context = await createProductsServiceTestContext();
  });

  beforeEach(() => jest.clearAllMocks());

  it("falls back to cached results when no global scraper succeeds", async () => {
    const { ingest, orchestrator, repo, service } = context;
    repo.isQueryFresh.mockResolvedValueOnce(false);
    repo.findByQuery.mockResolvedValueOnce([]);
    orchestrator.search.mockResolvedValueOnce([]);
    orchestrator.listScrapers.mockReturnValueOnce([{}]);

    await expect(service.search("rice")).resolves.toEqual({ source: "cache", items: [] });

    expect(ingest.ingest).not.toHaveBeenCalled();
    expect(repo.touchQueryCache).not.toHaveBeenCalled();
  });

  it("does not refresh a selected scope when its scraper returns another market", async () => {
    const { ingest, orchestrator, repo, service } = context;
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
