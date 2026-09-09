"use client";

import { Button } from "@/app/_components/ui/button";
import { DatePicker } from "@/app/_components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { DAY_FORMAT } from "@/app/_utils/dashboard-period";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { CalendarRangeIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

interface PeriodSelectProps {
  years: string[];
}

/** Converte "yyyy-MM-dd" da URL em Date local (sem o deslocamento de fuso do UTC). */
const dayParamToDate = (value: string | null) =>
  value ? new Date(`${value}T00:00:00`) : undefined;

const PeriodSelect = ({ years }: PeriodSelectProps) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [isCustom, setIsCustom] = useState(Boolean(from && to));
  const [customFrom, setCustomFrom] = useState(dayParamToDate(from));
  const [customTo, setCustomTo] = useState(dayParamToDate(to));

  const today = new Date();
  const currentMonth = month ?? format(today, "MM");
  const currentYear = year ?? format(today, "yyyy");

  const goToMonth = (nextMonth: string, nextYear: string) =>
    push(`/?month=${nextMonth}&year=${nextYear}`);

  const handleOpenCustom = () => {
    // já abre preenchido com o mês em exibição, para o usuário só ajustar
    const reference = new Date(Number(currentYear), Number(currentMonth) - 1, 1);
    setCustomFrom(customFrom ?? startOfMonth(reference));
    setCustomTo(customTo ?? endOfMonth(reference));
    setIsCustom(true);
  };

  const handleCloseCustom = () => {
    setIsCustom(false);
    goToMonth(format(today, "MM"), format(today, "yyyy"));
  };

  const isRangeValid = Boolean(customFrom && customTo && customFrom <= customTo);

  const handleApplyCustom = () => {
    if (!customFrom || !customTo || !isRangeValid) {
      return;
    }
    push(
      `/?from=${format(customFrom, DAY_FORMAT)}&to=${format(customTo, DAY_FORMAT)}`,
    );
  };

  if (isCustom) {
    return (
      <div className="w-full space-y-2 sm:w-auto">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <div className="w-full sm:w-56">
            <DatePicker
              value={customFrom}
              onChange={setCustomFrom}
              placeholder="Data inicial"
            />
          </div>
          <div className="w-full sm:w-56">
            <DatePicker
              value={customTo}
              onChange={setCustomTo}
              placeholder="Data final"
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 sm:flex-none"
              onClick={handleApplyCustom}
              disabled={!isRangeValid}
            >
              Aplicar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseCustom}
              aria-label="Sair do período personalizado"
            >
              <XIcon />
            </Button>
          </div>
        </div>

        {!isRangeValid && customFrom && customTo && (
          <p className="text-sm text-danger">
            A data inicial não pode ser posterior à data final.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <Select
        value={currentMonth}
        onValueChange={(value) => goToMonth(value, currentYear)}
      >
        <SelectTrigger className="w-full text-base sm:w-36">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTH_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentYear}
        onValueChange={(value) => goToMonth(currentMonth, value)}
      >
        <SelectTrigger className="w-28 text-base">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={handleOpenCustom}
        aria-label="Escolher período personalizado"
        title="Período personalizado"
      >
        <CalendarRangeIcon />
      </Button>
    </div>
  );
};

export default PeriodSelect;
