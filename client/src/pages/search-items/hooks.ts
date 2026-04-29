import { useQuery } from "@tanstack/react-query";
import { productsService } from "@services/products";
import { useProductSearchStore } from "@stores/product-search";

const SEARCH_QUERY_MIN_LENGTH = 2;

const PRODUCTS_SEARCH_QUERY_KEY = ["products", "search"] as const;

export const useSearchProducts = () => {
  const debouncedQuery = useProductSearchStore(state => state.debouncedQuery);
  const selectedMarkets = useProductSearchStore(state => state.selectedMarkets);
  const hasValidQuery = debouncedQuery.length >= SEARCH_QUERY_MIN_LENGTH;

  const products = useQuery({
    queryKey: [...PRODUCTS_SEARCH_QUERY_KEY, debouncedQuery, selectedMarkets],
    queryFn: ({ signal }) =>
      productsService.search({ q: debouncedQuery, markets: selectedMarkets, signal }),
    enabled: hasValidQuery,
  });

  return {
    debouncedQuery,
    hasValidQuery,
    products,
  };
};
