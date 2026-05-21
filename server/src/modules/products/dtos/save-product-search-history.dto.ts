import { IsString, MinLength } from "class-validator";

export class SaveProductSearchHistoryDto {
  @IsString()
  @MinLength(2)
  query!: string;
}
