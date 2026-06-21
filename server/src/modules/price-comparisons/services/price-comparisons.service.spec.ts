import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PriceComparisonsRepository } from "../repositories/price-comparisons.repository";
import type { PriceComparisonItem } from "../types";
import { PriceComparisonsService } from "./price-comparisons.service";

const createItem = (
  id: string,
  quantity: number,
  variants: Array<{
    id: string;
    marketId: string;
    currentPrice: number;
    market: { name: string };
  }>,
): PriceComparisonItem =>
  ({
    id,
    quantity,
    marketProduct: {
      masterProduct: { id, name: id, variants },
    },
  }) as PriceComparisonItem;

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
      createItem("rice", 2, [
        { id: "rice-a", marketId: "a", currentPrice: 5, market: { name: "A" } },
        { id: "rice-b", marketId: "b", currentPrice: 4, market: { name: "B" } },
      ]),
      createItem("beans", 1, [
        { id: "beans-a", marketId: "a", currentPrice: 6, market: { name: "A" } },
        { id: "beans-b", marketId: "b", currentPrice: 8, market: { name: "B" } },
      ]),
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
      createItem("rice", 1, [
        { id: "rice-a", marketId: "a", currentPrice: 5, market: { name: "A" } },
      ]),
      createItem("beans", 1, []),
    ]);

    await expect(service.compare("list-1", "user-1")).resolves.toEqual(
      expect.objectContaining({ cheapestSingleMarketId: null, savings: null }),
    );
  });
});
