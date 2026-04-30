import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import { SearchProductsParams, SearchProductsResponse } from "./types";

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
