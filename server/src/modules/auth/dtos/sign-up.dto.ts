import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty({ message: "O nome é obrigatório" })
  name!: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsEmail({}, { message: "O e-mail fornecido é inválido" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "A senha é obrigatória" })
  @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  password!: string;
}
