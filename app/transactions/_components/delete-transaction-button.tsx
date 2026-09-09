"use client";

import { deleteTransaction } from "@/app/_actions/delete-transaction";
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
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { LoaderCircle, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface DeleteTransactionButtonProps {
  transactionId: string;
  transactionName: string;
}

const DeleteTransactionButton = ({
  transactionId,
  transactionName,
}: DeleteTransactionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmClick = async () => {
    setIsDeleting(true);
    try {
      await deleteTransaction(transactionId);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Não foi possível excluir a transação.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground"
          size="icon"
          aria-label={`Excluir transação ${transactionName}`}
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription>
            A transação &quot;{transactionName}&quot; será removida
            definitivamente e deixará de contar nos seus totais. Essa ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-danger text-white hover:bg-danger/90"
            disabled={isDeleting}
            onClick={(event) => {
              // evita o fechamento automático do dialog enquanto a exclusão roda
              event.preventDefault();
              handleConfirmClick();
            }}
          >
            {isDeleting ? <LoaderCircle className="animate-spin" /> : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionButton;
