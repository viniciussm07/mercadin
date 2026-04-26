import { Controller, Get, Query } from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { SearchProductsDto } from "../dtos/search-products.dto";
import { Public } from "@/common/decorators/public.decorator";
import { ParseMarketSlugPipe } from "@/common/pipes/parse-market-slug.pipe";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";

@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public()
  @Get("search")
  search(
    @Query() dto: SearchProductsDto,
    @Query("market", ParseMarketSlugPipe) marketSlug?: MARKET_SLUGS,
  ) {
    return this.products.search(dto.q, marketSlug);
  }

  @Public()
  @Get()
  findAll() {
    return this.products.findAll();
  }
}
