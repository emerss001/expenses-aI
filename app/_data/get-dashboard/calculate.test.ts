import { describe, expect, it } from "vitest";
import type { TransactionCategory } from "@prisma/client";
import {
  calculateBalance,
  calculateExpensesPerCategory,
  calculatePercentage,
  calculateTypesPercentage,
} from "./calculate";

describe("calculateBalance", () => {
  it("desconta despesas e investimentos das receitas", () => {
    expect(
      calculateBalance({
        depositsTotal: 5000,
        expensesTotal: 1200,
        investmentsTotal: 800,
      }),
    ).toBe(3000);
  });

  it("fica negativo quando se gasta mais do que entra", () => {
    expect(
      calculateBalance({
        depositsTotal: 1000,
        expensesTotal: 1500,
        investmentsTotal: 0,
      }),
    ).toBe(-500);
  });

  it("preserva centavos", () => {
    expect(
      calculateBalance({
        depositsTotal: 100.75,
        expensesTotal: 30.25,
        investmentsTotal: 0,
      }),
    ).toBeCloseTo(70.5, 2);
  });

  it("é zero num período sem movimento", () => {
    expect(
      calculateBalance({
        depositsTotal: 0,
        expensesTotal: 0,
        investmentsTotal: 0,
      }),
    ).toBe(0);
  });
});

describe("calculatePercentage", () => {
  it("calcula a participação em pontos inteiros", () => {
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(1, 3)).toBe(33);
    expect(calculatePercentage(2, 3)).toBe(67);
  });

  // regressão: a versão anterior dividia por zero e devolvia NaN, que chegava
  // à tela como "NaN%" quando o fallback do componente não pegava
  it("devolve zero quando não há total, em vez de NaN", () => {
    expect(calculatePercentage(0, 0)).toBe(0);
    expect(calculatePercentage(100, 0)).toBe(0);
  });
});

describe("calculateTypesPercentage", () => {
  it("divide o movimento do período entre os três tipos", () => {
    expect(
      calculateTypesPercentage({
        depositsTotal: 500,
        expensesTotal: 300,
        investmentsTotal: 200,
      }),
    ).toEqual({ DEPOSIT: 50, EXPENSE: 30, INVESTMENT: 20 });
  });

  it("atribui tudo ao único tipo movimentado", () => {
    expect(
      calculateTypesPercentage({
        depositsTotal: 1000,
        expensesTotal: 0,
        investmentsTotal: 0,
      }),
    ).toEqual({ DEPOSIT: 100, EXPENSE: 0, INVESTMENT: 0 });
  });

  it("zera todos os tipos num período sem movimento", () => {
    expect(
      calculateTypesPercentage({
        depositsTotal: 0,
        expensesTotal: 0,
        investmentsTotal: 0,
      }),
    ).toEqual({ DEPOSIT: 0, EXPENSE: 0, INVESTMENT: 0 });
  });

  it("considera despesas e investimentos no total, não só receitas", () => {
    // sem receita alguma, as saídas ainda repartem 100% do movimento
    expect(
      calculateTypesPercentage({
        depositsTotal: 0,
        expensesTotal: 750,
        investmentsTotal: 250,
      }),
    ).toEqual({ DEPOSIT: 0, EXPENSE: 75, INVESTMENT: 25 });
  });
});

describe("calculateExpensesPerCategory", () => {
  const categorias: { category: TransactionCategory; totalAmount: number }[] = [
    { category: "FOOD", totalAmount: 600 },
    { category: "HOUSING", totalAmount: 300 },
    { category: "LEISURE", totalAmount: 100 },
  ];

  it("calcula a fatia de cada categoria sobre o total de despesas", () => {
    expect(calculateExpensesPerCategory(categorias, 1000)).toEqual([
      { category: "FOOD", totalAmount: 600, percentageOfTotal: 60 },
      { category: "HOUSING", totalAmount: 300, percentageOfTotal: 30 },
      { category: "LEISURE", totalAmount: 100, percentageOfTotal: 10 },
    ]);
  });

  it("preserva a ordem recebida do banco", () => {
    const resultado = calculateExpensesPerCategory(categorias, 1000);

    expect(resultado.map((item) => item.category)).toEqual([
      "FOOD",
      "HOUSING",
      "LEISURE",
    ]);
  });

  it("devolve lista vazia quando não há despesas", () => {
    expect(calculateExpensesPerCategory([], 0)).toEqual([]);
  });

  it("não gera NaN quando o total de despesas é zero", () => {
    expect(
      calculateExpensesPerCategory([{ category: "FOOD", totalAmount: 0 }], 0),
    ).toEqual([{ category: "FOOD", totalAmount: 0, percentageOfTotal: 0 }]);
  });
});
