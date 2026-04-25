import { Provider } from "@supabase/supabase-js";
import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInWithTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(["google"])
  provider!: Provider;

  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsOptional()
  accessToken?: string;
}
