"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { AddTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface AddTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsetTransaction = async (params: AddTransactionParams) => {
  AddTransactionSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { id, ...data } = params;

  if (id) {
    // updateMany filtrando por userId impede editar transação de outro usuário;
    // o userId também não é regravado, então a transação não muda de dono
    const { count } = await db.transaction.updateMany({
      where: {
        id,
        userId,
      },
      data,
    });

    if (count === 0) {
      throw new Error("Transaction not found");
    }
  } else {
    await db.transaction.create({
      data: { ...data, userId },
    });
  }

  revalidatePath("/transactions");
  revalidatePath("/");
};
