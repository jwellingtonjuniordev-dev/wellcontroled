# Segurança e acesso

## Estado
A aplicação utiliza Supabase Auth com sessões em cookies via `@supabase/ssr` quando são configuradas as duas variáveis de ambiente. Sem configuração, apresenta modo de demonstração claramente identificado, sem autenticação real.

## Autenticação
- E-mail/senha; registo com confirmação de e-mail conforme configuração do projeto Supabase.
- Sessões persistentes entre visitas ao navegador por cookies geridos pelo Supabase SSR.
- O `proxy.ts` renova tokens utilizando `getClaims()` (não confia em `getSession()` no servidor).
- Terminar sessão invoca `signOut()` e limpa os dados do estado local.

## Autorização
- RLS por `user_id = auth.uid()` em todas as operações SELECT, INSERT, UPDATE, DELETE.
- O campo `user_id` não é aceite como prova de posse: o banco valida o utilizador autenticado.
- Nunca colocar chaves secretas ou `service_role` no browser.

## Limitações e testes necessários
- Verificar confirmação de e-mail, limitação de tentativas, recuperação de senha, refresh, isolamento A/B e expiração de sessão num projeto Supabase real.
- Não inserir dados financeiros sensíveis no modo demo; a demo guarda entradas no navegador.
- Para produção, reforçar autenticação com MFA, auditoria, alertas e monitorização.
- O saldo é calculado a partir das transações devolvidas por RLS.
