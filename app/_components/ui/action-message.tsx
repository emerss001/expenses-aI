import { AlertCircleIcon } from "lucide-react";

interface ActionMessageProps {
  message?: string | null;
}

/** Aviso de falha exibido junto da ação que o usuário disparou. */
export const ActionMessage = ({ message }: ActionMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
    >
      <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
