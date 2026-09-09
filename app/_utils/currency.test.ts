import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

/** O Intl separa "R$" do número com espaço não separável (U+00A0). */
const normalizeSpaces = (value: string) => value.replace(/\u00a0/g, " ");

describe("formatCurrency", () => {
  it("formata em real com duas casas decimais", () => {
    expect(normalizeSpaces(formatCurrency(10.5))).toBe("R$ 10,50");
  });

  it("usa ponto como separador de milhar e vírgula como decimal", () => {
    expect(normalizeSpaces(formatCurrency(1234.56))).toBe("R$ 1.234,56");
    expect(normalizeSpaces(formatCurrency(1000000))).toBe("R$ 1.000.000,00");
  });

  it("formata zero e valores negativos", () => {
    expect(normalizeSpaces(formatCurrency(0))).toBe("R$ 0,00");
    expect(normalizeSpaces(formatCurrency(-50))).toBe("-R$ 50,00");
  });
});
