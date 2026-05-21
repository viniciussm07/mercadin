import { IsEmail } from "class-validator";

export class UpdateEmailDto {
  @IsEmail({}, { message: "O e-mail fornecido é inválido" })
  email!: string;
}
