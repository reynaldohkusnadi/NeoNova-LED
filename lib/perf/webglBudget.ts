export interface BudgetReport {
  totalBytes: number;
  budgetBytes: number;
  withinBudget: boolean;
}

export function reportWebglBudget(
  totalBytes: number,
  budgetBytes = 1_200_000,
): BudgetReport {
  const withinBudget = totalBytes <= budgetBytes;
  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[3D Budget] total ${(totalBytes / 1_000_000).toFixed(2)} MB / budget ${(
        budgetBytes / 1_000_000
      ).toFixed(2)} MB → ${withinBudget ? "OK" : "EXCEEDED"}`,
    );
  }
  return { totalBytes, budgetBytes, withinBudget };
}
