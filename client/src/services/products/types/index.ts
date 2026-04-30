import { MARKET_SLUGS } from "@constants/market-slugs";

export interface ProductMarket {
  id: string;
  slug: MARKET_SLUGS;
  name: string;
  url?: string | null;
}

export interface ProductMaster {
  id: string;
  ean: string;
  name: string;
  imageUrl?: string | null;
  brand?: string | null;
  createdAt?: string;
}

export interface MarketProduct {
  id: string;
  sku: string;
  nameInMarket: string;
  currentPrice: number;
  url?: string | null;
  isAvailable: boolean;
  lastScrapedAt?: string;
  marketId: string;
  masterProductId: string;
  market: ProductMarket;
  masterProduct: ProductMaster;
}

export interface ProductGroup {
  ean: string;
  masterProduct: ProductMaster;
  items: MarketProduct[];
}

export interface SearchProductsResponse {
  source: "cache" | "scrape";
  items: ProductGroup[];
}

export interface SearchProductsParams {
  q: string;
  markets?: MARKET_SLUGS[];
  signal?: AbortSignal;
}
