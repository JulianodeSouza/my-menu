import { IListPurchaseView } from "~/types/shopList";

export function calculateValuesByMeasuredUnits(
  amount: number,
  quantity: number,
  measuredUnit?: string
): number {
  const safeAmount = Number(amount) || 0;
  const safeQuantity = Number(quantity) || 0;
  const normalizedUnit = measuredUnit?.trim().toLowerCase() ?? "";

  switch (normalizedUnit) {
    case "ml":
    case "g":
      return safeAmount * (safeQuantity / 1000);
    case "un":
    case "pc":
    case "dz":
    case "l":
    case "kg":
    default:
      return safeAmount * safeQuantity;
  }
}

export function calculateProgress(list: IListPurchaseView[]) {
  let totalProgress = 0;
  const totalItems = getLengthTotalOfList(list);
  const totalMarked = getTotalMarkedItems(list);

  totalProgress = (totalMarked / totalItems) * 100;

  return parseFloat(totalProgress.toFixed(0));
}

export function getTotalMarkedItems(list: IListPurchaseView[]): number {
  const totalMarked = list.reduce((acc, category) => {
    const markedItems = category.items.filter((item) => item.checked).length;
    return acc + markedItems;
  }, 0);

  return totalMarked;
}

export function getLengthTotalOfList(list: IListPurchaseView[]): number {
  const totalItems = list.reduce((acc, category) => {
    return acc + category.items.length;
  }, 0);

  return totalItems;
}
