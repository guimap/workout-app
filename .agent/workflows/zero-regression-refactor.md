---
description: Zero-regression refactor workflow for Angular component isolation
---

# Zero-Regression Refactor Workflow

**Persona:** QA Engineer + Frontend Engineer sênior (Angular)  
**Objetivo:** Reestruturar projeto sem alterar UI ou funcionalidades

---

## Fase 1 — Baseline (Antes de Mover)

1. Rodar aplicação e navegar por todas as jornadas
2. Para cada tela/estado:
   - Tirar prints e salvar em `/docs/regression/baseline/`
   - Documentar em `/docs/regression/journeys.md`

### Jornadas Obrigatórias
- **J1** — Tela inicial (elementos, estados)
- **J2** — Iniciar treino (botão, transição)
- **J3** — Interação com items (layout, tipografia)
- **J4** — Editar carga (input, popup)
- **J5** — Check/Finalizar (checkbox, persistência)
- **J6** — Persistência (reload)
- **J7** — Erro/Loading (spinner, mensagens)

---

## Fase 2 — Refactor Incremental

### Estrutura Alvo
```
src/app/
├── components/   # UI reutilizável
├── pages/        # Telas (smart components)
├── services/     # Orquestração + parse DTO
└── repository/   # HTTP + localStorage
```

### Regras
1. Mover 1 componente por vez
2. Ajustar imports/rotas imediatamente
3. Validar jornada afetada antes de prosseguir
4. Services não fazem HTTP direto
5. Repository não tem regra de UI

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

1. Repetir todas as jornadas (J1–J7)
2. Salvar prints em `/docs/regression/after/`
3. Gerar `/docs/regression/report.md` com comparação
4. Aprovação: "zero impacto"

---

## Comandos Úteis

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
- [ ] Todas as jornadas com evidências baseline/after
- [ ] Relatório final aprovado
