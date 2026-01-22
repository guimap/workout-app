# Contexto do Projeto - Treino App

Data: 21/01/2026

## 1. Visão Geral
WebApp mobile-first desenvolvido em Angular (v18+) para gerenciamento de treinos de academia. O foco principal é uma experiência de uso fluida em mobile, com um design system "Black + Neon Green" de alto contraste.

## 2. Stack Tecnológica
- **Framework:** Angular (Standalone Components, Signals)
- **Linguagem:** TypeScript
- **Estilização:** CSS puro com CSS Variables (Design System)
- **Ícones:** SVG inline
- **Build:** Angular CLI
- **Gerenciamento de Estado:** Angular Signals + LocalStorage

## 3. Funcionalidades Implementadas

### Core
- [x] **Lista de Treinos Integrada:** Carrega dados de JSON externo (`https://d3fgovm6dm6a55.cloudfront.net/treino.json`).
- [x] **Persistência Local:** Salva pesos e estado do treino no `localStorage`.
- [x] **Timer Resiliente:** Cronômetro que resiste à suspensão do navegador mobile (usa `Date.now()` vs [startTime](file:///c:/Users/guiih/OneDrive/Documentos/Projetos/js/treino-v2/src/app/components/workout-detail/workout-detail.component.ts#188-201)).

### Interface do Usuário (UI)
- [x] **Home:** Lista de treinos com badges (A, B, C).
- [x] **Detalhes:** Sticky header ao rolar, visualização de exercícios.
- [x] **Bi-sets/Tri-sets:** Agrupamento visual de exercícios combinados.
- [x] **Edição de Carga:** Input numérico inline para alterar cargas.
- [x] **Multi-set Weights:** Suporte a inputs múltiplos para séries como `3x10+15` (cargas diferentes para cada parte).

## 4. Estrutura de Pastas Principal

```
src/app/
├── components/
│   ├── workout-list/      # Tela inicial (Home)
│   └── workout-detail/    # Tela de execução/detalhes
├── models/
│   └── workout.model.ts   # Interfaces (Workout, Exercise, ParsedSet)
├── services/
│   └── workout.service.ts # Lógica de API e State Management
├── app.routes.ts          # Definição de rotas
└── app.component.ts       # Root layout
```

## 5. Design System (Tokens Principais)

**Cores:**
- Fundo: `#121212` (`--background`)
- Texto: `#FFFFFF` (`--foreground`)
- Destaque: `#A0F03C` (`--primary`, Neon Green)
- Card: `#1E1E1E` (`--card`)
- Texto Secundário: `#B0B0B0` (`--muted-foreground`)

**Tipografia:**
- Família: 'Inter', sans-serif
- Pesos: 400 (Regular), 500 (Medium)

## 6. Estado Atual das Tarefas

Todas as funcionalidades core e de UI solicitadas foram implementadas.
- O ícone da Home foi ajustado para um halter inclinado em 45º.
- O header da tela de detalhes é fixo (sticky).
- A contagem de exercícios considera bi-sets como 1 item na home, mas conta individualmente na execução.

## 7. Próximos Passos (Sugestões)
- Implementar histórico de treinos.
- Adicionar gráficos de progressão de carga.
- PWA (Progressive Web App) para instalação no celular.

---
*Este arquivo representa o contexto do projeto até o momento da exportação.*
