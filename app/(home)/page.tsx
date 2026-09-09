import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import PeriodSelect from "./_components/period-select";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { getTransactionYears } from "../_data/get-transaction-years";
import AiReportButton from "./_components/ai-report-button";
import {
  DAY_FORMAT,
  PeriodSearchParams,
  parseDashboardPeriod,
} from "../_utils/dashboard-period";
import { format, subDays } from "date-fns";

interface HomeProps {
  searchParams: PeriodSearchParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const period = parseDashboardPeriod(searchParams);
  if (!period) {
    const today = new Date();
    redirect(`/?month=${format(today, "MM")}&year=${format(today, "yyyy")}`);
  }

  const dashboard = await getDashboard(period);
  const userCanAddTransaction = await canUserAddTransaction();
  const years = await getTransactionYears();
  const user = await clerkClient.users.getUser(userId);

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AiReportButton
              // remonta ao trocar de período, para não exibir relatório de outro intervalo
              key={`${format(period.startDate, DAY_FORMAT)}-${format(period.endDate, DAY_FORMAT)}`}
              from={format(period.startDate, DAY_FORMAT)}
              to={format(subDays(period.endDate, 1), DAY_FORMAT)}
              // quem nunca assinou nao tem a chave no metadata: ausente e diferente
              // de nulo, entao a checagem precisa ser por valor presente
              hasPremiumPlan={Boolean(user.publicMetadata?.subscriptionPlan)}
            />
            <PeriodSelect years={years} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="flex min-w-0 flex-col gap-6">
            <SummaryCards
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
