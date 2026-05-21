import {
  AggregatedItem,
  ByMarketCart,
  PriceComparisonItem,
  SuperCart,
  SuperCartPick,
} from "./types";

const toMoney = (value: number) => Number(value.toFixed(2));

export const aggregateByMaster = (items: PriceComparisonItem[]): AggregatedItem[] => {
  const byMaster = new Map<string, AggregatedItem>();

  for (const item of items) {
    const masterProduct = item.marketProduct.masterProduct;
    const existing = byMaster.get(masterProduct.id);
    if (existing) {
      existing.quantity += item.quantity;
      continue;
    }

    byMaster.set(masterProduct.id, {
      masterProductId: masterProduct.id,
      masterProductName: masterProduct.name,
      quantity: item.quantity,
      variants: masterProduct.variants.map(variant => ({
        marketId: variant.marketId,
        marketName: variant.market.name,
        marketProductId: variant.id,
        price: variant.currentPrice,
      })),
    });
  }

  return [...byMaster.values()];
};

export const buildByMarketCarts = (items: AggregatedItem[]): ByMarketCart[] => {
  const marketsIndex = new Map<string, { name: string }>();
  for (const item of items) {
    for (const variant of item.variants) {
      marketsIndex.set(variant.marketId, { name: variant.marketName });
    }
  }

  return [...marketsIndex.entries()].map(([marketId, { name }]) => {
    let total = 0;
    const picks: ByMarketCart["picks"] = [];
    const missing: string[] = [];

    for (const item of items) {
      const variant = item.variants.find(current => current.marketId === marketId);
      if (!variant) {
        missing.push(item.masterProductName);
        continue;
      }

      const subtotal = toMoney(variant.price * item.quantity);
      total += subtotal;
      picks.push({
        masterProductId: item.masterProductId,
        masterProductName: item.masterProductName,
        quantity: item.quantity,
        unitPrice: variant.price,
        subtotal,
      });
    }

    return {
      marketId,
      marketName: name,
      total: toMoney(total),
      isComplete: missing.length === 0,
      missing,
      picks,
    };
  });
};

export const buildSuperCart = (items: AggregatedItem[]): SuperCart => {
  const picks: SuperCartPick[] = [];
  const missing: string[] = [];
  let total = 0;
  const marketsUsed = new Set<string>();

  for (const item of items) {
    if (item.variants.length === 0) {
      missing.push(item.masterProductName);
      continue;
    }

    const cheapest = item.variants.reduce((best, variant) =>
      variant.price < best.price ? variant : best,
    );
    const subtotal = toMoney(cheapest.price * item.quantity);
    total += subtotal;
    marketsUsed.add(cheapest.marketId);
    picks.push({
      masterProductId: item.masterProductId,
      masterProductName: item.masterProductName,
      quantity: item.quantity,
      unitPrice: cheapest.price,
      subtotal,
      marketId: cheapest.marketId,
      marketName: cheapest.marketName,
    });
  }

  return {
    total: toMoney(total),
    marketsCount: marketsUsed.size,
    isComplete: missing.length === 0,
    picks,
    missing,
  };
};
