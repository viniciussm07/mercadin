import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import { FindPriceComparisonParams, PriceComparison } from "./types";

export const priceComparisonsService = {
  findForList: ({ listId, signal }: FindPriceComparisonParams) =>
    apiClient.get(endpoints.priceComparisons.list(listId), { signal }).json<PriceComparison>(),
};
