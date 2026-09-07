import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import { TransactionCategory } from "@prisma/client";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const EMPTY_CATEGORIES = Object.values(TransactionCategory).map((category) => ({
  category,
  totalAmount: 0,
  percentageOfTotal: 0,
}));

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  const hasData = expensesPerCategory.length > 0;
  const categoriesToShow = hasData ? expensesPerCategory : EMPTY_CATEGORIES;

  return (
    <ScrollArea className="col-span-2 h-[450px] rounded-md border pb-6">
      <CardHeader>
        <CardTitle className="font-bold">Gastos por Categoria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {categoriesToShow.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex w-full justify-between">
              <p className={`text-sm font-bold ${!hasData ? "text-muted-foreground" : ""}`}>
                {TRANSACTION_CATEGORY_LABELS[category.category]}
              </p>
              <p className={`text-sm font-bold ${!hasData ? "text-muted-foreground" : ""}`}>
                {category.percentageOfTotal}%
              </p>
            </div>
            <Progress value={category.percentageOfTotal} />
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};

export default ExpensesPerCategory;

