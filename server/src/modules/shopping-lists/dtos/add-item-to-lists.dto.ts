import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class AddItemToListsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  listIds!: string[];

  @IsString()
  marketProductId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity = 1;
}
