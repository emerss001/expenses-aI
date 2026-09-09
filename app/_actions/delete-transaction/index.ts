"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteTransaction = async (transactionId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // deleteMany filtrando por userId garante que ninguém apague transação de outro usuário
  const { count } = await db.transaction.deleteMany({
    where: {
      id: transactionId,
      userId,
    },
  });

  if (count === 0) {
    throw new Error("Transaction not found");
  }

  revalidatePath("/transactions");
  revalidatePath("/");
};
