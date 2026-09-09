import { Button } from "@/app/_components/ui/button";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_ICONS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";
import { Transaction, TransactionType } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import EditTransactionButton from "./edit-transaction-button";
import TransactionTypeBadge from "./type-badge";

const AMOUNT_STYLES = {
  [TransactionType.EXPENSE]: { color: "text-danger", prefix: "- " },
  [TransactionType.DEPOSIT]: { color: "text-primary", prefix: "+ " },
  [TransactionType.INVESTMENT]: { color: "text-white", prefix: "" },
};

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const { color, prefix } = AMOUNT_STYLES[transaction.type];

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-lg bg-white bg-opacity-[3%] p-2.5">
            <Image
              src={TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}
              alt={TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
              height={20}
              width={20}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <p className={`shrink-0 whitespace-nowrap font-bold ${color}`}>
          {prefix}
          {formatCurrency(Number(transaction.amount))}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <TransactionTypeBadge transaction={transaction} />
          <p className="text-sm text-muted-foreground">
            {TRANSACTION_CATEGORY_LABELS[transaction.category]} ·{" "}
            {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
          </p>
        </div>

        <div className="ml-auto flex shrink-0 items-center">
          <EditTransactionButton transaction={transaction} />
          <Button variant="ghost" className="text-muted-foreground" size="icon">
            <Trash2Icon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
