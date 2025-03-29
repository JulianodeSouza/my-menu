export function formatMonetary(value: number | string): string {
  const valueValid = value || 0;

  return valueValid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDecimal(value: string): number {
  const formatedValue = Number(value.replace(",", "."));
  return formatedValue || 0;
}
