# Relatórios mensais — WellControled

## Visão geral

A aplicação apresenta:
- um resumo do mês atual no **Dashboard**;
- a vista **Relatórios** com os últimos **12 meses móveis** (incluindo o mês atual);
- gráfico comparativo de receitas, despesas, investimentos e poupança;
- tabela de evolução mensal, incluindo meses sem lançamentos;
- saldo líquido do período e totais dos 12 meses.

As informações são calculadas no cliente a partir das transações do utilizador autenticado que o Supabase permite ler por Row Level Security (RLS). Não foi adicionada nenhuma tabela: os dados permanecem em `public.transactions`.

## Classificação de lançamentos

| Tipo | Categoria | Destino no relatório |
| --- | --- | --- |
| `income` | Qualquer | Receitas |
| `expense` | `Investimentos` | Investimentos |
| `expense` | `Poupança` | Poupança |
| `expense` | Outras categorias | Despesas |

Categorias são comparadas sem distinguir maiúsculas e minúsculas. Investimentos/poupança são transferências ou aportes registados como saídas; não representam rendimento, valorização ou património. Quando um utilizador lança um investimento como despesa normal, este será contabilizado em despesas até alterar a categoria.

**Saldo do mês = receitas − despesas − investimentos − poupança**. O saldo não representa necessariamente o saldo bancário, porque não existe integração bancária nem controlo de saldos iniciais.

No gráfico de seis meses do Dashboard, a série de saídas totais soma despesas, investimentos e poupança para permitir a comparação com receitas.

## Janela temporal

- Os 12 meses terminam no mês atual; por exemplo, em novembro de 2026 o período vai de dezembro de 2025 a novembro de 2026.
- Meses sem transações são mostrados a zero, em vez de ficarem ocultos.
- Transações mais antigas continuam na base de dados, mas não aparecem na janela móvel.
- A data do lançamento é usada no formato ISO `YYYY-MM-DD` e o mês é derivado dos primeiros sete caracteres, evitando deslocamentos de dia por fuso horário.
- Valores em euros (`pt-PT`) com duas casas decimais.

## Limitações e melhorias futuras

1. O relatório assume que todas as transações necessárias foram carregadas. Atualmente a aplicação faz uma consulta à tabela inteira do utilizador; quando houver paginação, usar uma consulta separada para a janela anual ou agregação no servidor para evitar relatórios incompletos.
2. Não há cálculo de rendimento sobre investimentos, juros, transferências entre contas ou ajuste do saldo inicial.
3. O histórico é móvel de 12 meses, não exportação de anos civis arbitrários.
4. Não é feita classificação automática por IA: a categoria selecionada ao registar a transação determina o indicador.
5. Falta validar visualmente o relatório com contas reais em diferentes resoluções.

## Plano de testes

1. Registar receita, despesa, investimento e poupança no mesmo mês; verificar os quatro indicadores e o saldo calculado.
2. Registar transações em dezembro e janeiro; garantir que o agrupamento respeita a passagem de ano.
3. Testar sem transações e confirmar 12 meses com zero.
4. Eliminar um lançamento e confirmar que os números e gráfico mudam sem refresh.
5. Criar lançamentos fora dos últimos 12 meses e confirmar que não aparecem.
6. Em duas contas, garantir que relatórios apenas incluem transações próprias (RLS).
7. Testar modos claro/escuro, tamanhos mobile/desktop e navegação pelo teclado.

## Ficheiros

- `lib/monthly-report.ts` — agregação pura do histórico e totais.
- `components/MonthlyReport.tsx` — resumo mensal, gráfico e tabela.
- `components/FinanceChart.tsx` — evolução dos últimos 6 meses baseada nas transações.
- `components/Dashboard.tsx` — integração do relatório no menu e no dashboard.
- `app/globals.css` — layout responsivo e estilos dos relatórios.
