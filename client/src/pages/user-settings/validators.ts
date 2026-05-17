import z from "zod";

export const updateEmailSchema = z.object({
  email: z.email("O e-mail fornecido é inválido."),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual."),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    newPasswordConfirmation: z.string().min(1, "Repita a nova senha."),
  })
  .refine(values => values.newPassword === values.newPasswordConfirmation, {
    path: ["newPasswordConfirmation"],
    message: "A confirmação da nova senha não confere.",
  });
