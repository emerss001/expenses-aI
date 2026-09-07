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
import { BotIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

interface AiReportButtonProps {
  month: string;
  hasPremiumPlan: boolean;
}

const AiReportButton = ({ month, hasPremiumPlan }: AiReportButtonProps) => {
  const [report, setReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReportClick = async () => {
    try {
      setIsLoading(true);
      setReport(""); // Limpa o relatório anterior

      const response = await fetch("/api/report/ai", {
        method: "POST",
        body: JSON.stringify({ month }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok || !response.body) {
        throw new Error("Erro ao gerar relatório");
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
      alert("Falha ao gerar o relatório.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!hasPremiumPlan ? (
        <DialogLimitPlan
          trigger={
            <Button variant="outline">
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
            <Button variant="outline">
              Relatório IA
              <BotIcon className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>

          {/* Ajustei o max-w para dar mais respiro ao texto */}
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar um relatório com insights
                sobre as suas finanças.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[450px]">
              <div className="prose prose-sm sm:prose-base dark:prose-invert prose-headings:text-white prose-strong:text-white max-w-none pb-4 pr-4 text-muted-foreground">
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Fechar</Button>
              </DialogClose>
              <Button onClick={handleGenerateReportClick} disabled={isLoading}>
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
