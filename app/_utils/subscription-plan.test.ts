import { describe, expect, it } from "vitest";
import {
  SUBSCRIPTION_PLANS,
  getSubscriptionPlan,
  hasPaidPlan,
} from "./subscription-plan";

describe("getSubscriptionPlan", () => {
  it("reconhece cada plano gravado pelo webhook", () => {
    expect(getSubscriptionPlan({ subscriptionPlan: "Plano Mensal" })).toBe(
      SUBSCRIPTION_PLANS.MONTHLY,
    );
    expect(getSubscriptionPlan({ subscriptionPlan: "Plano Anual" })).toBe(
      SUBSCRIPTION_PLANS.YEARLY,
    );
    expect(getSubscriptionPlan({ subscriptionPlan: "Plano Teste" })).toBe(
      SUBSCRIPTION_PLANS.TEST,
    );
  });

  it("ignora diferença de caixa e espaços em volta", () => {
    expect(getSubscriptionPlan({ subscriptionPlan: "plano anual" })).toBe(
      SUBSCRIPTION_PLANS.YEARLY,
    );
    expect(getSubscriptionPlan({ subscriptionPlan: "  PLANO MENSAL  " })).toBe(
      SUBSCRIPTION_PLANS.MONTHLY,
    );
  });

  it.each([
    ["usuário que nunca assinou (chave ausente)", {}],
    ["plano removido pelo webhook", { subscriptionPlan: null }],
    ["plano inexistente", { subscriptionPlan: "Plano Diamante" }],
    ["valor que não é texto", { subscriptionPlan: 123 }],
    ["texto vazio", { subscriptionPlan: "" }],
    ["metadata ausente", undefined],
    ["metadata nulo", null],
  ])("devolve null para %s", (_label, metadata) => {
    expect(getSubscriptionPlan(metadata)).toBeNull();
  });
});

describe("hasPaidPlan", () => {
  it("libera quem tem plano reconhecido", () => {
    expect(hasPaidPlan({ subscriptionPlan: "Plano Mensal" })).toBe(true);
  });

  // regressão: a checagem antiga comparava com null e deixava passar quem
  // nunca assinou, porque nesse caso a chave nem existe no metadata
  it("não libera usuário que nunca assinou", () => {
    expect(hasPaidPlan({})).toBe(false);
  });

  it("não libera valor desconhecido no metadata", () => {
    expect(hasPaidPlan({ subscriptionPlan: "premium" })).toBe(false);
  });
});
