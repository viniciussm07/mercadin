import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";

export class SearchProductsDto {
  @IsString()
  @MinLength(2)
  q!: string;

  @IsOptional()
  @IsEnum(MARKET_SLUGS)
  market?: MARKET_SLUGS;
}
