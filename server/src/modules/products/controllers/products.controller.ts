import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { PriceHistoryService } from "../services/price-history.service";
import { SearchProductsDto } from "../dtos/search-products.dto";
import { GetPriceHistoryDto } from "../dtos/get-price-history.dto";
import { Public } from "@/common/decorators/public.decorator";
import { ParseMarketSlugPipe } from "@/common/pipes/parse-market-slug.pipe";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly priceHistory: PriceHistoryService,
  ) {}

  @Public()
  @Get("search")
  search(
    @Query() dto: SearchProductsDto,
    @Query("market", ParseMarketSlugPipe) marketSlugs?: MARKET_SLUGS[],
  ) {
    return this.products.search(dto.q, marketSlugs);
  }

  @Public()
  @Get()
  findAll() {
    return this.products.findAll();
  }

  @Public()
  @Get(":marketProductId/price-history")
  findPriceHistory(
    @Param("marketProductId", ParseUUIDPipe) marketProductId: string,
    @Query() dto: GetPriceHistoryDto,
  ) {
    return this.priceHistory.findByMarketProduct(marketProductId, dto);
  }
}
