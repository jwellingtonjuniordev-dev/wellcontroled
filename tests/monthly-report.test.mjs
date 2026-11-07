import test from "node:test";
import assert from "node:assert/strict";
import { calculateMonthlyHistory, totalMonthlyHistory } from "../lib/monthly-report.ts";

const entry = (date, type, category, amount) => ({
  id: Math.random().toString(36).slice(2), title: "Teste", date, type, category, amount,
});

test("always returns 12 rolling months, including empty months and a year boundary", () => {
  const history = calculateMonthlyHistory([], new Date(2026, 0, 15));
  assert.equal(history.length, 12);
  assert.equal(history[0].key, "2025-02");
  assert.equal(history[11].key, "2026-01");
  assert.ok(history.every((item) => item.count === 0 && item.balance === 0));
});

test("classifies expenses, investments and savings as distinct outflows", () => {
  const tx = [
    entry("2026-11-02", "income", "Trabalho", 2000),
    entry("2026-11-04", "expense", "Alimentação", 300),
    entry("2026-11-05", "expense", "Investimentos", 400),
    entry("2026-11-06", "expense", "Poupança", 200),
    entry("2026-11-07", "income", "Investimentos", 50),
  ];
  const m = calculateMonthlyHistory(tx, new Date(2026, 10, 10)).at(-1);
  assert.equal(m.income, 2050);
  assert.equal(m.expenses, 300);
  assert.equal(m.investments, 400);
  assert.equal(m.savings, 200);
  assert.equal(m.balance, 1150);
  assert.equal(m.count, 5);
});

test("excludes older months, future months and malformed dates", () => {
  const tx = [
    entry("2025-11-30", "income", "Trabalho", 800),
    entry("2025-12-01", "income", "Trabalho", 100),
    entry("2026-12-01", "income", "Trabalho", 500),
    entry("not a date", "income", "Trabalho", 500),
  ];
  const h = calculateMonthlyHistory(tx, new Date(2026, 10, 10));
  assert.equal(h[0].key, "2025-12");
  assert.equal(h[0].income, 100);
  assert.equal(totalMonthlyHistory(h).income, 100);
});

test("negative balances remain negative and decimal amounts are rounded", () => {
  const tx = [
    entry("2026-11-05", "income", "Trabalho", 0.1),
    entry("2026-11-05", "expense", "Transportes", 0.2),
    entry("2026-11-05", "expense", "Outros", 0.1),
  ];
  const m = calculateMonthlyHistory(tx, new Date(2026, 10, 10)).at(-1);
  assert.equal(m.balance, -0.2);
});

test("does not mutate the original transaction collection", () => {
  const tx = Object.freeze([Object.freeze(entry("2026-11-05", "income", "Trabalho", 20))]);
  calculateMonthlyHistory(tx, new Date(2026, 10, 10));
  assert.equal(tx.length, 1);
});
