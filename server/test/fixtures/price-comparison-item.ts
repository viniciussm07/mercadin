import type { PriceComparisonItem } from "@/modules/price-comparisons/types";

interface TestVariant {
  id: string;
  marketId: string;
  price: number;
  market: { name: string };
}

interface CreatePriceComparisonItemOptions {
  id: string;
  quantity: number;
  masterProductId?: string;
  masterProductName?: string;
  variants: TestVariant[];
}

export const createPriceComparisonItem = ({
  id,
  quantity,
  masterProductId = id,
  masterProductName = id,
  variants,
}: CreatePriceComparisonItemOptions): PriceComparisonItem => {
  const createdAt = new Date("2026-01-01T00:00:00.000Z");
  return {
    id,
    quantity,
    createdAt,
    listId: "list-1",
    marketProductId: `${id}-selected`,
    marketProduct: {
      id: `${id}-selected`,
      sku: `${id}-selected`,
      nameInMarket: masterProductName,
      url: null,
      isAvailable: true,
      lastScrapedAt: createdAt,
      marketId: "selected-market",
      masterProductId,
      masterProduct: {
        id: masterProductId,
        ean: `${masterProductId}-ean`,
        name: masterProductName,
        imageUrl: null,
        brand: null,
        createdAt,
        variants: variants.map(variant => ({
          id: variant.id,
          sku: variant.id,
          nameInMarket: masterProductName,
          url: null,
          isAvailable: true,
          lastScrapedAt: createdAt,
          marketId: variant.marketId,
          masterProductId,
          market: {
            id: variant.marketId,
            slug: variant.marketId,
            name: variant.market.name,
            url: null,
          },
          history: [{ price: variant.price }],
        })),
      },
    },
  };
};
