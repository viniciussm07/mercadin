import { MARKET_SLUGS } from "@constants/market-slugs";
import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";

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

export interface SearchProductsResponse {
  source: "cache" | "scrape";
  items: MarketProduct[];
}

interface SearchProductsParams {
  q: string;
  markets?: MARKET_SLUGS[];
  signal?: AbortSignal;
}

export const productsService = {
  search: ({ q, markets = [], signal }: SearchProductsParams) => {
    const searchParams = [
      `q=${encodeURIComponent(q)}`,
      ...markets.map(market => `market=${encodeURIComponent(market)}`),
    ].join("&");

    return apiClient
      .get(endpoints.products.search, {
        searchParams,
        signal,
      })
      .json<SearchProductsResponse>();
  },
};
