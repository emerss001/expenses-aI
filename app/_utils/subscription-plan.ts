/**
 * Fonte única do plano de assinatura.
 *
 * O webhook do Stripe grava o rótulo do plano no metadata público do Clerk e
 * várias telas precisam saber "qual plano" e "tem plano". Cada uma escrevendo
 * a própria checagem foi o que deixou usuário sem plano passar por premium:
 * quem nunca assinou não tem a chave, e ausente não é o mesmo que nulo.
 */
export const SUBSCRIPTION_PLANS = {
  MONTHLY: "Plano Mensal",
  YEARLY: "Plano Anual",
  TEST: "Plano Teste",
} as const;

export type SubscriptionPlan =
  (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS];

type PublicMetadata = Record<string, unknown> | null | undefined;

/**
 * Lê o plano do metadata do Clerk. Devolve null quando não há plano ou quando
 * o valor gravado não corresponde a nenhum plano conhecido — valor estranho não
 * pode virar acesso liberado.
 */
export const getSubscriptionPlan = (
  publicMetadata: PublicMetadata,
): SubscriptionPlan | null => {
  const storedPlan = publicMetadata?.subscriptionPlan;

  if (typeof storedPlan !== "string") {
    return null;
  }

  const normalized = storedPlan.trim().toLowerCase();

  return (
    Object.values(SUBSCRIPTION_PLANS).find(
      (plan) => plan.toLowerCase() === normalized,
    ) ?? null
  );
};

/** Se o usuário tem algum plano pago ativo. */
export const hasPaidPlan = (publicMetadata: PublicMetadata) =>
  getSubscriptionPlan(publicMetadata) !== null;
