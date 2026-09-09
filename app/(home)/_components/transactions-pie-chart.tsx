"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import { TransactionType } from "@prisma/client";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Pie, PieChart } from "recharts";
import PercentageItem from "./percentage-item";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  depositsTotal: number;
  expensesTotal: number;
  investmentsTotal: number;
  typesPercentage: TransactionPercentagePerType;
}

const TransactionsPieChart = ({
  depositsTotal,
  expensesTotal,
  investmentsTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      amount: depositsTotal,
      fill: chartConfig[TransactionType.DEPOSIT].color,
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: chartConfig[TransactionType.EXPENSE].color,
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investmentsTotal,
      fill: chartConfig[TransactionType.INVESTMENT].color,
    },
  ];

  const hasData =
    depositsTotal > 0 || expensesTotal > 0 || investmentsTotal > 0;

  const emptyChartData = [{ type: "empty", amount: 1, fill: "#3B3B3B" }];

  return (
    <Card className="flex min-w-0 flex-col pb-5">
      <CardHeader>
        <CardTitle className="font-bold">Resumo das Transações</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[170px] w-[170px] max-w-full"
        >
          <PieChart>
            {hasData && (
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
            )}
            <Pie
              data={hasData ? chartData : emptyChartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={50}
            />
          </PieChart>
        </ChartContainer>
        <div className="space-y-5">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receita"
            value={typesPercentage[TransactionType.DEPOSIT] || 0}
          />

          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-red-500" />}
            title="Despesas"
            value={typesPercentage[TransactionType.EXPENSE] || 0}
          />

          <PercentageItem
            icon={<PiggyBankIcon size={16} />}
            title="Investimento"
            value={typesPercentage[TransactionType.INVESTMENT] || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;
