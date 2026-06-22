import { Controller, Get, Query } from "@nestjs/common";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";
import { Public } from "@/common/decorators/public.decorator";
import { ParseMarketSlugPipe } from "@/common/pipes/parse-market-slug.pipe";
import { ListPromotionsDto } from "../dtos/list-promotions.dto";
import { PromotionsService } from "../services/promotions.service";

@Controller("promotions")
export class PromotionsController {
  constructor(private readonly promotions: PromotionsService) {}

  @Public()
  @Get()
  findAll(
    @Query() dto: ListPromotionsDto,
    @Query("market", ParseMarketSlugPipe) marketSlugs?: MARKET_SLUGS[],
  ) {
    return this.promotions.findRanked(dto, marketSlugs);
  }
}
