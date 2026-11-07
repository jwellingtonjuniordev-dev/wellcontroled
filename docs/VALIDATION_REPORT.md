# Relatório de validação — WellControled

Data: 2026-11-07  
Ambiente: Supabase dedicado `gxtsnmdrohaehssigmfk`, Vercel produção.

## Resultados confirmados

| Área | Resultado | Método |
| --- | --- | --- |
| Build de produção | PASSOU | Deployment Vercel `dpl_6fj7pgVre7FNK3A1UR8WkcQ8P3Vf` em estado READY |
| Registo e login | REPORTADO COMO FUNCIONAL | Teste manual do proprietário; não foi reproduzido automaticamente |
| RLS | PASSOU | `pg_class.relrowsecurity=true`; quatro políticas para INSERT/SELECT/UPDATE/DELETE |
| CRUD autorizado | PASSOU | Simulação de role `authenticated` com claim do utilizador real; INSERT, SELECT, UPDATE, DELETE em transação revertida |
| Isolamento de acesso | PASSOU | Segunda identidade simulada: SELECT sem dados; UPDATE e DELETE com 0 linhas; INSERT para outro `user_id` recusado por RLS |
| Integridade dos dados | PASSOU | Testes encapsulados por BEGIN/ROLLBACK; total confirmado em 2 transações após testes |
| Auditoria de segurança | AVISO | Leaked Password Protection do Supabase Auth desativada |
| Sessão após refresh | PASSOU (teste manual reportado) | O proprietário confirmou que a sessão permanece após F5 |
| Sessão após fechar/reabrir navegador | PASSOU (teste manual reportado) | O proprietário confirmou persistência após reabrir |
| Logout e navegação protegida | PASSOU (teste manual reportado) | Depois do logout, o dashboard deixa de ser apresentado |
| Persistência de transações após refresh | PASSOU (teste manual reportado) | O proprietário confirmou que os registos permanecem após F5 |
| Teste E2E com duas contas | PENDENTE | As regras RLS foram testadas com identidades simuladas, não com dois utilizadores autenticados via cliente |
| Toast em 5 segundos | REVISÃO DE CÓDIGO | `components/Toast.tsx` usa `setTimeout(onDismiss, 5000)`; falta teste de interface |
| Compilação remota com TypeScript | PASSOU | Registos de compilação da Vercel |

## Como foram feitos os testes de segurança SQL

As consultas foram executadas com `SET LOCAL ROLE authenticated` e valores de `request.jwt.claim.sub` configurados apenas para a transação. Foi usada uma identidade existente como proprietária e outra identidade simulada como atacante. Foram verificadas as quatro operações CRUD e todas as alterações da experiência foram revertidas por `ROLLBACK`. Estes testes exercitam as políticas PostgreSQL; **não validam JWTs reais nem a camada de cliente**.

## Revisão da implementação

- O frontend chama `supabase.auth.getUser()` ao carregar e subscreve `onAuthStateChange`.
- O helper `@supabase/ssr` utiliza cookies e o proxy chama `auth.getClaims()` para o refresh.
- A rota principal `/` é uma Client Component; a escolha entre login e dashboard acontece no browser. A segurança dos dados depende das políticas RLS, não apenas da interface.
- O código tem modo demonstração quando as variáveis Supabase não estão configuradas; **confirmar sempre ambas as variáveis nos ambientes públicos**.
- A verificação de `getClaims()` é atualmente aplicada a caminhos que começam por `/dashboard`; como o dashboard efetivo está na rota `/`, a proteção de navegação no servidor não equivale a um bloqueio de todos os caminhos da interface. Priorizar uma rota separada protegida no servidor antes de guardar dados sensíveis.

## Próximos testes manuais

1. Entrar numa janela normal; atualizar a página e confirmar manutenção da sessão.
2. Fechar e reabrir o navegador; confirmar comportamento esperado do "manter sessão".
3. Criar uma receita e uma despesa de teste; atualizar e confirmar que persistem.
4. Eliminar uma transação de teste; atualizar e confirmar que desapareceu.
5. Fazer logout; recarregar a aplicação e confirmar que é apresentado o login.
6. Registar uma segunda conta de teste. Confirmar que não vê transações da primeira.
7. Testar mensagens de sucesso/erro, visibilidade, acessibilidade e fecho aos 5 segundos.

## Segurança pendente

Ativar a proteção de senhas comprometidas em Supabase Auth: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

Até à conclusão dos testes E2E, utilizar dados fictícios e não colocar dados financeiros sensíveis na aplicação.

## Revisão complementar (2026-11-07)

Os quatro testes funcionais (F5, reabrir o navegador, persistência das transações e logout) foram reportados como **PASSOU** pelo proprietário. São evidências de execução manual; não são testes automatizados nem garantem o mesmo comportamento em todos os navegadores.

Foi encontrado um risco de configuração independente desses resultados: quando faltam as variáveis públicas do Supabase, a aplicação antiga entra no modo de demonstração mesmo em produção. A branch `fix/prod-auth-fail-closed` altera a renderização de produção para mostrar uma mensagem de indisponibilidade nesse caso. O ambiente de desenvolvimento continua a permitir a demonstração local. **A alteração exige compilação e verificação em Preview antes de merge.**

O projeto continua a utilizar a rota principal `/` para login e dashboard no cliente. A UI oculta o dashboard sem sessão; o isolamento dos registos financeiros é garantido pelo RLS na base de dados. Uma futura evolução pode criar rotas de dashboard autenticadas no servidor.

**Pendente:** testar duas contas reais, verificar o tempo de 5 s das notificações na UI e ativar a verificação de senhas comprometidas no Supabase Auth.
