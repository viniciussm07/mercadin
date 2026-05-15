import { useEffect, useMemo, useState } from "react";
import { usePriceComparison } from "@hooks/use-price-comparison";

export type PriceComparisonTab = "summary" | "same-market" | "best-prices";

interface UsePriceComparisonPanelParams {
  itemCount: number;
  listId: string;
}

export const usePriceComparisonPanel = ({ itemCount, listId }: UsePriceComparisonPanelParams) => {
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

  const hasSavings = typeof comparison.data?.savings === "number" && comparison.data.savings > 0;
  const [activeTab, setActiveTab] = useState<PriceComparisonTab>("summary");

  const availableTabs = useMemo(() => {
    const tabs: PriceComparisonTab[] = ["summary"];
    if (cheapestSingleMarket) {
      tabs.push("same-market");
    }
    tabs.push("best-prices");
    return tabs;
  }, [cheapestSingleMarket]);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab("summary");
    }
  }, [activeTab, availableTabs]);

  return {
    activeTab,
    availableTabs,
    cheapestSingleMarket,
    comparison,
    hasItems,
    hasSavings,
    incompleteMarkets,
    setActiveTab,
  };
};
