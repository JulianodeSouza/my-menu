export function formatMonetary(value: number | string): string {
  // Remove tudo que não for número
  const onlyDigits = String(value).replace(/\D+/g, "");
  if (!onlyDigits) return "R$ 0,00";
  // Converte para centavos
  const number = parseInt(onlyDigits, 10);
  const cents = (number / 100).toFixed(2);
  // Formata para R$ 0,00
  return `R$ ${cents}`.replace(".", ",");
}

export function formatDecimal(value: string): number {
  const formatedValue = Number(value.replace(",", "."));
  return formatedValue || 0;
}

export function onlyNumbers(value: string): string {
  return value.replace(/\D+/g, "");
}
