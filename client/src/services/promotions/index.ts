import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import { FindPromotionsParams, PromotionsResponse } from "./types";

export const promotionsService = {
  findRanked: ({ from, to, limit, offset, signal }: FindPromotionsParams) =>
    apiClient
      .get(endpoints.promotions.root, {
        searchParams: {
          from,
          to,
          limit: String(limit),
          offset: String(offset),
        },
        signal,
      })
      .json<PromotionsResponse>(),
};
