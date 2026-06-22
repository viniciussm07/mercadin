export interface RankedPromotionRow {
  marketProductId: string;
  nameInMarket: string;
  url: string | null;
  lastScrapedAt: Date;
  masterProductId: string;
  ean: string;
  masterProductName: string;
  imageUrl: string | null;
  brand: string | null;
  marketId: string;
  marketSlug: string;
  marketName: string;
  startPrice: number;
  endPrice: number;
  dropAmount: number;
  dropPercentage: number;
  priceChangedAt: Date;
}

export interface RankedPromotionsResult {
  items: RankedPromotionRow[];
  total: number;
}

export interface FindRankedPromotionsParams {
  from: Date;
  to: Date;
  marketSlugs?: string[];
  limit: number;
  offset: number;
}
