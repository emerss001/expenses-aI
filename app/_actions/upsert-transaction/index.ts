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
import { canUserAddTransaction } from "@/app/_data/can-user-add-transaction";
import { ActionError, runAction } from "@/app/_lib/action-result";

interface AddTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsetTransaction = async (params: AddTransactionParams) =>
  runAction(async () => {
    AddTransactionSchema.parse(params);

    const { userId } = await auth();
    if (!userId) {
      throw new ActionError(
        "Sua sessão expirou. Entre novamente para continuar.",
      );
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
        throw new ActionError(
          "Esta transação não existe mais ou não pertence a você.",
        );
      }
    } else {
      // a tela já troca o botão quando o limite estoura, mas a regra precisa
      // valer aqui também: a action é chamável diretamente
      if (!(await canUserAddTransaction())) {
        throw new ActionError(
          "Você atingiu o limite de 10 transações por mês do plano grátis. Assine um plano premium para continuar.",
        );
      }

      await db.transaction.create({
        data: { ...data, userId },
      });
    }

    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/subscription");
  });
