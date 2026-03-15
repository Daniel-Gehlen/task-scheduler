# Issue #2: Melhorias no Banco de Dados - Otimização e Cache

## Descrição
Melhorar a performance da camada de persistência (`localStorage`). Atualmente, o `TaskModel` lê do `localStorage` repetidamente. Vamos implementar um cache em memória e garantir que as operações de escrita sejam atômicas e eficientes.

## Tarefas
- [ ] Criar branch `perf/localstorage-optimization`
- [ ] Implementar cache de tarefas no `TaskModel` (Singleton pattern já existente)
- [ ] Otimizar métodos `addTask`, `deleteTask` e `updateTask` para usar o cache
- [ ] Verificar se as consultas (queries) podem ser otimizadas

## Critérios de Aceite
- `localStorage` é acessado apenas quando necessário (inicialização e escritas).
- Todos os testes unitários continuam passando.
- Código sem redundância de `JSON.parse`.
