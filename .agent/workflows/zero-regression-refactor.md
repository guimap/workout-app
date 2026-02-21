---
description: Zero-regression refactor workflow for Angular component isolation
---

# Zero-Regression Refactor Workflow

**Persona:** QA Engineer + Frontend Engineer sênior (Angular)  
**Objetivo:** Reestruturar projeto sem alterar UI ou funcionalidades

---

## ⚠️ REGRA OBRIGATÓRIA

> **Após QUALQUER alteração de código, você DEVE executar os testes de jornada para garantir zero regressão.**

### Verificação Rápida (Requerida)

// turbo-all
```bash
# Antes de finalizar qualquer tarefa, execute:
npm run e2e -- --project=chromium
```

Se não houver Playwright configurado, use verificação manual via browser:
1. Navegar pelas jornadas J1-J6
2. Capturar screenshots
3. Comparar com baseline

---

## Fase 1 — Baseline (Antes de Mover)

1. Rodar aplicação e navegar por todas as jornadas
2. Para cada tela/estado:
   - Tirar prints e salvar em `/docs/regression/baseline/`
   - Documentar em `/docs/regression/journeys.md`

### Jornadas Obrigatórias
- **J1** — Tela inicial (elementos, estados)
- **J2** — Detalhe do treino (header, exercícios)
- **J3** — Treino ativo (timer, checkboxes)
- **J4** — Editar carga (input, popup)
- **J5** — Check/Completar (checkbox, progresso)
- **J6** — Persistência (reload preserva estado)
- **J7** — Erro/Loading (spinner, mensagens)

---

## Fase 2 — Refactor Incremental

### Estrutura Alvo
```
src/app/
├── components/   # UI reutilizável (dumb)
├── pages/        # Telas (smart components)
├── services/     # Orquestração + lógica de negócio
├── repository/   # HTTP + localStorage
├── business/     # Regras de negócio puras
└── models/       # Tipos e interfaces
```

### Regras
1. Mover 1 componente por vez
2. Ajustar imports/rotas imediatamente
3. **Validar jornada afetada antes de prosseguir**
4. Services não fazem HTTP direto → usar Repository
5. Repository não tem regra de UI

### Checklist por Alteração
- [ ] Código alterado compila sem erros (`ng build`)
- [ ] Jornadas afetadas testadas
- [ ] Screenshot comparado com baseline
- [ ] Zero divergências visuais

---

## Fase 3 — CSS/Styleguide

Ao mover componentes:
1. Mover CSS junto
2. Verificar ViewEncapsulation
3. Atualizar seletores dependentes da hierarquia DOM
4. Preferir classes BEM (`.component__element`)
5. Validar: espaçamentos, fontes, estados hover/disabled

---

## Fase 4 — Pós-Refactor

1. Executar suite E2E completa:
   ```bash
   npm run e2e
   ```
2. Repetir todas as jornadas manualmente (J1–J7)
3. Salvar prints em `/docs/regression/after/`
4. Gerar `/docs/regression/report.md` com comparação
5. Aprovação: "zero impacto"

---

## Comandos E2E

```bash
# Executar todos os testes
npm run e2e

# Executar com UI interativa
npm run e2e:ui

# Executar teste específico
npx playwright test j1-home.spec.ts

# Debug mode
npm run e2e:debug

# Gerar relatório
npm run e2e:report
```

---

## Comandos Angular

```bash
# Gerar componente standalone
ng g component components/nome --standalone

# Gerar página
ng g component pages/nome --standalone

# Gerar service
ng g service services/nome

# Gerar repository
ng g service repository/nome --skip-tests
```

---

## Critérios de Aceite

- [ ] UI idêntica (layout, tipografia, cores)
- [ ] Funcionalidades idênticas (fluxos, persistência)
- [ ] Sem erros no console
- [ ] **Testes E2E passando (J1-J6)**
- [ ] Todas as jornadas com evidências baseline/after
- [ ] Relatório final aprovado

---

## Documentação Relacionada

- `/docs/regression/journeys.md` - Jornadas de referência
- `/docs/regression/report.md` - Relatório de regressão
- `/docs/e2e/README.md` - Documentação dos testes E2E
- `/e2e/tests/` - Arquivos de teste Playwright
