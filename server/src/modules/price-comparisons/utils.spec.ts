import type { AggregatedItem, PriceComparisonItem } from "./types";
import { aggregateByMaster, buildByMarketCarts } from "./utils";

const variants = [
  {
    id: "offer-a",
    marketId: "market-a",
    currentPrice: 5.25,
    market: { name: "Market A" },
  },
  {
    id: "offer-b",
    marketId: "market-b",
    currentPrice: 4.5,
    market: { name: "Market B" },
  },
];

const createRawItem = (id: string, quantity: number): PriceComparisonItem =>
  ({
    id,
    quantity,
    marketProduct: {
      masterProduct: {
        id: "master-1",
        name: "Rice",
        variants,
      },
    },
  }) as PriceComparisonItem;

describe("price comparison utilities", () => {
  it("aggregates quantities by master product", () => {
    const result = aggregateByMaster([createRawItem("item-1", 2), createRawItem("item-2", 3)]);

    expect(result).toEqual([
      {
        masterProductId: "master-1",
        masterProductName: "Rice",
        quantity: 5,
        variants: [
          {
            marketId: "market-a",
            marketName: "Market A",
            marketProductId: "offer-a",
            price: 5.25,
          },
          {
            marketId: "market-b",
            marketName: "Market B",
            marketProductId: "offer-b",
            price: 4.5,
          },
        ],
      },
    ]);
  });

  it("builds complete and incomplete single-market carts", () => {
    const items: AggregatedItem[] = [
      {
        masterProductId: "rice",
        masterProductName: "Rice",
        quantity: 2,
        variants: [
          {
            marketId: "a",
            marketName: "Market A",
            marketProductId: "rice-a",
            price: 5.25,
          },
          {
            marketId: "b",
            marketName: "Market B",
            marketProductId: "rice-b",
            price: 4.5,
          },
        ],
      },
      {
        masterProductId: "beans",
        masterProductName: "Beans",
        quantity: 1,
        variants: [
          {
            marketId: "a",
            marketName: "Market A",
            marketProductId: "beans-a",
            price: 7.1,
          },
        ],
      },
    ];

    expect(buildByMarketCarts(items)).toEqual([
      {
        marketId: "a",
        marketName: "Market A",
        total: 17.6,
        isComplete: true,
        missing: [],
        picks: [
          {
            masterProductId: "rice",
            masterProductName: "Rice",
            quantity: 2,
            unitPrice: 5.25,
            subtotal: 10.5,
          },
          {
            masterProductId: "beans",
            masterProductName: "Beans",
            quantity: 1,
            unitPrice: 7.1,
            subtotal: 7.1,
          },
        ],
      },
      expect.objectContaining({
        marketId: "b",
        total: 9,
        isComplete: false,
        missing: ["Beans"],
      }),
    ]);
  });
});
