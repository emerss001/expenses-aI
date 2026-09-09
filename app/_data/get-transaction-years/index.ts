import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Anos que o usuário pode consultar: do mais antigo ao mais recente lançamento,
 * sempre incluindo o ano corrente. Sem isso o seletor ficaria preso no ano atual
 * e lançamentos de anos anteriores seriam inacessíveis.
 */
export const getTransactionYears = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { _min, _max } = await db.transaction.aggregate({
    where: { userId },
    _min: { date: true },
    _max: { date: true },
  });

  const currentYear = new Date().getFullYear();
  const firstYear = Math.min(
    _min.date?.getFullYear() ?? currentYear,
    currentYear,
  );
  const lastYear = Math.max(
    _max.date?.getFullYear() ?? currentYear,
    currentYear,
  );

  // mais recentes primeiro
  return Array.from({ length: lastYear - firstYear + 1 }, (_, index) =>
    String(lastYear - index),
  );
};
