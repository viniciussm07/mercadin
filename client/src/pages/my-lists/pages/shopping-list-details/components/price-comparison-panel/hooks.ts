import { useMemo, useState } from "react";
import { usePriceComparison } from "@hooks/use-price-comparison";

export type PriceComparisonTab = "summary" | "same-market" | "best-prices";

interface UsePriceComparisonPanelParams {
  itemCount: number;
  listId: string;
}

export const usePriceComparisonPanel = ({ itemCount, listId }: UsePriceComparisonPanelParams) => {
  const [activeTab, setActiveTab] = useState<PriceComparisonTab>("best-prices");
  const hasItems = itemCount > 0;
  const comparison = usePriceComparison(listId, hasItems);

  const cheapestSingleMarket = useMemo(() => {
    const data = comparison.data;
    if (!data?.cheapestSingleMarketId) {
      return null;
    }

    return data.byMarket.find(cart => cart.marketId === data.cheapestSingleMarketId) ?? null;
  }, [comparison.data]);

  const incompleteMarkets = useMemo(
    () => comparison.data?.byMarket.filter(cart => !cart.isComplete) ?? [],
    [comparison.data?.byMarket],
  );

  const completeMarketAlternatives = useMemo(() => {
    return (
      comparison.data?.byMarket
        .filter(cart => cart.isComplete && cart.marketId !== cheapestSingleMarket?.marketId)
        .sort((first, second) => first.total - second.total) ?? []
    );
  }, [cheapestSingleMarket?.marketId, comparison.data?.byMarket]);

  const hasSavings = typeof comparison.data?.savings === "number" && comparison.data.savings > 0;

  const availableTabs = useMemo(() => {
    const tabs: PriceComparisonTab[] = [];
    tabs.push("best-prices");
    if (cheapestSingleMarket) tabs.push("same-market");
    tabs.push("summary");
    return tabs;
  }, [cheapestSingleMarket]);

  return {
    activeTab,
    availableTabs,
    cheapestSingleMarket,
    completeMarketAlternatives,
    comparison,
    hasItems,
    hasSavings,
    incompleteMarkets,
    setActiveTab,
  };
};
