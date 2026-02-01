export function maskInputMonetary(value: number | string): string {
  // Remove all non-numeric characters
  const onlyDigits = onlyNumbers(String(value));
  if (!onlyDigits) return "";
  // Convert to cents
  const number = parseInt(onlyDigits, 10);
  const cents = (number / 100).toFixed(2);
  // Format to R$ 0,00
  return `R$ ${cents}`.replace(".", ",");
}

export function formatNumberToMonetary(value: number): string {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formatter.format(value);
}

export function formatDecimal(value: string | number): number {
  const formatedValue = Number(String(value).replace(",", "."));
  return formatedValue || 0;
}

export function onlyNumbers(value: string): string {
  if (!value) return "";

  return value.replace(/\D+/g, "");
}
