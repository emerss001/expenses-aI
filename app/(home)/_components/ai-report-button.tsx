"use client";

import DialogLimitPlan from "@/app/_components/dialog-limit-plan";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { ActionMessage } from "@/app/_components/ui/action-message";
import { CONNECTION_ERROR_MESSAGE } from "@/app/_lib/action-result";
import { BotIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

/** "2026-01-31" -> "31/01/2026" */
const formatDay = (day: string) => day.split("-").reverse().join("/");

interface AiReportButtonProps {
  /** Primeiro dia do período em exibição, no formato yyyy-MM-dd. */
  from: string;
  /** Último dia do período em exibição (inclusivo), no formato yyyy-MM-dd. */
  to: string;
  hasPremiumPlan: boolean;
}

const AiReportButton = ({ from, to, hasPremiumPlan }: AiReportButtonProps) => {
  const [report, setReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const periodLabel = `${formatDay(from)} a ${formatDay(to)}`;

  const messageForStatus = (status: number) => {
    if (status === 401) {
      return "Sua sessão expirou. Entre novamente para continuar.";
    }
    if (status === 403) {
      return "O relatório de IA está disponível apenas nos planos premium.";
    }
    return "Não foi possível gerar o relatório. Tente novamente em instantes.";
  };

  const handleGenerateReportClick = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setReport(""); // Limpa o relatório anterior

      const response = await fetch("/api/report/ai", {
        method: "POST",
        body: JSON.stringify({ from, to }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok || !response.body) {
        setErrorMessage(messageForStatus(response.status));
        return;
      }

      // Prepara o leitor para ler os pedaços (chunks) de texto
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break; // Terminou de receber o texto

        // Decodifica os bytes para string e adiciona ao estado
        const chunkText = decoder.decode(value, { stream: true });
        setReport((prev) => prev + chunkText);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!hasPremiumPlan ? (
        <DialogLimitPlan
          trigger={
            <Button variant="outline" className="w-full sm:w-auto">
              Relatório IA
              <BotIcon className="ml-2 h-4 w-4" />
            </Button>
          }
          tittle="Relatório IA indisponível"
          description="Para gerar relatórios com inteligência artificial, você precisa adquirir um plano premium. Clique em Continuar para ser redirecionado à página de planos."
        />
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Relatório IA
              <BotIcon className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>

          {/* Ajustei o max-w para dar mais respiro ao texto */}
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Insights sobre as suas finanças no período de {periodLabel}.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[55dvh] sm:max-h-[450px]">
              <div className="prose prose-sm max-w-none pb-4 pr-4 text-muted-foreground dark:prose-invert sm:prose-base prose-headings:text-white prose-strong:text-white">
                {report ? (
                  <Markdown>{report}</Markdown>
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground/50">
                    {isLoading
                      ? "Analisando suas finanças..."
                      : "Clique em 'Gerar Relatório' para começar."}
                  </div>
                )}
              </div>
            </ScrollArea>

            <ActionMessage message={errorMessage} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="w-full sm:w-auto">
                  Fechar
                </Button>
              </DialogClose>
              <Button
                className="w-full sm:w-auto"
                onClick={handleGenerateReportClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Gerar Relatório"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AiReportButton;
