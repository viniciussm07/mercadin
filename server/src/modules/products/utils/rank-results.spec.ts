import { normalizeSearchText } from "./normalize-search-text";
import { rankResults } from "./rank-results";

describe("product search utilities", () => {
  it("normalizes accents, casing and whitespace", () => {
    expect(normalizeSearchText("  Açúcar   CRISTAL  ")).toBe("acucar cristal");
  });

  it("ranks exact and ordered matches before partial matches", () => {
    const products = [
      {
        nameInMarket: "Arroz integral premium",
        currentPrice: 8,
        masterProductId: "master-2",
      },
      { nameInMarket: "Arroz integral", currentPrice: 10, masterProductId: "master-1" },
      { nameInMarket: "Integral arroz", currentPrice: 6, masterProductId: "master-3" },
    ];

    expect(rankResults("arroz integral", products).map(product => product.masterProductId)).toEqual(
      ["master-1", "master-2", "master-3"],
    );
  });

  it("boosts repeated master products and uses price as tie breaker", () => {
    const products = [
      { nameInMarket: "Rice", currentPrice: 12, masterProductId: "shared" },
      { nameInMarket: "Rice", currentPrice: 9, masterProductId: "shared" },
      { nameInMarket: "Rice", currentPrice: 5, masterProductId: null },
    ];

    expect(rankResults("rice", products).map(product => product.currentPrice)).toEqual([9, 12, 5]);
  });

  it("handles queries with no matching tokens", () => {
    const products = [{ nameInMarket: "Beans premium", currentPrice: 4, masterProductId: "beans" }];

    expect(rankResults("rice", products)).toEqual(products);
  });
});
