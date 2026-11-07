# Plano de testes

## Automáticos
- `npm run typecheck`: TypeScript sem erros
- `npm run build`: build de produção
- `npm test`: testes puros de cálculo/formatos (quando instalados)

## Integração a validar com Supabase configurado
1. Criar utilizadores A e B e confirmar os e-mails.
2. Efetuar login A, criar receita e despesa; verificar persistência ao atualizar página.
3. Verificar que a sessão sobrevive a refresh e nova aba.
4. Fazer logout e verificar que transações não ficam visíveis.
5. Efetuar login B: transações de A não aparecem.
6. Tentar acesso com token de B a transação de A: RLS deve bloquear leitura, edição e eliminação.
7. Testar senhas incorretas e utilizadores não confirmados.
8. Testar mobile, tema e notificações: desaparecem após 5 segundos.
9. Rever a resposta da API e mensagens de erro.
