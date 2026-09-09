import { describe, expect, it } from "vitest";
import { parseDashboardPeriod } from "./dashboard-period";

describe("parseDashboardPeriod — seleção por mês", () => {
  it("vai do primeiro dia do mês ao primeiro dia do mês seguinte", () => {
    const period = parseDashboardPeriod({ month: "01", year: "2026" });

    expect(period).toEqual({
      startDate: new Date(2026, 0, 1),
      endDate: new Date(2026, 1, 1),
      isCustom: false,
    });
  });

  it("inclui o dia 31 nos meses que o têm", () => {
    const period = parseDashboardPeriod({ month: "01", year: "2026" })!;
    const lancamentoNoDia31 = new Date(2026, 0, 31);

    expect(lancamentoNoDia31 >= period.startDate).toBe(true);
    expect(lancamentoNoDia31 < period.endDate).toBe(true);
  });

  it("não deixa fevereiro invadir março", () => {
    const period = parseDashboardPeriod({ month: "02", year: "2026" })!;
    const primeiroDeMarco = new Date(2026, 2, 1);

    expect(period.endDate).toEqual(primeiroDeMarco);
    expect(primeiroDeMarco < period.endDate).toBe(false);
  });

  it("considera o dia 29 em ano bissexto", () => {
    const period = parseDashboardPeriod({ month: "02", year: "2024" })!;
    const vinteENove = new Date(2024, 1, 29);

    expect(vinteENove < period.endDate).toBe(true);
  });

  it("faz dezembro terminar em janeiro do ano seguinte", () => {
    const period = parseDashboardPeriod({ month: "12", year: "2025" })!;

    expect(period.endDate).toEqual(new Date(2026, 0, 1));
  });

  it("aceita anos anteriores ao corrente", () => {
    const period = parseDashboardPeriod({ month: "12", year: "2020" })!;

    expect(period.startDate).toEqual(new Date(2020, 11, 1));
  });

  it.each([
    ["mês fora do intervalo", { month: "13", year: "2026" }],
    ["mês zero", { month: "00", year: "2026" }],
    ["mês sem zero à esquerda", { month: "5", year: "2026" }],
    ["ano com formato inválido", { month: "05", year: "26" }],
    ["mês sem ano", { month: "05" }],
    ["ano sem mês", { year: "2026" }],
    ["nenhum parâmetro", {}],
  ])("recusa %s", (_label, params) => {
    expect(parseDashboardPeriod(params)).toBeNull();
  });
});

describe("parseDashboardPeriod — período personalizado", () => {
  it("trata a data final como inclusiva", () => {
    const period = parseDashboardPeriod({
      from: "2025-12-15",
      to: "2026-01-10",
    })!;

    expect(period.startDate).toEqual(new Date(2025, 11, 15));
    // o fim é exclusivo, então precisa cair no dia seguinte ao escolhido
    expect(period.endDate).toEqual(new Date(2026, 0, 11));
    expect(period.isCustom).toBe(true);
  });

  it("aceita período de um único dia e cobre o dia inteiro", () => {
    const period = parseDashboardPeriod({
      from: "2026-03-05",
      to: "2026-03-05",
    })!;

    const fimDoDia = new Date(2026, 2, 5, 23, 59, 59);
    expect(fimDoDia < period.endDate).toBe(true);
  });

  it.each([
    [
      "data inicial posterior à final",
      { from: "2026-05-10", to: "2026-05-01" },
    ],
    [
      "data que não existe no calendário",
      { from: "2026-02-31", to: "2026-03-01" },
    ],
    ["apenas a data inicial", { from: "2026-01-01" }],
    ["apenas a data final", { to: "2026-01-01" }],
    ["texto que não é data", { from: "ontem", to: "hoje" }],
  ])("recusa %s", (_label, params) => {
    expect(parseDashboardPeriod(params)).toBeNull();
  });
});
