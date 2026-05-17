import { MARKET_SLUGS } from "@constants/market-slugs";
import { create } from "zustand";

const SEARCH_QUERY_MIN_LENGTH = 2;
const SEARCH_QUERY_DEBOUNCE_MS = 350;

let searchDebounceTimeout: ReturnType<typeof setTimeout> | undefined;

interface ProductSearchStore {
  query: string;
  debouncedQuery: string;
  selectedMarkets: MARKET_SLUGS[];
  commitQuery: (nextQuery?: string) => void;
  setQuery: (nextQuery: string) => void;
  setSelectedMarkets: (nextMarkets: MARKET_SLUGS[]) => void;
  clear: () => void;
}

export const useProductSearchStore = create<ProductSearchStore>(set => ({
  query: "",
  debouncedQuery: "",
  selectedMarkets: [],
  commitQuery: nextQuery => {
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    set(state => {
      const query = nextQuery ?? state.query;
      const trimmedQuery = query.trim();

      return {
        query,
        debouncedQuery: trimmedQuery,
      };
    });
  },
  setQuery: nextQuery => {
    const trimmedQuery = nextQuery.trim();

    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    if (trimmedQuery.length < SEARCH_QUERY_MIN_LENGTH) {
      set({ query: nextQuery, debouncedQuery: trimmedQuery });
      return;
    }

    set({ query: nextQuery });

    searchDebounceTimeout = setTimeout(() => {
      set({ debouncedQuery: trimmedQuery });
    }, SEARCH_QUERY_DEBOUNCE_MS);
  },
  setSelectedMarkets: nextMarkets => set({ selectedMarkets: nextMarkets }),
  clear: () => set({ query: "", debouncedQuery: "", selectedMarkets: [] }),
}));
