import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { createPriceComparisonItem } from "../../../../test/fixtures/price-comparison-item";
import { PriceComparisonsRepository } from "../repositories/price-comparisons.repository";
import { PriceComparisonsService } from "./price-comparisons.service";

describe("PriceComparisonsService", () => {
  const repo = {
    findItemsWithVariants: jest.fn(),
    findListByIdForUser: jest.fn(),
  };
  let service: PriceComparisonsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PriceComparisonsService, { provide: PriceComparisonsRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(PriceComparisonsService);
  });

  beforeEach(() => jest.clearAllMocks());

  it("throws when the list is not accessible", async () => {
    repo.findListByIdForUser.mockResolvedValueOnce(null);

    await expect(service.compare("list-1", "user-1")).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.findItemsWithVariants).not.toHaveBeenCalled();
  });

  it("calculates the cheapest complete market and super-cart savings", async () => {
    repo.findListByIdForUser.mockResolvedValueOnce({ id: "list-1" });
    repo.findItemsWithVariants.mockResolvedValueOnce([
      createPriceComparisonItem({
        id: "rice",
        quantity: 2,
        variants: [
          { id: "rice-a", marketId: "a", price: 5, market: { name: "A" } },
          { id: "rice-b", marketId: "b", price: 4, market: { name: "B" } },
        ],
      }),
      createPriceComparisonItem({
        id: "beans",
        quantity: 1,
        variants: [
          { id: "beans-a", marketId: "a", price: 6, market: { name: "A" } },
          { id: "beans-b", marketId: "b", price: 8, market: { name: "B" } },
        ],
      }),
    ]);

    await expect(service.compare("list-1", "user-1")).resolves.toEqual(
      expect.objectContaining({
        listId: "list-1",
        cheapestSingleMarketId: "a",
        savings: 2,
      }),
    );
  });

  it("returns null savings when no single market is complete", async () => {
    repo.findListByIdForUser.mockResolvedValueOnce({ id: "list-1" });
    repo.findItemsWithVariants.mockResolvedValueOnce([
      createPriceComparisonItem({
        id: "rice",
        quantity: 1,
        variants: [{ id: "rice-a", marketId: "a", price: 5, market: { name: "A" } }],
      }),
      createPriceComparisonItem({ id: "beans", quantity: 1, variants: [] }),
    ]);

    await expect(service.compare("list-1", "user-1")).resolves.toEqual(
      expect.objectContaining({ cheapestSingleMarketId: null, savings: null }),
    );
  });
});
