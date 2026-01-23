# Relatório de Testes E2E - Treino App

**Data:** 21/01/2026
**Ambiente:** Localhost (Chrome Driver)
**Status Geral:** ✅ APROVADO

## Cenários Testados

### 1. Persistência de Carga
**Objetivo:** Verificar se o valor salvo no campo de carga permanece após recarregar a página.
- **Ação:** 
  1. Selecionado exercício sem carga.
  2. Inserido valor "55".
  3. Salvo.
  4. Página atualizada (F5).
- **Resultado Esperado:** O valor "55" deve ser exibido.
- **Resultado Obtido:** ✅ O valor "55" persistiu corretamente.

### 2. Edição de Carga Existente
**Objetivo:** Verificar se é possível alterar um valor já salvo e se a atualização persiste.
- **Ação:**
  1. Selecionado exercício com carga "55".
  2. Alterado valor para "65".
  3. Salvo.
  4. Página atualizada (F5).
- **Resultado Esperado:** O valor "65" deve ser exibido.
- **Resultado Obtido:** ✅ O valor foi atualizado para "65" corretamente.

### 3. Lógica da Barra de Progresso e Conclusão
**Objetivo:** Verificar se o indicador de progresso reflete fielmente o número de exercícios concluídos.
- **Ação:**
  1. Identificado total de 8 exercícios.
  2. Marcados todos os exercícios sequencialmente.
  3. Verificado status ao concluir o último.
  4. Desmarcado um exercício.
- **Resultado Esperado:** 
  - Ao marcar todos: "8 de 8 exercícios" (100%).
  - Ao desmarcar um: "7 de 8 exercícios" (< 100%).
- **Resultado Obtido:** ✅ A contagem e a barra de progresso responderam corretamente em ambos os casos.

## Conclusão
O aplicativo demonstra robustez nas funcionalidades principais de acompanhamento de treino. A persistência de dados via `localStorage` funciona adequadamente para criação e atualização de cargas, e a interface reage corretamente às interações de conclusão de exercícios.

### 4. Limpar Dados Locais (Home)
**Objetivo:** Verificar a funcionalidade do botão flutuante para limpar o `localStorage`.
- **Ação:**
  1. Navegar para a tela inicial.
  2. Clicar no botão flutuante (FAB) no canto inferior esquerdo.
  3. Confirmar a ação no modal.
- **Resultado Esperado:**
  1. O modal deve abrir ao clicar no FAB.
  2. Ao confirmar, a página deve recarregar e os dados salvos (pesos e conclusões) devem ser resetados.
