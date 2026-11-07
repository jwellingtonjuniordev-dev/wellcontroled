"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, ChartNoAxesCombined, PiggyBank, TrendingUp } from "lucide-react";
import type { Transaction } from "@/lib/data";
import { money } from "@/lib/data";
import { calculateMonthlyHistory, totalMonthlyHistory } from "@/lib/monthly-report";

type Props = {
  transactions: Transaction[];
  compact?: boolean;
  onOpenHistory?: () => void;
};

const categories = [
  { key: "income", label: "Receitas", color: "var(--primary)", icon: ArrowUpRight },
  { key: "expenses", label: "Despesas", color: "#f43f5e", icon: ArrowDownRight },
  { key: "investments", label: "Investimentos", color: "#818cf8", icon: TrendingUp },
  { key: "savings", label: "Poupança", color: "#06b6d4", icon: PiggyBank },
] as const;

export function MonthlyReport({ transactions, compact = false, onOpenHistory }: Props) {
  const months = useMemo(() => calculateMonthlyHistory(transactions), [transactions]);
  const current = months[months.length - 1];
  const year = useMemo(() => totalMonthlyHistory(months), [months]);
  const max = Math.max(1, ...months.flatMap((m) => categories.map(({key}) => m[key])));
  const values = compact ? current : year;
  return (
    <section className="monthly-report panel" aria-labelledby={compact ? "monthly-title-compact" : "monthly-title"}>
      <div className="monthly-heading">
        <div>
          <p className="eyebrow">{compact ? "ESTE MÊS" : "HISTÓRICO FINANCEIRO"}</p>
          <h2 id={compact ? "monthly-title-compact" : "monthly-title"}>
            {compact ? `Resumo de ${current.label}` : "Os últimos 12 meses"}
          </h2>
          <p className="monthly-subtitle">
            {compact ? "Movimentos registados no mês atual." : "De mês a mês, com base nas transações registadas."}
          </p>
        </div>
        {compact && onOpenHistory && (
          <button type="button" className="view-all" onClick={onOpenHistory}>
            Ver histórico de 1 ano →
          </button>
        )}
      </div>
      <div className="monthly-metrics">
        {categories.map(({key,label,color,icon: Icon}) => (
          <article key={key} className="monthly-metric">
            <div className="monthly-metric-label"><Icon size={17} style={{ color }}/>{label}</div>
            <strong>{money(values[key])}</strong>
          </article>
        ))}
      </div>
      <div className="monthly-balance">
        <span>{compact ? "Saldo do mês" : "Saldo acumulado dos últimos 12 meses"}</span>
        <strong className={values.balance < 0 ? "monthly-negative" : "monthly-positive"}>{money(values.balance)}</strong>
      </div>
      {!compact && (
        <>
          <div className="monthly-legend" aria-label="Legenda do gráfico">
            {categories.map(({key,label,color})=><span key={key}><i style={{backgroundColor:color}}/>{label}</span>)}
          </div>
          <div className="monthly-plot" role="img" aria-label="Gráfico comparativo das receitas, despesas, investimentos e poupança nos últimos doze meses">
            {months.map((month) => (
              <div className="monthly-plot-month" key={month.key} title={`${month.label}: receitas ${money(month.income)}, despesas ${money(month.expenses)}, investimentos ${money(month.investments)}, poupança ${money(month.savings)}`}>
                <div className="monthly-bars">
                  {categories.map(({key,color}) => <span key={key} style={{ height: month[key] === 0 ? "2px" : `${Math.max(4, month[key] / max * 100)}%`, backgroundColor: color }} />)}
                </div>
                <span className="monthly-month-label">{month.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
          <div className="monthly-history-scroll">
            <table className="monthly-history-table">
              <caption>Resumo das transações por mês, do mais recente ao mais antigo</caption>
              <thead><tr><th>Mês</th><th>Receitas</th><th>Despesas</th><th>Investimentos</th><th>Poupança</th><th>Saldo</th></tr></thead>
              <tbody>
                {[...months].reverse().map((month) => (
                  <tr key={month.key}>
                    <th scope="row">{month.label}{month.count===0 ? " — sem registos" : ""}</th>
                    <td>{money(month.income)}</td>
                    <td>{money(month.expenses)}</td>
                    <td>{money(month.investments)}</td>
                    <td>{money(month.savings)}</td>
                    <td className={month.balance < 0 ? "monthly-negative" : "monthly-positive"}>{money(month.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="monthly-explanation">
            Investimentos e poupança são saídas registadas nas respetivas categorias, separadas das despesas habituais.
            Saldo = receitas − despesas − investimentos − poupança. Não representa valorização de investimentos nem saldo bancário.
            Meses sem movimentos aparecem com zero; o histórico apresenta os últimos 12 meses, incluindo o atual.
          </p>
        </>
      )}
    </section>
  );
}
