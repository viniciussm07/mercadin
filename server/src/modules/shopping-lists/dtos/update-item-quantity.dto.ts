import { IsInt, IsString, Min } from "class-validator";

export class UpdateItemQuantityDto {
  @IsString()
  marketProductId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
