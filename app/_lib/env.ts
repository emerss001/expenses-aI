import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("A URL do banco de dados deve ser válida"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "A chave pública do Clerk é obrigatória"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "A chave pública do Stripe é obrigatória"),
  NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL: z
    .string()
    .min(1, "A URL do portal do cliente do Stripe é obrigatória"),

  CLERK_SECRET_KEY: z.string().min(1, "A chave secreta do Clerk é obrigatória"),
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, "A chave secreta do Stripe é obrigatória"),
  STRIPE_PREMIUM_PRICE_MONTHLY_ID: z
    .string()
    .min(1, "O ID do preço premium mensal do Stripe é obrigatório"),
  STRIPE_PREMIUM_PRICE_YEARLY_ID: z
    .string()
    .min(1, "O ID do preço premium anual do Stripe é obrigatório"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "O segredo do webhook do Stripe é obrigatório"),
  GEMINI_API_KEY: z.string().min(1, "A chave da API do Gemini é obrigatória"),
  STRIPE_TEST_PRICE_ID: z
    .string()
    .min(1, "O ID do preço de teste do Stripe é obrigatório"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Variáveis de ambiente inválidas ou ausentes:");
  console.error(_env.error.format());

  process.exit(1);
}

export const env = _env.data;
