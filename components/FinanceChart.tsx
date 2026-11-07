"use client";
import { useMemo } from "react";
import type { Transaction } from "@/lib/data";
import { money } from "@/lib/data";
import { calculateMonthlyHistory } from "@/lib/monthly-report";

export function FinanceChart({ transactions }: { transactions: Transaction[] }) {
  const months = useMemo(() => calculateMonthlyHistory(transactions).slice(-6), [transactions]);
  const max = Math.max(1, ...months.flatMap(({ income, expenses, investments, savings }) => [income, expenses + investments + savings]));
  const x = (index: number) => 42 + index * 78;
  const y = (amount: number) => 190 - (amount / max) * 140;
  const receivables = months.map((m, i) => `${x(i)},${y(m.income)}`).join(" ");
  const outflows = months.map((m, i) => `${x(i)},${y(m.expenses + m.investments + m.savings)}`).join(" ");
  return (
    <div className="chart-wrap">
      <div className="chart-header">
        <h3>Evolução financeira</h3>
        <div className="chart-legend">
          <span><i className="dot green"/>Receitas</span>
          <span><i className="dot red"/>Saídas totais</span>
        </div>
      </div>
      <svg viewBox="0 0 475 230" role="img" aria-label="Evolução das receitas e das saídas totais nos últimos seis meses, com base nas transações registadas">
        <g className="chart-grid">{[50,85,120,155,190].map(pos => <line key={pos} x1="34" x2="448" y1={pos} y2={pos}/>)}</g>
        <polyline points={receivables} stroke="#10b981"/>
        <polyline points={outflows} stroke="#f43f5e"/>
        {months.map((month, i) => <g key={month.key}>
          <circle cx={x(i)} cy={y(month.income)} r="3.8" stroke="#10b981"><title>{`${month.label}: receitas ${money(month.income)}`}</title></circle>
          <circle cx={x(i)} cy={y(month.expenses + month.investments + month.savings)} r="3.8" stroke="#f43f5e"><title>{`${month.label}: saídas ${money(month.expenses + month.investments + month.savings)}`}</title></circle>
        </g>)}
        <g className="axis-labels">{months.map((month,i) => <text key={month.key} x={x(i)} y="222" textAnchor="middle">{month.label.split(" ")[0]}</text>)}</g>
      </svg>
      <p className="chart-note">Últimos 6 meses · As saídas incluem despesas, investimentos e poupança.</p>
    </div>
  );
}
