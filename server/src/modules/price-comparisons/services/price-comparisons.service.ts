import { Injectable, NotFoundException } from "@nestjs/common";
import { PriceComparisonsRepository } from "../repositories/price-comparisons.repository";
import { aggregateByMaster, buildByMarketCarts, buildSuperCart } from "../utils";
import { ByMarketCart } from "../types";

@Injectable()
export class PriceComparisonsService {
  constructor(private readonly repo: PriceComparisonsRepository) {}

  async compare(listId: string, userId: string) {
    const list = await this.repo.findListByIdForUser(listId, userId);
    if (!list) throw new NotFoundException("List not found");

    const rawItems = await this.repo.findItemsWithVariants(listId);
    const aggregated = aggregateByMaster(rawItems);

    const byMarket = buildByMarketCarts(aggregated);
    const superCart = buildSuperCart(aggregated);

    const completeCarts = byMarket.filter(cart => cart.isComplete);
    const cheapestSingleMarket = completeCarts.reduce<ByMarketCart | undefined>(
      (best, current) => (!best || current.total < best.total ? current : best),
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
}
