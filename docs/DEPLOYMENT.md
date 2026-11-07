# Deploy (Vercel + Supabase)

1. Projeto **WellControled** já criado em `eu-west-1` (ref `gxtsnmdrohaehssigmfk`).
2. Migração `initial_transactions_rls` já aplicada com sucesso. Não executar de novo sem rever o estado do banco.
3. Validar em duas contas: utilizador A não pode ler/alterar transações de B.
4. Definir no projeto Vercel as duas variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Em Supabase Auth configurar **Site URL** e URLs de redirecionamento para o domínio de produção.
6. Instalar dependências (`npm ci`), validar tipos (`npx tsc --noEmit`) e compilar (`npm run build`).
7. Fazer deploy de preview; testar login, confirmação de e-mail, CRUD, logout e refresh; só então promover produção.
8. Usar HTTPS e rever logs/alertas após publicação.

Não configurar o projeto de outro produto: cada aplicação deve ter base de dados e Auth próprios.
