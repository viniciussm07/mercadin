import { BadRequestException, Injectable } from "@nestjs/common";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";
import { ListPromotionsDto } from "../dtos/list-promotions.dto";
import { PromotionsRepository } from "../repositories/promotions.repository";

const DEFAULT_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;
const roundToTwoDecimals = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

@Injectable()
export class PromotionsService {
  constructor(private readonly repository: PromotionsRepository) {}

  async findRanked(dto: ListPromotionsDto, marketSlugs?: MARKET_SLUGS[]) {
    const to = dto.to ? new Date(dto.to) : new Date();
    const from = dto.from ? new Date(dto.from) : new Date(to.getTime() - DEFAULT_PERIOD_MS);
    if (from > to) {
      throw new BadRequestException("from must be before or equal to to");
    }

    const limit = dto.limit ?? DEFAULT_LIMIT;
    const offset = dto.offset ?? DEFAULT_OFFSET;
    const result = await this.repository.findRanked({
      from,
      to,
      marketSlugs,
      limit,
      offset,
    });

    return {
      period: { from: from.toISOString(), to: to.toISOString() },
      items: result.items.map(item => ({
        marketProductId: item.marketProductId,
        nameInMarket: item.nameInMarket,
        url: item.url,
        lastScrapedAt: item.lastScrapedAt,
        masterProduct: {
          id: item.masterProductId,
          ean: item.ean,
          name: item.masterProductName,
          imageUrl: item.imageUrl,
          brand: item.brand,
        },
        market: {
          id: item.marketId,
          slug: item.marketSlug,
          name: item.marketName,
        },
        startPrice: roundToTwoDecimals(item.startPrice),
        endPrice: roundToTwoDecimals(item.endPrice),
        dropAmount: roundToTwoDecimals(item.dropAmount),
        dropPercentage: roundToTwoDecimals(item.dropPercentage),
        priceChangedAt: item.priceChangedAt,
      })),
      pagination: {
        limit,
        offset,
        total: result.total,
        hasMore: offset + result.items.length < result.total,
      },
    };
  }
}
