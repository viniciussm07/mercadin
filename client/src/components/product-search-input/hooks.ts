import { useProductSearchHistory } from "@hooks/use-product-search-history";
import { useProductSearchStore } from "@stores/product-search";
import { useMemo, useRef, useState } from "react";

const BLUR_HIDE_DELAY_MS = 120;

type UseProductSearchInputParams = {
  onChangeQuery?: (nextQuery: string) => void;
  onSubmitQuery?: (query: string) => void;
};

export const useProductSearchInput = ({
  onChangeQuery,
  onSubmitQuery,
}: UseProductSearchInputParams) => {
  const hideSuggestionsTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const query = useProductSearchStore(state => state.query);
  const setQuery = useProductSearchStore(state => state.setQuery);
  const commitQuery = useProductSearchStore(state => state.commitQuery);
  const history = useProductSearchHistory();
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    const items = history.data ?? [];
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter(item => item.query.toLowerCase().includes(normalizedQuery));
  }, [history.data, query]);

  const submitQuery = (nextQuery = query) => {
    const trimmedQuery = nextQuery.trim();
    commitQuery(trimmedQuery);
    setIsFocused(false);
    onSubmitQuery?.(trimmedQuery);
  };

  const selectSuggestion = (nextQuery: string) => {
    setQuery(nextQuery);
    submitQuery(nextQuery);
  };

  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    onChangeQuery?.(nextQuery);
  };

  const onFocus = () => {
    if (hideSuggestionsTimeout.current) {
      clearTimeout(hideSuggestionsTimeout.current);
    }

    setIsFocused(true);
  };

  const onBlur = () => {
    hideSuggestionsTimeout.current = setTimeout(() => {
      setIsFocused(false);
    }, BLUR_HIDE_DELAY_MS);
  };

  return {
    changeQuery,
    isFocused,
    onBlur,
    onFocus,
    query,
    selectSuggestion,
    showSuggestions: isFocused && suggestions.length > 0,
    suggestions,
  };
};
