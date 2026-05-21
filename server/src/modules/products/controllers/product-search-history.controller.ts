import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "@/common/decorators/current-user.decorator";
import { SaveProductSearchHistoryDto } from "../dtos/save-product-search-history.dto";
import { ProductSearchHistoryService } from "../services/product-search-history.service";

@Controller("products/search-history")
export class ProductSearchHistoryController {
  constructor(private readonly history: ProductSearchHistoryService) {}

  @Get()
  findRecent(@CurrentUser() user: AuthenticatedUser) {
    return this.history.findRecent(user.id);
  }

  @Post()
  save(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveProductSearchHistoryDto) {
    return this.history.save(user.id, dto);
  }
}
