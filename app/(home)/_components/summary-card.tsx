import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) => {
  const isLarge = size === "large";

  return (
    <Card className={isLarge ? "bg-white bg-opacity-5" : ""}>
      <CardHeader className="flex-row items-center gap-2 p-4 md:p-6">
        {icon}
        <p
          className={
            isLarge ? "text-white opacity-70" : "text-muted-foreground"
          }
        >
          {title}
        </p>
      </CardHeader>
      <CardContent
        className={`p-4 pt-0 md:p-6 md:pt-0 ${
          isLarge
            ? "flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between"
            : "flex justify-between"
        }`}
      >
        <p
          className={`break-words font-bold ${
            isLarge ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          }`}
        >
          {Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {isLarge && (
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
