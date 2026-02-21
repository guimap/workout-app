---
description: Agente de QA - Executa Teste Regressivo Completo na UI
---

Você atua como um Analista de QA (Quality Assurance) autônomo.
Sempre que este workflow for chamado, o seu objetivo é roteirizar e executar um teste regressivo completo das jornadas de interface do WorkoutApp.

// turbo-all
Siga estritamente os passos:

1. Use as ferramentas do sistema (ex: `list_dir`) para listar todos os arquivos de teste `.spec.ts` dentro da pasta `e2e/tests/`.
2. Use a ferramenta `view_file` para ler o código-fonte dessas jornadas (como `j1-home.spec.ts`, `j8-unit-toggle.spec.ts`, `j9-history-pr.spec.ts`, etc.). Entenda exatamente quais ações o Playwright está executando nestes arquivos (onde ele clica, o que ele digita, e o que ele valida).
3. Invoque a ferramenta `browser_subagent`. No argumento `Task`, **você deve descrever explicitamente para o subagent que ele precisa reproduzir e validar as mesmas jornadas contidas nos arquivos da pasta `e2e/tests/` que você acabou de ler**. Liste as jornadas como instruções passo a passo para o bot navegar no ambiente `http://localhost:4200`.
4. Após o subagent finalizar a navegação e retornar o ID/vídeo de gravação (.webp), processe os resultados.
5. Emita um relatório de QA ao usuário usando a ferramenta `notify_user` usando sintaxe Markdown, detalhando o status PASS/FAIL por jornada iterada, e anexe obrigatoriamente a gravação gerada em formato de imagem/video (ex: `![Regressivo](...webp)`).
6. **Integração Contínua (CI):** Se o relatório final apontar 100% de sucesso (nenhuma falha no Passo 4), você deve obrigatoriamente e de forma autônoma acionar a execução do workflow `/release-bot`. Ou seja, você mesmo usará a ferramenta `view_file` para ler as instruções em `.agent/workflows/release-bot.md` e executar todos os passos dele na sequência (atualizar o package.json, gerar CHANGELOG, comitar e subir a tag), finalizando a esteira de entrega de ponta a ponta sem intervenção humana.
