# Supabase — integração do WellControled

## Projeto criado em 7 de novembro de 2026
- **Projeto:** wellcontroled
- **Região:** eu-west-1
- **Project ref:** `gxtsnmdrohaehssigmfk`
- **URL:** `https://gxtsnmdrohaehssigmfk.supabase.co`
- **Painel:** https://supabase.com/dashboard/project/gxtsnmdrohaehssigmfk
- **Preço indicado na criação:** 0 por mês (ver limites e faturação no Supabase)

## Migração aplicada
A migração `initial_transactions_rls` foi aplicada remotamente com sucesso. O SQL correspondente encontra-se em `supabase/migrations/20261107120000_initial_schema.sql`.

A tabela `public.transactions` tem: `id`, `user_id`, `title`, `category`, `date`, `amount`, `type`, `created_at` e `updated_at`. A coluna `user_id` referencia `auth.users(id)` com remoção em cascata.

As quatro políticas RLS limitam SELECT/INSERT/UPDATE/DELETE às linhas cujo `user_id` coincide com `auth.uid()`. A role `anon` não tem privilégio SELECT nesta tabela.

## Verificação executada no projeto real
- Tabela `transactions`: **encontrada**.
- RLS: **ativo**.
- Políticas RLS: **4**.
- `anon` tem SELECT: **false**.
- `authenticated` tem SELECT: **true**, sujeito a RLS.
- Supabase Security Advisors: **nenhuma ocorrência**.
- Performance Advisors: índice `transactions_user_date_idx` ainda não utilizado (normal antes do tráfego).

Estes testes verificam metadados de segurança. **Não substituem um teste E2E com duas contas reais**.

## Ligar o frontend
1. Copiar `.env.example` para `.env.local`.
2. Obter a chave **publishable** no painel Supabase, em Settings → API Keys.
3. Inserir a chave em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no ficheiro `.env.local`; **não a publicar no GitHub**.
4. Configurar no Supabase Auth a Site URL do domínio de produção e URLs adicionais para localhost / previews.
5. Executar `npm install`, `npm run typecheck` e `npm run build`.
6. Testar registo, confirmação de e-mail, login, refresh, logout, criação e exclusão de transações e segregação de dados em duas contas.
7. Configurar as mesmas duas variáveis de ambiente na Vercel para o deploy.

## Limitações
Não foi concluída a instalação das dependências no ambiente de preparação, pelo que os testes de TypeScript/Next.js e navegação não foram executados. O GitHub estava vazio no momento da preparação e a produção não foi publicada.
