import type { TransactionCategory } from "@prisma/client";
import type {
  TotalExpensePerCategory,
  TransactionPercentagePerType,
} from "./types";

export interface PeriodTotals {
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
}

/**
 * Regras de cálculo do dashboard, separadas das consultas ao banco para poderem
 * ser verificadas isoladamente. Erro aqui não quebra tela nenhuma: só mostra
 * número errado, que é o defeito mais caro num app de finanças.
 */

/** O que sobrou no período: o que entrou menos o que saiu e o que foi investido. */
export const calculateBalance = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
}: PeriodTotals) => depositsTotal - investmentsTotal - expensesTotal;

/** Participação de um valor no total, em pontos percentuais inteiros. */
export const calculatePercentage = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

/** Quanto cada tipo representa do total movimentado no período. */
export const calculateTypesPercentage = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
}: PeriodTotals): TransactionPercentagePerType => {
  const movedTotal = depositsTotal + investmentsTotal + expensesTotal;

  return {
    DEPOSIT: calculatePercentage(depositsTotal, movedTotal),
    EXPENSE: calculatePercentage(expensesTotal, movedTotal),
    INVESTMENT: calculatePercentage(investmentsTotal, movedTotal),
  };
};

/** Quanto cada categoria representa do total de despesas do período. */
export const calculateExpensesPerCategory = (
  expensesByCategory: { category: TransactionCategory; totalAmount: number }[],
  expensesTotal: number,
): TotalExpensePerCategory[] =>
  expensesByCategory.map(({ category, totalAmount }) => ({
    category,
    totalAmount,
    percentageOfTotal: calculatePercentage(totalAmount, expensesTotal),
  }));
