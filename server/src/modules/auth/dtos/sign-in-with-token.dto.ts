import { Provider } from "@supabase/supabase-js";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInWithToken {
  @IsString()
  @IsNotEmpty()
  provider!: Provider;

  @IsString()
  @IsNotEmpty()
  token!: string;
}
