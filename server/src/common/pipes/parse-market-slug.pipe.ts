import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { MARKET_SLUGS } from "../constants/market-slugs.constant";

@Injectable()
export class ParseMarketSlugPipe implements PipeTransform<
  string | string[] | undefined,
  Promise<MARKET_SLUGS[] | undefined>
> {
  async transform(value: string | string[] | undefined): Promise<MARKET_SLUGS[] | undefined> {
    if (!value) {
      return undefined;
    }

    const marketSlugs = [...new Set(Array.isArray(value) ? value : [value])];
    const validSlugs = Object.values(MARKET_SLUGS) as string[];

    for (const marketSlug of marketSlugs) {
      if (!validSlugs.includes(marketSlug)) {
        throw new BadRequestException(`Invalid market: ${marketSlug}`);
      }
    }

    return marketSlugs as MARKET_SLUGS[];
  }
}
