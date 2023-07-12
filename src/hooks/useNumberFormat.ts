import { useMemo } from "react";

export function useNumberFormat(locale = 'ru-RU') {
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const formatNumber = (num: number | string) => {
      return numberFormatter.format(+num);
  };

  return formatNumber;
}