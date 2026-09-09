import { env } from "@/app/_lib/env";
import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { generateAiReportSchema } from "./schema";
import { parseDashboardPeriod } from "@/app/_utils/dashboard-period";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Usuário não autenticado", { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Corpo da requisição inválido", { status: 400 });
  }

  const parsedBody = generateAiReportSchema.safeParse(body);
  if (!parsedBody.success) {
    return new Response("Corpo da requisição inválido", { status: 400 });
  }

  const period = parseDashboardPeriod(parsedBody.data);
  if (!period) {
    return new Response("Período inválido", { status: 400 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const subscriptionPlan = user.publicMetadata?.subscriptionPlan;

  if (!subscriptionPlan) {
    return new Response("Usuário não possui plano premium", { status: 403 });
  }

  const { startDate, endDate } = period;

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  if (transactions.length === 0) {
    return new Response("Não há transações neste período.");
  }

  const content = `Você é um consultor financeiro pessoal inteligente, objetivo e direto ao ponto. 
  Analise as seguintes transações financeiras do usuário e gere um relatório detalhado.
  
  Regras de formatação e tom:
  - NUNCA use introduções genéricas como "Com base nos dados fornecidos..." ou "Aqui está o seu relatório...". Comece diretamente no título principal.
  - Use Markdown nativo (## para títulos, ** para negrito, listas com -).
  - Seja encorajador, mas realista.
  - O usuário pode estar analisando um período curto. Não assuma que um fluxo de caixa negativo significa dívida automática (ele pode estar usando saldo de meses anteriores).
  - Não use termos técnicos, como o nome das categorias no formato de enum por exemplo (Outros (OTHER)). Este será o texto que o usuário irá ler, ele não quer saber coisas técnicas da construção do sistema

  Siga rigorosamente esta estrutura:
  ## 📊 Resumo Financeiro
  (Mostre os totais de Entradas, Saídas, Investimentos e o Saldo do período de forma resumida). A conta usada deve ser Entradas - Saídas - Investimentos = Saldo.

  ## 🔍 Análise de Categorias
  (Analise para onde o dinheiro está indo. Destaque os maiores gastos. Se a categoria "OTHER" ou "OUTROS" for muito alta, dê um puxão de orelha amigável pedindo para ele categorizar melhor).

  ## 💡 Insights e Dicas
  (Forneça 3 conselhos práticos e personalizados baseados puramente no padrão destes dados. Elogie acertos como alta taxa de investimentos e alerte sobre excessos).

  Os dados estão no formato DATA-VALOR-TIPO-CATEGORIA, separados por ponto e vírgula:
  ${transactions.map((item) => `${item.date.toLocaleDateString("pt-BR")}-${item.amount}-${item.type}-${item.category}`).join("; ")}`;

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const responseStream = await ai.models.generateContentStream({
    model: "gemini-3.5-flash-lite",
    contents: content,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of responseStream) {
        if (chunk.text) {
          controller.enqueue(new TextEncoder().encode(chunk.text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
