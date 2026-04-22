import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateListDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
