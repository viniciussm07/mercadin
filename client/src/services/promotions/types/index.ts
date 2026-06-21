import { MARKET_SLUGS } from "@constants/market-slugs";

export type PromotionPeriodDays = 3 | 7 | 30;

export interface Promotion {
  marketProductId: string;
  nameInMarket: string;
  url: string | null;
  lastScrapedAt: string;
  masterProduct: {
    id: string;
    ean: string;
    name: string;
    imageUrl: string | null;
    brand: string | null;
  };
  market: {
    id: string;
    slug: MARKET_SLUGS;
    name: string;
  };
  startPrice: number;
  endPrice: number;
  dropAmount: number;
  dropPercentage: number;
  priceChangedAt: string;
}

export interface PromotionsResponse {
  period: {
    from: string;
    to: string;
  };
  items: Promotion[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export interface FindPromotionsParams {
  from: string;
  to: string;
  limit: number;
  offset: number;
  signal?: AbortSignal;
}
