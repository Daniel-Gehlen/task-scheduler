# Issue #4: Melhorias de Infraestrutura - Logs e Erros Globais

## Descrição
Implementar uma infraestrutura de monitoramento e resiliência básica. Isso inclui um logger estruturado para substituir o `console.log` disperso e um tratador de erros global para capturar falhas inesperadas na aplicação.

## Tarefas
- [ ] Criar branch `feat/logs-and-errors`
- [ ] Criar utilitário de log estruturado (`src/js/utils/logger.js`)
- [ ] Implementar `ErrorHandler` global no `app.js`
- [ ] Substituir `alert()` genéricos por logs estruturados (onde apropriado)
- [ ] Adicionar blocos `try-catch` em operações críticas do `Model` (ex: `localStorage` cheio)

## Critérios de Aceite
- Mensagens de erro são capturadas e logadas com contexto (timestamp, tipo).
- A aplicação não trava silenciosamente em caso de erro no `localStorage`.
- Logs seguem um padrão consistente.
