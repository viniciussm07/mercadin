import { Injectable, NotFoundException } from "@nestjs/common";
import { ShoppingListsRepository } from "../repositories/shopping-lists.repository";

export interface Variant {
  marketId: string;
  marketName: string;
  marketProductId: string;
  price: number;
}

export interface AggregatedItem {
  masterProductId: string;
  masterProductName: string;
  quantity: number;
  variants: Variant[];
}

export interface ByMarketCart {
  marketId: string;
  marketName: string;
  total: number;
  isComplete: boolean;
  missing: string[];
  picks: Array<{
    masterProductId: string;
    masterProductName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export interface SuperCartPick {
  masterProductId: string;
  masterProductName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  marketId: string;
  marketName: string;
}

export interface SuperCart {
  total: number;
  marketsCount: number;
  isComplete: boolean;
  picks: SuperCartPick[];
  missing: string[];
}

@Injectable()
export class PriceCombinationService {
  constructor(private readonly repo: ShoppingListsRepository) {}

  async combine(listId: string, userId: string) {
    const list = await this.repo.findByIdForUser(listId, userId, { select: { id: true } });
    if (!list) throw new NotFoundException("List not found");

    const rawItems = await this.repo.findItemsWithVariants(listId);
    const aggregated = this.aggregateByMaster(rawItems);

    const byMarket = this.buildByMarketCarts(aggregated);
    const superCart = this.buildSuperCart(aggregated);

    const completeCarts = byMarket.filter(c => c.isComplete);
    const cheapestSingleMarket = completeCarts.reduce<ByMarketCart | undefined>(
      (best, cur) => (!best || cur.total < best.total ? cur : best),
      undefined,
    );

    const savings =
      cheapestSingleMarket && superCart.isComplete
        ? Number((cheapestSingleMarket.total - superCart.total).toFixed(2))
        : null;

    return {
      listId,
      byMarket,
      superCart,
      cheapestSingleMarketId: cheapestSingleMarket?.marketId ?? null,
      savings,
    };
  }

  private aggregateByMaster(
    items: Awaited<ReturnType<ShoppingListsRepository["findItemsWithVariants"]>>,
  ): AggregatedItem[] {
    const byMaster = new Map<string, AggregatedItem>();

    for (const item of items) {
      const masterId = item.marketProduct.masterProductId;
      const existing = byMaster.get(masterId);
      if (existing) {
        existing.quantity += item.quantity;
        continue;
      }
      byMaster.set(masterId, {
        masterProductId: masterId,
        masterProductName: item.marketProduct.masterProduct.name,
        quantity: item.quantity,
        variants: item.marketProduct.masterProduct.variants.map(v => ({
          marketId: v.marketId,
          marketName: v.market.name,
          marketProductId: v.id,
          price: v.currentPrice,
        })),
      });
    }

    return [...byMaster.values()];
  }

  private buildByMarketCarts(items: AggregatedItem[]): ByMarketCart[] {
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
        const variant = item.variants.find(v => v.marketId === marketId);
        if (!variant) {
          missing.push(item.masterProductName);
          continue;
        }
        const subtotal = Number((variant.price * item.quantity).toFixed(2));
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
        total: Number(total.toFixed(2)),
        isComplete: missing.length === 0,
        missing,
        picks,
      };
    });
  }

  private buildSuperCart(items: AggregatedItem[]): SuperCart {
    const picks: SuperCartPick[] = [];
    const missing: string[] = [];
    let total = 0;
    const marketsUsed = new Set<string>();

    for (const item of items) {
      if (item.variants.length === 0) {
        missing.push(item.masterProductName);
        continue;
      }
      const cheapest = item.variants.reduce((best, v) => (v.price < best.price ? v : best));
      const subtotal = Number((cheapest.price * item.quantity).toFixed(2));
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
      total: Number(total.toFixed(2)),
      marketsCount: marketsUsed.size,
      isComplete: missing.length === 0,
      picks,
      missing,
    };
  }
}
