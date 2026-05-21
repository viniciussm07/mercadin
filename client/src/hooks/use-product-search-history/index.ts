import { productSearchHistoryService } from "@services/product-search-history";
import { SaveProductSearchHistoryPayload } from "@services/product-search-history/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const productSearchHistoryQueryKeys = {
  all: ["product-search-history"] as const,
};

export const useProductSearchHistory = () => {
  return useQuery({
    queryKey: productSearchHistoryQueryKeys.all,
    queryFn: ({ signal }) => productSearchHistoryService.findRecent({ signal }),
  });
};

export const useSaveProductSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveProductSearchHistoryPayload) =>
      productSearchHistoryService.save(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productSearchHistoryQueryKeys.all });
    },
  });
};
