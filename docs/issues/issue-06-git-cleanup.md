# Issue #6: Limpeza do Repositório Git - .gitignore e Remoção de node_modules

## Descrição
O repositório contém atualmente arquivos que não deveriam ser rastreados pelo Git, como a pasta `node_modules`. É necessário criar um arquivo `.gitignore`, remover esses arquivos do índice do Git (mantendo-os localmente) e limpar o histórico.

## Tarefas
- [ ] Criar branch `fix/git-cleanup`
- [ ] Criar arquivo `.gitignore` com padrões comuns (node_modules, logs, build)
- [ ] Remover `node_modules` do rastreamento do Git (`git rm -r --cached`)
- [ ] Remover outros arquivos desnecessários (ex: logs de teste)

## Critérios de Aceite
- `node_modules` não aparece mais no `git ls-files`.
- O arquivo `.gitignore` está presente e configurado corretamente.
- O repositório contém apenas código-fonte e documentação necessária.
