"use client";

import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import { Button } from "./ui/button";
import { ArrowDownUpIcon } from "lucide-react";
import DialogLimitPlan from "./dialog-limit-plan";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogOpen, setDialogOPen] = useState(false);

  return (
    <>
      {!userCanAddTransaction ? (
        <DialogLimitPlan
          trigger={
            <Button className="rounded-full font-bold">
              Adicionar transação
              <ArrowDownUpIcon />
            </Button>
          }
          tittle="Você atingiu o limite de transações do seu plano"
          description="Para adicionar mais transações, você precisa adquirir um plano premium. Clique em Continuar para ser redirecionado à página de planos."
        />
      ) : (
        <>
          <Button
            className="rounded-full font-bold"
            onClick={() => setDialogOPen(true)}
          >
            Adicionar transação
            <ArrowDownUpIcon />
          </Button>

          <UpsertTransactionDialog
            isOpen={dialogOpen}
            setDialogOPen={setDialogOPen}
          />
        </>
      )}
    </>
  );
};

export default AddTransactionButton;
