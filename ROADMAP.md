# Roadmap — WellControled

O estado refere-se ao código da versão demonstrativa inicial, e não a uma versão em produção.

| Fase | Entregáveis | Estado |
|---|---|---|
| 1. Interface | Login demonstrativo, dashboard, marca e temas | ✅ Implementado na demo |
| 2. Experiência | Navegação completa, validação de formulários, acessibilidade | ⬜ Planeado |
| 3. Qualidade | Testes unitários, integração, E2E, lint/CI | ⬜ Planeado |
| 4. Dados | Modelação PostgreSQL e migrations | ⬜ Planeado |
| 5. Back-end | API CRUD, autenticação e autorização por utilizador | ⬜ Planeado |
| 6. Gestão financeira | Contas, categorias editáveis, orçamento, metas e recorrência | ⬜ Planeado |
| 7. Analytics | Séries reais, filtros, relatórios e exportação | ⬜ Planeado |
| 8. Deploy | Configuração, observabilidade, backups e monitorização | ⬜ Planeado |

## Próxima sprint sugerida

- [ ] Separar layout público e área autenticada em rotas.
- [ ] Implementar formulário de transações com validação robusta.
- [ ] Permitir editar e eliminar transações demonstrativas.
- [ ] Adicionar estados vazios, carregamento e mensagens de erro.
- [ ] Implementar testes básicos para formatação e cálculos.
- [ ] Preparar entidades `users`, `accounts`, `categories`, `transactions` e `goals`.

## Critérios de conclusão do MVP com dados reais

- Cada utilizador acede apenas aos próprios dados.
- Palavras-passe são tratadas com autenticação segura no servidor.
- Valores monetários usam representação exata no banco de dados.
- As operações CRUD possuem validação e testes.
- Os relatórios derivam dos dados persistidos, não de números ilustrativos.


## Atualização v0.2 (código preparado, integração pendente)
- [x] Código de cliente Supabase Auth e persistência de sessão via cookies SSR
- [x] Script PostgreSQL com Row Level Security por utilizador
- [x] Operações de inserção, leitura e eliminação de transações na interface
- [x] Toasts auto-dismiss em 5 segundos
- [ ] Criar projeto Supabase exclusivo WellControled e aplicar migração
- [ ] Testar duas contas, token refresh e políticas RLS no serviço real
- [ ] Concluir instalação, typecheck, build e testes E2E
- [ ] Ligar GitHub e criar deploy Vercel de produção

## Atualização v0.3 — Relatório financeiro mensal (branch em revisão)
- [x] Resumo do mês atual com receitas, despesas, investimentos e poupança
- [x] Histórico mensal móvel de 12 meses com tabela e gráfico
- [x] Evolução financeira dos últimos seis meses baseada em transações reais
- [x] Categorias Investimentos e Poupança no registo de transações
- [x] Cálculos isolados em `lib/monthly-report.ts` e testes unitários
- [x] CI configurado para executar testes, TypeScript e build
- [ ] Validar interface visual, acessibilidade e testes E2E com dois utilizadores
- [ ] Concluir revisão, merge e deploy de produção

A versão v0.2 já possui PostgreSQL e autenticação no Supabase, e o deploy inicial está operacional. Os quatro testes de persistência e logout passaram manualmente. Ver `docs/VALIDATION_REPORT.md` para distinção entre testes SQL, testes manuais e pendências.
