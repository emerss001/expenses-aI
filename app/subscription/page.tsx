import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckCircleIcon, CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { env } from "../_lib/env";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";

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

  return (
    <>
      <Navbar />

      <main className="flex h-[calc(100dvh-4rem)] items-center justify-center px-6">
        <div className="w-full max-w-6xl space-y-5">
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

          {/* Plans */}
          <div className="grid gap-5 md:grid-cols-3">
            {/* Plano Grátis */}
            <Card className="relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="space-y-3 border-b py-5">
                {isFreePlan && (
                  <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <CheckCircleIcon className="size-3.5" />
                    Plano atual
                  </div>
                )}

                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl font-semibold">Plano Grátis</h2>

                  <p className="text-sm text-muted-foreground">
                    Para começar a organizar suas finanças
                  </p>
                </div>

                <div className="flex items-end justify-center gap-2">
                  <span className="mb-1 text-lg font-medium text-muted-foreground">
                    R$
                  </span>

                  <span className="text-5xl font-bold tracking-tight">0</span>

                  <span className="mb-1.5 text-sm text-muted-foreground">
                    /mês
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-5 py-5">
                <div className="space-y-4">
                  {/* Transações */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <CheckIcon className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">10 transações por mês</p>

                      <p className="text-sm text-muted-foreground">
                        Você já utilizou{" "}
                        <span className="font-semibold text-foreground">
                          {currentMonthTransactions} de 10
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Relatórios */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-muted p-1">
                      <XIcon className="size-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="font-medium text-muted-foreground">
                        Relatórios de IA
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Disponível no plano Premium
                      </p>
                    </div>
                  </div>
                </div>

                <AcquirePlanButton
                  title="Adquirir plano"
                  buttonType={!currentUserPlan ? "manage" : "downgrade"}
                />
              </CardContent>
            </Card>

            {/* Premium Mensal */}
            <Card
              className={`relative flex flex-col overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isMonthlyPlan ? "border-primary" : "border-border"
              }`}
            >
              {/* Badge */}
              {!isMonthlyPlan && (
                <div className="absolute right-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Mais popular
                </div>
              )}

              <CardHeader className="space-y-3 border-b bg-primary/[0.03] py-5">
                {isMonthlyPlan && (
                  <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <CheckCircleIcon className="size-3.5" />
                    Plano atual
                  </div>
                )}

                <div
                  className={`space-y-1.5 text-center ${
                    !isMonthlyPlan ? "pr-28" : ""
                  }`}
                >
                  <h2 className="text-2xl font-semibold">Premium Mensal</h2>

                  <p className="text-sm text-muted-foreground">
                    Acesso completo aos recursos
                  </p>
                </div>

                <div className="flex items-end justify-center gap-2">
                  <span className="mb-1 text-lg font-medium text-muted-foreground">
                    R$
                  </span>

                  <span className="text-5xl font-bold tracking-tight text-primary">
                    19
                  </span>

                  <span className="mb-1.5 text-sm text-muted-foreground">
                    /mês
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-5 py-5">
                <div className="space-y-4">
                  {/* Transações */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <CheckIcon className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">Transações ilimitadas</p>

                      <p className="text-sm text-muted-foreground">
                        Registre quantas transações quiser
                      </p>
                    </div>
                  </div>

                  {/* Relatórios */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <CheckIcon className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">Relatórios de IA</p>

                      <p className="text-sm text-muted-foreground">
                        Insights inteligentes sobre suas finanças
                      </p>
                    </div>
                  </div>
                </div>

                <AcquirePlanButton
                  title="Adquirir plano mensal"
                  priceId={env.STRIPE_PREMIUM_PRICE_MONTHLY_ID}
                  buttonType={
                    !currentUserPlan
                      ? "upgrade"
                      : currentUserPlan === "plano mensal"
                        ? "manage"
                        : "downgrade"
                  }
                />
              </CardContent>
            </Card>

            {/* Premium Anual */}
            <Card
              className={`relative flex flex-col overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isYearlyPlan ? "border-primary" : "border-border"
              }`}
            >
              <CardHeader className="space-y-3 border-b bg-primary/[0.03] py-5">
                {/* Badge */}
                {!isYearlyPlan && (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    15% OFF
                  </div>
                )}

                {isYearlyPlan && (
                  <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <CheckCircleIcon className="size-3.5" />
                    Plano atual
                  </div>
                )}

                <div
                  className={`space-y-1.5 text-center ${
                    !isYearlyPlan ? "pr-20" : ""
                  }`}
                >
                  <h2 className="text-2xl font-semibold">Premium Anual</h2>

                  <p className="text-sm text-muted-foreground">
                    Economize pagando anualmente
                  </p>
                </div>

                <div className="space-y-0.5 text-center">
                  <div className="flex items-end justify-center gap-2">
                    <span className="mb-1 text-lg font-medium text-muted-foreground">
                      R$
                    </span>

                    <span className="text-5xl font-bold tracking-tight text-primary">
                      193,80
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    por ano · equivalente a{" "}
                    <span className="font-semibold text-foreground">
                      R$ 16,15/mês
                    </span>
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-5 py-5">
                <div className="space-y-4">
                  {/* Transações */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <CheckIcon className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">Transações ilimitadas</p>

                      <p className="text-sm text-muted-foreground">
                        Registre quantas transações quiser
                      </p>
                    </div>
                  </div>

                  {/* Relatórios */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <CheckIcon className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">Relatórios de IA</p>

                      <p className="text-sm text-muted-foreground">
                        Insights inteligentes sobre suas finanças
                      </p>
                    </div>
                  </div>

                  {/* Desconto */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <CheckIcon className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">15% de desconto</p>

                      <p className="text-sm text-muted-foreground">
                        Economize R$ 34,20 por ano
                      </p>
                    </div>
                  </div>
                </div>

                <AcquirePlanButton
                  title="Adquirir plano anual"
                  priceId={env.STRIPE_PREMIUM_PRICE_YEARLY_ID}
                  buttonType={
                    !currentUserPlan || currentUserPlan === "plano mensal"
                      ? "upgrade"
                      : currentUserPlan === "plano anual"
                        ? "manage"
                        : "downgrade"
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <p className="pt-3 text-center text-sm text-muted-foreground">
            Cancele quando quiser. Sem contratos ou taxas escondidas.
          </p>
        </div>
      </main>
    </>
  );
};

export default SubscriptionPage;
