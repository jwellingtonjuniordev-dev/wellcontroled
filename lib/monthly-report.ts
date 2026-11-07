import type { Transaction } from "./data";

export type MonthlySummary = {
  key: string;
  label: string;
  income: number;
  expenses: number;
  investments: number;
  savings: number;
  balance: number;
  count: number;
};

/**
 * Rolling 12 calendar months, including current month.
 * Savings and investments are explicitly recorded outflows, not inferred returns.
 * Balance = income - ordinary expenses - investment contributions - savings transfers.
 */
export function calculateMonthlyHistory(
  transactions: readonly Transaction[],
  today: Date = new Date(),
): MonthlySummary[] {
  const year = today.getFullYear();
  const month = today.getMonth();
  const months: MonthlySummary[] = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(year, month - (11 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: new Intl.DateTimeFormat("pt-PT", { month: "short", year: "numeric" }).format(date),
      income: 0, expenses: 0, investments: 0, savings: 0, balance: 0, count: 0,
    };
  });
  const byMonth = new Map(months.map((entry) => [entry.key, entry]));
  for (const transaction of transactions) {
    // Only strict ISO calendar dates participate in reporting.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(transaction.date)) continue;
    const summary = byMonth.get(transaction.date.slice(0, 7));
    if (!summary || !Number.isFinite(transaction.amount) || transaction.amount <= 0) continue;
    summary.count += 1;
    if (transaction.type === "income") summary.income += transaction.amount;
    else if (transaction.type === "expense") {
      const category = transaction.category.trim().toLocaleLowerCase("pt-PT");
      if (category === "investimentos" || category === "investimento") summary.investments += transaction.amount;
      else if (category === "poupança" || category === "poupancas" || category === "poupanças" || category === "poupanca") summary.savings += transaction.amount;
      else summary.expenses += transaction.amount;
    }
  }
  for (const item of months) {
    // Avoid accumulation of binary floating-point display errors.
    for (const field of ["income", "expenses", "investments", "savings"] as const) {
      item[field] = Math.round((item[field] + Number.EPSILON) * 100) / 100;
    }
    item.balance = Math.round((item.income - item.expenses - item.investments - item.savings) * 100) / 100;
  }
  return months;
}

export function totalMonthlyHistory(months: readonly MonthlySummary[]) {
  return months.reduce((total, month) => ({
    income: total.income + month.income,
    expenses: total.expenses + month.expenses,
    investments: total.investments + month.investments,
    savings: total.savings + month.savings,
    balance: total.balance + month.balance,
  }), { income: 0, expenses: 0, investments: 0, savings: 0, balance: 0 });
}
