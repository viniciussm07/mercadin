import { Controller, Get, Query } from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { SearchProductsDto } from "../dtos/search-products.dto";
import { Public } from "@/common/decorators/public.decorator";

@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public()
  @Get("search")
  search(@Query() dto: SearchProductsDto) {
    return this.products.search(dto.q, dto.market);
  }

  @Public()
  @Get()
  findAll() {
    return this.products.findAll();
  }
}
