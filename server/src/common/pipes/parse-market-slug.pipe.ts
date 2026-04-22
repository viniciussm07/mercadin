import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from "@nestjs/common";
import { MARKET_SLUGS } from "../constants/market-slugs.constant";
import { MarketsRepository } from "@/modules/markets/repositories/markets.repository";

@Injectable()
export class ParseMarketSlugPipe implements PipeTransform<string | undefined, Promise<string | undefined>> {
  constructor(private readonly marketsRepo: MarketsRepository) {}

  async transform(value: string | undefined, metadata: ArgumentMetadata): Promise<string | undefined> {
    if (!value) {
      return value;
    }

    const validSlugs = Object.values(MARKET_SLUGS) as string[];
    if (!validSlugs.includes(value)) {
      throw new BadRequestException(`Invalid market: ${value}`);
    }

    const market = await this.marketsRepo.findBySlug(value);
    if (!market) {
      throw new NotFoundException(`Market with slug '${value}' not found in database.`);
    }

    return value;
  }
}
