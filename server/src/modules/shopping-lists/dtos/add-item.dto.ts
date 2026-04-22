import { IsInt, IsString, Min } from "class-validator";

export class AddItemDto {
  @IsString()
  marketProductId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
