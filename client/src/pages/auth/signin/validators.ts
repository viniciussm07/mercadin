import z from "zod";

export const signInSchema = z.object({
  email: z.email("O e-mail fornecido é inválido."),
  password: z.string().min(6, "A senha é obrigatória."),
});
