import type { AggregatedItem } from "./types";
import { buildSuperCart } from "./utils";

describe("buildSuperCart", () => {
  it("selects the cheapest offers and reports unavailable products", () => {
    const items: AggregatedItem[] = [
      {
        masterProductId: "rice",
        masterProductName: "Rice",
        quantity: 2,
        variants: [
          { marketId: "a", marketName: "A", marketProductId: "1", price: 5 },
          { marketId: "b", marketName: "B", marketProductId: "2", price: 4 },
        ],
      },
      {
        masterProductId: "missing",
        masterProductName: "Missing",
        quantity: 1,
        variants: [],
      },
    ];

    expect(buildSuperCart(items)).toEqual({
      total: 8,
      marketsCount: 1,
      isComplete: false,
      missing: ["Missing"],
      picks: [
        {
          masterProductId: "rice",
          masterProductName: "Rice",
          quantity: 2,
          unitPrice: 4,
          subtotal: 8,
          marketId: "b",
          marketName: "B",
        },
      ],
    });
  });
});
