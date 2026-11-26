# Contexto Atual — my-menu

## Estado Geral do Projeto
- **Versão atual:** `1.0.0` (Expo 58, React Native 0.88.1, React 19.3, TypeScript 6.0).
- **Status:** Funcionalidades principais de Lista de Supermercado e Configurações implementadas, especificadas em `docs/specs/` e cobertas por fluxos E2E do Maestro em `.maestro/`.

## Funcionalidades Prontas
- **Lista de Supermercado (`src/app/shopList/`):**
  - Listagem agrupada por categoria com acordeão animado, ícone dinâmico e barra de progresso por categoria.
  - Card de status geral (`ShoppingStatus`) com valor total em `R$` e percentual concluído.
  - Cadastro de itens com opção de "Salvar" ou "Salvar e continuar".
  - Marcação de itens no carrinho com validação obrigatória de quantidade pega (`totalCaught`) e preço unitário (`amount`), incluindo prévia de subtotal no formulário.
  - Edição, exclusão com modal de confirmação e finalização de compra (`finish-purchase`).
- **Configurações (`src/app/settings/`):**
  - Seletor de tema Claro / Escuro com persistência em `AsyncStorage`.
  - CRUD completo de Categorias com seletor visual de 16 ícones e invalidação de cache.
  - CRUD completo de Unidades de Medida (`name` e `unitSymbol`) com invalidação de cache.
- **Infraestrutura e Qualidade:**
  - Splash screen animada customizada, sistema de Toast via Redux e modal de confirmação global.
  - Script interativo de build EAS (`scripts/build.js`) e fluxos E2E Maestro (`.maestro/`).

## Últimos Passos Executados
- Atualização da stack para Expo 58 e React Native 0.88 (`3e4e84d`, `ed5e8ac`).
- Correções de cálculo de totais da compra, edição de itens e sobreposição de teclado nos modais (`a301120`, `25db168`).
- Correção no cadastro de categorias e adição do seletor de ícones com fluxos E2E (`cd4e28f`, `e4060c1`).
- Configuração do sistema automático de **Memory Bank** (`memory-bank/`, `AGENTS.md`, `.agents/rules/memory-protocol.md` e `.agent/workflows/memorizar.md`).
