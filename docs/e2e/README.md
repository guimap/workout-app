# 🧪 Testes E2E - Treino App

> **Framework:** Playwright  
> **Cobertura:** Jornadas J1-J6  
> **Última atualização:** 2026-01-23

---

## Sumário

1. [Configuração](#configuração)
2. [Estrutura dos Testes](#estrutura-dos-testes)
3. [Cenários de Teste](#cenários-de-teste)
4. [Execução](#execução)
5. [Relatórios](#relatórios)

---

## Configuração

### Instalação

```bash
# Instalar Playwright
npm install -D @playwright/test

# Instalar browsers
npx playwright install
```

### Arquivo de Configuração

Criar `playwright.config.ts` na raiz do projeto:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Scripts no package.json

```json
{
  "scripts": {
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:debug": "playwright test --debug",
    "e2e:report": "playwright show-report"
  }
}
```

---

## Estrutura dos Testes

```
e2e/
├── fixtures/
│   └── test-fixtures.ts     # Fixtures compartilhados
├── pages/
│   ├── home.page.ts         # Page Object - Home
│   └── detail.page.ts       # Page Object - Detail
├── tests/
│   ├── j1-home.spec.ts      # J1 - Tela Inicial
│   ├── j2-detail.spec.ts    # J2 - Detalhe do Treino
│   ├── j3-active.spec.ts    # J3 - Treino Ativo
│   ├── j4-weight.spec.ts    # J4 - Editar Carga
│   ├── j5-checkbox.spec.ts  # J5 - Checkbox
│   └── j6-persistence.spec.ts # J6 - Persistência
└── global-setup.ts          # Setup global
```

---

## Cenários de Teste

### J1 — Tela Inicial (Home)

| ID | Cenário | Critério de Aceite |
|----|---------|-------------------|
| J1.1 | Exibir header | "Meus Treinos" com ícone visível |
| J1.2 | Listar treinos | 3 cards (A, B, C) com badges |
| J1.3 | FAB visível | Botão laranja no canto inferior direito |
| J1.4 | Navegação | Click em card navega para /workout/:id |

### J2 — Detalhe do Treino

| ID | Cenário | Critério de Aceite |
|----|---------|-------------------|
| J2.1 | Header | Voltar + título do treino |
| J2.2 | Contador | "0 de X exercícios" inicial |
| J2.3 | Lista exercícios | Cards com nome, séries |
| J2.4 | BI-SET | Badge e agrupamento visual |
| J2.5 | Botão iniciar | Verde "Iniciar Treino" |

### J3 — Treino Ativo

| ID | Cenário | Critério de Aceite |
|----|---------|-------------------|
| J3.1 | Timer | Aparece após iniciar |
| J3.2 | Checkboxes | Aparecem ao lado de cada exercício |
| J3.3 | Botão finalizar | Muda para laranja "Finalizar" |

### J4 — Editar Carga

| ID | Cenário | Critério de Aceite |
|----|---------|-------------------|
| J4.1 | Abrir popup | Click em peso abre editor |
| J4.2 | Input | Campo numérico com placeholder |
| J4.3 | Salvar | Persiste valor e atualiza UI |
| J4.4 | Cancelar | Fecha popup sem salvar |

### J5 — Checkbox

| ID | Cenário | Critério de Aceite |
|----|---------|-------------------|
| J5.1 | Marcar | Checkbox verde com ✓ |
| J5.2 | Card | Borda verde no card ativo |
| J5.3 | Contador | Incrementa corretamente |
| J5.4 | Desmarcar | Volta ao estado inicial |

### J6 — Persistência

| ID | Cenário | Critério de Aceite |
|----|---------|-------------------|
| J6.1 | Reload | Estado preservado após F5 |
| J6.2 | Timer | Continua de onde parou |
| J6.3 | Exercícios | Marcações preservadas |
| J6.4 | Pesos | Valores salvos persistem |

---

## Execução

### Executar todos os testes
```bash
npm run e2e
```

### Executar com UI interativa
```bash
npm run e2e:ui
```

### Executar teste específico
```bash
npx playwright test j1-home.spec.ts
```

### Debug mode
```bash
npm run e2e:debug
```

---

## Relatórios

### Gerar relatório HTML
```bash
npm run e2e:report
```

### Screenshot em falha
Screenshots automáticos são salvos em `test-results/` quando um teste falha.

### Traces
Traces podem ser visualizados com:
```bash
npx playwright show-trace trace.zip
```

---

## Manutenção

### Atualizar seletores
Os Page Objects centralizam os seletores. Ao alterar a UI, atualize apenas os arquivos em `e2e/pages/`.

### Adicionar novo cenário
1. Identificar jornada
2. Criar teste em `e2e/tests/`
3. Atualizar documentação
4. Executar e validar
