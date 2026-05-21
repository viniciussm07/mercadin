import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import {
  FindProductSearchHistoryParams,
  ProductSearchHistoryItem,
  SaveProductSearchHistoryPayload,
} from "./types";

export const productSearchHistoryService = {
  findRecent: ({ signal }: FindProductSearchHistoryParams = {}) =>
    apiClient.get(endpoints.products.searchHistory, { signal }).json<ProductSearchHistoryItem[]>(),
  save: (payload: SaveProductSearchHistoryPayload) =>
    apiClient
      .post(endpoints.products.searchHistory, { json: payload })
      .json<ProductSearchHistoryItem>(),
};
