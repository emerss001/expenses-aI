import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("A URL do banco de dados deve ser válida"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "A chave pública do Clerk é obrigatória"),
  CLERK_SECRET_KEY: z.string().min(1, "A chave secreta do Clerk é obrigatória"),
});

const _env = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
});

if (!_env.success) {
  console.error("❌ Variáveis de ambiente inválidas ou ausentes:");
  console.error(_env.error.format());

  process.exit(1);
}

export const env = _env.data;
