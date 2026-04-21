import { Controller, Get } from "@nestjs/common";
import { MarketsRepository } from "../repositories/markets.repository";
import { Public } from "@/common/decorators/public.decorator";

@Controller("markets")
export class MarketsController {
  constructor(private readonly markets: MarketsRepository) {}

  @Public()
  @Get()
  findAll() {
    return this.markets.findAll();
  }
}
