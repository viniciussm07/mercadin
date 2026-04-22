import { IsOptional, IsString, MinLength } from "class-validator";

export class SearchProductsDto {
  @IsString()
  @MinLength(2)
  q!: string;

  @IsOptional()
  @IsString()
  market?: string;
}
