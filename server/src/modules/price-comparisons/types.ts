import { Prisma } from "@prisma/client";

export const priceComparisonItemInclude = {
  marketProduct: {
    include: {
      masterProduct: {
        include: {
          variants: {
            where: { isAvailable: true },
            include: {
              market: true,
              history: {
                orderBy: [{ timestamp: "desc" }, { id: "desc" }],
                take: 1,
                select: { price: true },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ShoppingListItemInclude;

export type PriceComparisonItem = Prisma.ShoppingListItemGetPayload<{
  include: typeof priceComparisonItemInclude;
}>;

export interface Variant {
  marketId: string;
  marketName: string;
  marketProductId: string;
  price: number;
}

export interface AggregatedItem {
  masterProductId: string;
  masterProductName: string;
  quantity: number;
  variants: Variant[];
}

export interface MarketCartPick {
  masterProductId: string;
  masterProductName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ByMarketCart {
  marketId: string;
  marketName: string;
  total: number;
  isComplete: boolean;
  missing: string[];
  picks: MarketCartPick[];
}

export interface SuperCartPick extends MarketCartPick {
  marketId: string;
  marketName: string;
}

export interface SuperCart {
  total: number;
  marketsCount: number;
  isComplete: boolean;
  picks: SuperCartPick[];
  missing: string[];
}
