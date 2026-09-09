/**
 * Intervalo semiaberto [primeiro dia do mês, primeiro dia do mês seguinte).
 *
 * Montar a data por texto ("2026-01-01") faz o JavaScript interpretar em UTC e
 * deslocar o mês inteiro no fuso local — o dia 31 some e dias do mês seguinte
 * entram. Construir com os componentes numéricos mantém o mês fechado certo.
 */
export const getMonthDateRange = (month: string) => {
  const monthNumber = Number(month);
  const currentYear = new Date().getFullYear();

  return {
    startDate: new Date(currentYear, monthNumber - 1, 1),
    endDate: new Date(currentYear, monthNumber, 1),
  };
};
