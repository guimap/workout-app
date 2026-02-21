---
description: Executar testes de jornada após qualquer alteração
---

# Workflow: Testar Jornadas

**Quando usar:** Após QUALQUER alteração de código no projeto.

---

## Pré-requisito

O servidor de desenvolvimento deve estar rodando:
```bash
npm run start
```

---

## Opção 1: Testes E2E Automatizados (Recomendado)

// turbo
```bash
npm run e2e -- --project=chromium
```

### Executar jornada específica:
```bash
# J1 - Home
npx playwright test j1-home.spec.ts

# J2 - Detail
npx playwright test j2-detail.spec.ts

# J3 - Active Workout
npx playwright test j3-active.spec.ts

# J4 - Weight Edit
npx playwright test j4-weight.spec.ts

# J5 - Checkbox
npx playwright test j5-checkbox.spec.ts

# J6 - Persistence
npx playwright test j6-persistence.spec.ts

# J7 - Rest Timer
npx playwright test j7-rest-timer.spec.ts

# J8 - Unit Toggle (kg/lb)
npx playwright test j8-unit-toggle.spec.ts

# J9 - History & PR
npx playwright test j9-history-pr.spec.ts

# J10 - Title Truncation
npx playwright test j10-title-truncation.spec.ts

# J11 - Session Volume
npx playwright test j11-session-volume.spec.ts
```

---

## Opção 2: Teste Manual via Browser

Se Playwright não estiver instalado, use o browser subagent:

### J1 - Home Page
1. Navigate to http://localhost:4200
2. Verificar: Header "Meus Treinos", 3 cards, FAB laranja
3. Screenshot

### J2 - Workout Detail
1. Click em Treino A
2. Verificar: Header com voltar, contador, lista exercícios, BI-SET, botão iniciar
3. Screenshot

### J3 - Treino Ativo
1. Click "Iniciar Treino"
2. Verificar: Timer aparece, checkboxes aparecem, botão muda para finalizar
3. Screenshot

### J4 - Editar Carga
1. Click em botão de peso
2. Verificar: Popup com input e botões
3. Digitar valor, salvar
4. Screenshot

### J5 - Checkbox
1. Click em checkbox
2. Verificar: Checkbox verde, borda verde no card, contador atualiza
3. Screenshot

### J6 - Persistência
1. Reload página (F5)
2. Verificar: Estado preservado (timer, checkboxes, pesos)
3. Screenshot

### J7 - Rest Timer
1. Marcar exercício como concluído ou clicar "Iniciar Descanso"
2. Verificar: Timer flutuante de 30s inicia (ou contagem pausada se clicou em pause)
3. Testar botão +30s e botão fechar/skip
4. Screenshot

### J8 - Toggle Unidade (kg/lb)
1. Clicar no toggle "kg / lb" no header
2. Verificar: Todos os pesos e botão anterior são atualizados na hora
3. Editar um input com lb e salvar, deve refletir em kg internamente
4. Screenshot

### J9 - History & PR
1. Localizar um exercício com histórico passado
2. Verificar: Aparece a label "Anterior: X kg"
3. Adicionar uma carga maior que a anterior
4. Verificar: Badge "PR" aparece sobre a carga salva
5. Screenshot

### J10 - Title Truncation Tooltip
1. Em um treino com título longo
2. Hover (Desktop) ou Press-and-hold (Mobile) sobre o título truncado no header
3. Verificar: Tooltip do título completo aparece
4. Screenshot

### J11 - Session Volume
1. Adicionar 2 ou mais cargas nos inputs (Ex: 2x de 50kg)
2. Verificar: O header exibe o volume total correto (Vol: 100 kg)
3. Screenshot

---

## Critérios de Sucesso

- [ ] Todos os elementos visuais consistentes com baseline
- [ ] Funcionalidades respondendo corretamente
- [ ] Zero erros no console
- [ ] Screenshots salvos para evidência

---

## Referências

- Baseline: `/docs/regression/journeys.md`
- Testes: `/e2e/tests/`
- Relatório: `/docs/regression/report.md`
