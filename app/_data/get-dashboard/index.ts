import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { DashboardPeriod } from "@/app/_utils/dashboard-period";
import {
  calculateBalance,
  calculateExpensesPerCategory,
  calculateTypesPercentage,
} from "./calculate";

export const getDashboard = async (period: DashboardPeriod) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { startDate, endDate } = period;
  const where = {
    userId,
    date: {
      gte: startDate,
      lt: endDate,
    },
  };

  const sumByType = async (type: TransactionType) =>
    Number(
      (
        await db.transaction.aggregate({
          where: { ...where, type },
          _sum: { amount: true },
        })
      )._sum.amount ?? 0,
    );

  const [
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    expensesByCategory,
    lastTransactions,
  ] = await Promise.all([
    sumByType(TransactionType.DEPOSIT),
    sumByType(TransactionType.INVESTMENT),
    sumByType(TransactionType.EXPENSE),
    db.transaction.groupBy({
      by: ["category"],
      where: { ...where, type: TransactionType.EXPENSE },
      _sum: { amount: true },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    }),
    db.transaction.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      take: 15,
    }),
  ]);

  const totals = { depositsTotal, investmentsTotal, expensesTotal };

  return {
    ...totals,
    balance: calculateBalance(totals),
    typesPercentage: calculateTypesPercentage(totals),
    totalExpensePerCategory: calculateExpensesPerCategory(
      expensesByCategory.map((item) => ({
        category: item.category,
        totalAmount: Number(item._sum.amount ?? 0),
      })),
      expensesTotal,
    ),
    lastTransactions,
  };
};
