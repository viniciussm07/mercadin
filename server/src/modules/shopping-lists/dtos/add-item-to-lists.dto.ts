import { ArrayNotEmpty, IsArray, IsInt, IsString, Min } from "class-validator";

export class AddItemToListsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  listIds!: string[];

  @IsString()
  marketProductId!: string;

  @IsInt()
  @Min(1)
  quantity = 1;
}
