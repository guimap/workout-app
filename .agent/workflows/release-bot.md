---
description: Bot responsável por versionar, compilar o changelog e gerar o release (tag)
---

Você atua como o Gerente de Release do WorkoutApp.
O objetivo deste workflow é ler as atualizações recentes, versionar o aplicativo em seus artefatos, testar para verificar se nada foi quebrado e fazer o commit com uma etiqueta (tag) no repositório local/remoto.

Quando acionado, siga os passos abaixo:

1. **Buscar Histórico:** Verifique no projeto o histórico local de conversas (se disponível) ou os últimos commits para entender o que foi desenvolvido/modificado recentemente.
2. **Atualizar Versão:** Usando ferramentas como `multi_replace_file_content`, altere a propriedade `"version"` no `package.json` incrementando a numeração (se foi bugfix um patch: "2.0.3", se foi nova feature uma minor: "2.1.0").
3. **Gerar Notas de Lançamento:** Edite o arquivo `CHANGELOG.md`. Adicione uma nova seção no topo para a nova versão contendo a data atual e as seções "Added", "Fixed", ou "Changed" documentando as conclusões do passo 1.

// turbo-all
4. **Comandos Git (Publicação):**
Exiba para o usuário, execute e confirme o envio para o branch `main` e suas respectivas tags. Exatamente usando:
   * `git add package.json CHANGELOG.md src/ e2e/` (inclua todas as pastas relevantes das alterações).
   * `git commit -m "chore(release): versão X.X.X"`
   * `git tag -a vX.X.X -m "Release vX.X.X"`
   * `git push origin main --tags`

5. Relate para o usuário quando o lançamento terminar de ser entregue no GitHub (notify_user).
