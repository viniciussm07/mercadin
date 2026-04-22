import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @IsEmail({}, { message: "O e-mail fornecido é inválido" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "A senha é obrigatória" })
  password!: string;
}
