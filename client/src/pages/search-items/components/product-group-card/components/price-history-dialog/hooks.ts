import { productsService } from "@services/products";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const PRICE_HISTORY_QUERY_KEY = ["products", "price-history"] as const;

export const usePriceHistoryDialog = (marketProductId: string) => {
  const [open, setOpen] = useState(false);
  const priceHistory = useQuery({
    queryKey: [...PRICE_HISTORY_QUERY_KEY, marketProductId],
    queryFn: ({ signal }) => productsService.getPriceHistory({ marketProductId, signal }),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  return {
    onOpenChange: setOpen,
    open,
    priceHistory,
  };
};
