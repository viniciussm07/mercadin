import { Controller, Get, Param } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "@/common/decorators/current-user.decorator";
import { PriceComparisonsService } from "../services/price-comparisons.service";

@Controller("price-comparisons")
export class PriceComparisonsController {
  constructor(private readonly comparisons: PriceComparisonsService) {}

  @Get("lists/:id")
  compare(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.comparisons.compare(id, user.id);
  }
}
