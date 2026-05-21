import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: "A senha atual é obrigatória" })
  currentPassword!: string;

  @IsString()
  @IsNotEmpty({ message: "A nova senha é obrigatória" })
  @MinLength(6, { message: "A nova senha deve ter pelo menos 6 caracteres" })
  newPassword!: string;

  @IsString()
  @IsNotEmpty({ message: "A confirmação da nova senha é obrigatória" })
  newPasswordConfirmation!: string;
}
