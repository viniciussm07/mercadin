import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GetPriceHistoryDto } from "../dtos/get-price-history.dto";
import { PriceHistoryRepository } from "../repositories/price-history.repository";

const DEFAULT_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 1000;

@Injectable()
export class PriceHistoryService {
  constructor(private readonly repository: PriceHistoryRepository) {}

  async findByMarketProduct(marketProductId: string, dto: GetPriceHistoryDto) {
    const product = await this.repository.existsMarketProduct(marketProductId);
    if (!product) {
      throw new NotFoundException("Market product not found");
    }

    const to = dto.to ? new Date(dto.to) : new Date();
    const from = dto.from ? new Date(dto.from) : new Date(to.getTime() - DEFAULT_PERIOD_MS);
    if (from > to) {
      throw new BadRequestException("from must be before or equal to to");
    }

    const points = await this.repository.findByPeriod({
      marketProductId,
      from,
      to,
      limit: dto.limit ?? DEFAULT_LIMIT,
    });

    return { marketProductId, points };
  }
}
