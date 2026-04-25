import z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  email: z.email("O e-mail fornecido é inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});
