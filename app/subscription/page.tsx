import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import PricingCard from "./_components/pricing-card";
import { env } from "../_lib/env";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { DollarSignIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";

const SubscriptionPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const currentMonthTransactions = await getCurrentMonthTransactions();

  let currentUserPlan = user.publicMetadata?.subscriptionPlan;
  currentUserPlan = currentUserPlan
    ? String(currentUserPlan).toLowerCase()
    : null;

  const isFreePlan = !currentUserPlan;
  const isMonthlyPlan = currentUserPlan === "plano mensal";
  const isYearlyPlan = currentUserPlan === "plano anual";
  const testPlan = currentUserPlan === "plano teste";

  return (
    <>
      <Navbar />
      <main className="flex h-[calc(100dvh-4rem)] justify-center overflow-y-auto px-6">
        <div className="no-scrollbar w-full max-w-6xl space-y-8 py-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Sua assinatura
            </h1>
            <p className="text-sm text-muted-foreground">
              Escolha o plano que melhor atende às suas necessidades e tenha
              mais recursos para controlar suas finanças.
            </p>
          </div>

          {/* Planos Principais */}
          <div className="grid gap-5 md:grid-cols-3">
            <PricingCard
              title="Plano Grátis"
              description="Para começar a organizar suas finanças"
              price="0"
              isCurrentPlan={isFreePlan}
              features={[
                {
                  title: "10 transações por mês",
                  description: (
                    <>
                      Você já utilizou{" "}
                      <span className="font-semibold text-foreground">
                        {currentMonthTransactions} de 10
                      </span>
                    </>
                  ),
                  isIncluded: true,
                },
                {
                  title: "Relatórios de IA",
                  description: "Disponível no plano Premium",
                  isIncluded: false,
                },
              ]}
              button={{
                title: "Adquirir plano",
                buttonType: !currentUserPlan ? "manage" : "downgrade",
              }}
            />

            <PricingCard
              title="Premium Mensal"
              description="Acesso completo aos recursos"
              price="19"
              isCurrentPlan={isMonthlyPlan}
              isHighlighted={isMonthlyPlan}
              highlightBadge={!isMonthlyPlan ? "Mais popular" : undefined}
              features={[
                {
                  title: "Transações ilimitadas",
                  description: "Registre quantas transações quiser",
                  isIncluded: true,
                },
                {
                  title: "Relatórios de IA",
                  description: "Insights inteligentes sobre suas finanças",
                  isIncluded: true,
                },
              ]}
              button={{
                title: "Adquirir plano mensal",
                priceId: env.STRIPE_PREMIUM_PRICE_MONTHLY_ID,
                buttonType: !currentUserPlan
                  ? "upgrade"
                  : currentUserPlan === "plano mensal"
                    ? "manage"
                    : "downgrade",
              }}
            />

            <PricingCard
              title="Premium Anual"
              description="Economize pagando anualmente"
              price="193,80"
              period=""
              equivalentPrice="R$ 16,15/mês"
              isCurrentPlan={isYearlyPlan}
              isHighlighted={isYearlyPlan}
              highlightBadge={!isYearlyPlan ? "15% OFF" : undefined}
              features={[
                {
                  title: "Transações ilimitadas",
                  description: "Registre quantas transações quiser",
                  isIncluded: true,
                },
                {
                  title: "Relatórios de IA",
                  description: "Insights inteligentes sobre suas finanças",
                  isIncluded: true,
                },
                {
                  title: "15% de desconto",
                  description: "Economize R$ 34,20 por ano",
                  isIncluded: true,
                },
              ]}
              button={{
                title: "Adquirir plano anual",
                priceId: env.STRIPE_PREMIUM_PRICE_YEARLY_ID,
                buttonType:
                  !currentUserPlan || currentUserPlan === "plano mensal"
                    ? "upgrade"
                    : currentUserPlan === "plano anual"
                      ? "manage"
                      : "downgrade",
              }}
            />
          </div>

          <div className="mx-auto flex max-w-2xl flex-col items-center space-y-5 border-t pt-8">
            <div className="text-center">
              <h3 className="font-medium">Área de Desenvolvimento</h3>
              <p className="text-sm text-muted-foreground">
                Recursos exclusivos para testes no ambiente de produção.
              </p>
            </div>

            <Card className="w-full border-2 border-dashed bg-muted/30 transition-all hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="rounded-full bg-primary/10 p-2.5">
                  <DollarSignIcon className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Plano de Teste (Produção)</h4>
                  <p className="text-sm text-muted-foreground">
                    Produto de baixo valor para validar integrações de pagamento
                    e webhooks.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">R$ 0,10</span>
                  <p className="text-xs text-muted-foreground">
                    pagamento único
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <AcquirePlanButton
                  title="Testar Checkout"
                  priceId={env.STRIPE_TEST_PRICE_ID}
                  buttonType={!testPlan ? "upgrade" : "manage"}
                />
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <p className="pb-8 pt-3 text-center text-sm text-muted-foreground">
            Cancele quando quiser. Sem contratos ou taxas escondidas.
          </p>
        </div>
      </main>
    </>
  );
};

export default SubscriptionPage;
