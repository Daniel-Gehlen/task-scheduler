# Issue #1: Preparação - Estrutura de Testes e Ferramentas de Qualidade

## Descrição
Configurar o ambiente inicial de desenvolvimento com ferramentas de linting, formatação e testes automatizados (Jest). Estabelecer uma linha de base de testes para o `TaskModel` existente antes de prosseguir com melhorias.

## Tarefas
- [ ] Inicializar `package.json`
- [ ] Configurar ESLint e Prettier
- [ ] Configurar Jest com suporte a módulos ES6 (Babel)
- [ ] Implementar testes unitários para `src/js/model.js`

## Critérios de Aceite
- `npm run lint` executa sem erros.
- `npm test` executa e passa para as funcionalidades atuais do Model.
- Formatação de código consistente aplicada via Prettier.
