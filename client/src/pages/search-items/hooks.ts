import { useQuery } from "@tanstack/react-query";
import { productsService } from "@services/products";
import { useProductSearchStore } from "@stores/product-search";
import { useSaveProductSearchHistory } from "@hooks/use-product-search-history";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

const SEARCH_QUERY_MIN_LENGTH = 2;

const PRODUCTS_SEARCH_QUERY_KEY = ["products", "search"] as const;

export const useSearchProducts = () => {
  const debouncedQuery = useProductSearchStore(state => state.debouncedQuery);
  const clearQuery = useProductSearchStore(state => state.clear);
  const selectedMarkets = useProductSearchStore(state => state.selectedMarkets);
  const hasValidQuery = debouncedQuery.length >= SEARCH_QUERY_MIN_LENGTH;

  const saveQuery = useSaveProductSearchHistory();

  const products = useQuery({
    queryKey: [...PRODUCTS_SEARCH_QUERY_KEY, debouncedQuery, selectedMarkets],
    queryFn: ({ signal }) =>
      productsService.search({ q: debouncedQuery, markets: selectedMarkets, signal }),
    enabled: hasValidQuery,
  });

  useEffect(() => {
    if (!hasValidQuery || !products.isSuccess) return;

    saveQuery.mutate({ query: debouncedQuery });
  }, [hasValidQuery, debouncedQuery, saveQuery, products.isSuccess]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearQuery();
      };
    }, [clearQuery]),
  );

  return {
    debouncedQuery,
    hasValidQuery,
    products,
  };
};
