# WellControled 💚

**Planeie · Controle · Realize** — plataforma de gestão financeira pessoal.

## Funcionalidades
- Interface de login e dashboard responsivo em Light/Dark Mode
- **Supabase Auth** com sessão persistente em cookies quando configurado
- **PostgreSQL** com Row Level Security por utilizador
- Criar, consultar e eliminar transações; estatísticas automáticas
- Notificações (toasts) que desaparecem após **5 segundos**, com botão para fechar
- Modo demonstração local sem ligação ao banco (não usar com dados sensíveis)

## Instalação
```bash
npm ci
cp .env.example .env.local
npm run dev
```
Edite `.env.local` com URL e **publishable key** do seu projeto Supabase próprio; sem as variáveis, o app fica em modo demonstração. Não coloque chaves secretas no frontend.

## Base de dados
Execute o script em `supabase/migrations/20261107120000_initial_schema.sql` no projeto Supabase exclusivo WellControled. Confirme que RLS está ativa.

## Qualidade
```bash
npm run typecheck
npm run build
```

## Documentação
- [Segurança](docs/SECURITY.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Plano de testes](docs/TESTING.md)
- [Deploy](docs/DEPLOYMENT.md)
- [Roadmap](ROADMAP.md)

## Estado
Versão v0.2 preparada para integração. A autenticação real e persistência PostgreSQL necessitam de credenciais e migração aplicadas num projeto Supabase dedicado. Deploy de produção apenas após testes de integração.


## Projeto Supabase provisionado
A base PostgreSQL já foi criada no projeto dedicado WellControled e a migração de `transactions` aplicada. Consulte [Integração Supabase](docs/SUPABASE_INTEGRATION.md) para a configuração necessária e os resultados de verificação. **O frontend requer uma publishable key configurada para usar a autenticação real.**
