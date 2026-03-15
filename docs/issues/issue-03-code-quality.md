# Issue #3: Melhorias de Código - Refatoração e Validação

## Descrição
Refatorar o código para eliminar duplicidade e melhorar a robustez através de validações de entrada mais rigorosas no `Controller` e no `View`.

## Tarefas
- [ ] Criar branch `refactor/validation-and-cleanup`
- [ ] Melhorar `handleAddTask` no `Controller` com validações de tamanho e conteúdo
- [ ] Refatorar a extração de dados do formulário no `View`
- [ ] Adicionar tratamento básico de strings (trimming) para evitar tarefas vazias ou com espaços
- [ ] Garantir que o `id` gerado seja único e consistente

## Critérios de Aceite
- Não é possível adicionar tarefas apenas com espaços em branco.
- O código de renderização e manipulação está mais limpo e legível.
- Todos os testes unitários de integração continuam passando.
