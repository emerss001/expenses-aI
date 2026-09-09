import { addDays, isValid, parse } from "date-fns";

export const DAY_FORMAT = "yyyy-MM-dd";

export interface DashboardPeriod {
  /** Primeiro instante do período. */
  startDate: Date;
  /** Primeiro instante DEPOIS do período — o intervalo é semiaberto. */
  endDate: Date;
  isCustom: boolean;
}

export interface PeriodSearchParams {
  month?: string;
  year?: string;
  from?: string;
  to?: string;
}

const parseDay = (value: string) => {
  const parsed = parse(value, DAY_FORMAT, new Date());
  return isValid(parsed) ? parsed : null;
};

/**
 * Traduz os parâmetros da URL no período que o dashboard deve considerar.
 * Retorna null quando os parâmetros não formam um período válido, para quem
 * chama decidir o que fazer (a página redireciona para o mês atual).
 *
 * As datas são construídas em horário local: montar por texto ("2026-01-01")
 * faria o JavaScript interpretar em UTC e deslocar o período inteiro.
 */
export const parseDashboardPeriod = ({
  month,
  year,
  from,
  to,
}: PeriodSearchParams): DashboardPeriod | null => {
  if (from || to) {
    if (!from || !to) {
      return null;
    }

    const startDate = parseDay(from);
    const lastDay = parseDay(to);

    if (!startDate || !lastDay || startDate > lastDay) {
      return null;
    }

    // a data final escolhida pelo usuário é inclusiva; o intervalo, semiaberto
    return { startDate, endDate: addDays(lastDay, 1), isCustom: true };
  }

  if (
    !month ||
    !year ||
    !/^(0[1-9]|1[0-2])$/.test(month) ||
    !/^\d{4}$/.test(year)
  ) {
    return null;
  }

  const monthNumber = Number(month);
  const yearNumber = Number(year);

  return {
    startDate: new Date(yearNumber, monthNumber - 1, 1),
    endDate: new Date(yearNumber, monthNumber, 1),
    isCustom: false,
  };
};
