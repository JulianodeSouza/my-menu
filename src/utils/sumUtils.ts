export function calculateValuesByMeasuredUnits(
  amount: number,
  totalCaught: number,
  measuredUnit: string
): number {
  let sum = 0;

  switch (measuredUnit) {
    case "g":
      sum = amount * (totalCaught / 1000);
      break;
    case "un":
    case "kg":
      sum = amount * totalCaught;
      break;
  }

  return sum;
}
