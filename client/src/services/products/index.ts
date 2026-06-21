import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import {
  GetPriceHistoryParams,
  PriceHistoryResponse,
  SearchProductsParams,
  SearchProductsResponse,
} from "./types";

const PRICE_HISTORY_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;

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
  getPriceHistory: ({ marketProductId, signal }: GetPriceHistoryParams) => {
    const to = new Date();
    const from = new Date(to.getTime() - PRICE_HISTORY_PERIOD_MS);

    return apiClient
      .get(endpoints.products.priceHistory(marketProductId), {
        searchParams: {
          from: from.toISOString(),
          to: to.toISOString(),
          limit: "1000",
        },
        signal,
      })
      .json<PriceHistoryResponse>();
  },
};
