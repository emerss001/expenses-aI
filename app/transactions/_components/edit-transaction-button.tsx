"use client";

import { useState } from "react";

import { PencilIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import UpsertTransactionDialog from "@/app/_components/upsert-transaction-dialog";
import { Transaction } from "@prisma/client";

interface EditTransactionButtonProps {
  transaction: Transaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [dialogOpen, setDialogOPen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="text-muted-foreground"
        size="icon"
        onClick={() => setDialogOPen(true)}
      >
        <PencilIcon />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogOpen}
        setDialogOPen={setDialogOPen}
        defaultValues={{
          ...transaction,
          amount: Number(transaction.amount),
        }}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
