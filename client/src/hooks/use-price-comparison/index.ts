import { useQuery } from "@tanstack/react-query";
import { priceComparisonsService } from "@services/price-comparisons";

export const priceComparisonsQueryKeys = {
  list: (id: string) => ["price-comparisons", "list", id] as const,
};

export const usePriceComparison = (listId: string, enabled = true) => {
  return useQuery({
    queryKey: priceComparisonsQueryKeys.list(listId),
    queryFn: ({ signal }) => priceComparisonsService.findForList({ listId, signal }),
    enabled: enabled && listId.length > 0,
  });
};
