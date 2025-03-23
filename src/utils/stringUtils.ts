export function formatMonetary(value: number | string): string {
  const valueValid = value || 0;

  return valueValid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
