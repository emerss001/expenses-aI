"use client";

import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import { Button } from "./ui/button";
import { ArrowDownUpIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useRouter } from "next/navigation";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogOpen, setDialogOPen] = useState(false);
  const router = useRouter();

  return (
    <>
      {!userCanAddTransaction ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="rounded-full font-bold">
              Adicionar transação
              <ArrowDownUpIcon />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Você atingiu o limite de transações do seu plano
              </AlertDialogTitle>

              <AlertDialogDescription>
                Para adicionar mais transações, você precisa adquirir um plano
                premium. Clique em{" "}
                <span className="font-semibold">Continuar</span> para ser
                redirecionado à página de planos.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push("/subscription")}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
