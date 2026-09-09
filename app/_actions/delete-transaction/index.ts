"use server";

import { db } from "@/app/_lib/prisma";
import { ActionError, runAction } from "@/app/_lib/action-result";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteTransaction = async (transactionId: string) =>
  runAction(async () => {
    const { userId } = await auth();
    if (!userId) {
      throw new ActionError(
        "Sua sessão expirou. Entre novamente para continuar.",
      );
    }

    // deleteMany filtrando por userId garante que ninguém apague transação de outro usuário
    const { count } = await db.transaction.deleteMany({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (count === 0) {
      throw new ActionError(
        "Esta transação não existe mais ou não pertence a você.",
      );
    }

    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/subscription");
  });
