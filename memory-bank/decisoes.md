# Decisões Técnicas e Regras de Negócio — my-menu

## Stack e Bibliotecas Escolhidas

- **Core:** Expo 58 (`~58.0.0`), React 19.3, React Native 0.88.1, TypeScript 6.0 (alias `~/*` apontando para `./src/*`).
- **Navegação:** `expo-router` com rotas tipadas (`typedRoutes: true`).
- **Gerenciamento de Estado Híbrido:**
  - **Redux Toolkit (`src/store`):** Reservado para feedback global de UI (`infoToast`).
  - **React Contexts (`src/contexts`, `src/ApiContext.tsx`):** Domínio da lista de compras (`ShoppingContext`), tema (`ThemeContext`), modais de confirmação (`DialogContext`) e cliente HTTP com tratamento centralizado de erros (`ApiContext`).
- **Formulários e Validação:** `Formik` + `Yup` com controle imperativo via `forwardRef` (`FormListPurchaseRef`) para submissão e reset a partir de modais (`DialogItem`).
- **UI e Estilização:** Combinação de `StyleSheet` nativo consumindo tokens de `theme/index.tsx`, componentes do `react-native-paper` (`Divider`, `RadioButton`, `PaperProvider`) e ícones do `lucide-react-native`.
- **HTTP e Cache:** `axios` (timeout de 5000ms) + `@react-native-async-storage/async-storage` com estratégia de cache local de 24h para dados cadastrais (`categories` e `measuredUnits`).
- **Qualidade e Testes E2E:** Maestro (`.maestro/`) guiado por `testID`s padronizados em `kebab-case`.
- **Builds:** Script interativo em `scripts/build.js` integrando com `eas-cli@24.8.0` para perfis `development` e `production`.

## Regras de Negócio Críticas

### Lista de Supermercado (`docs/specs/shopping-list.md`)
- **Agrupamento:** Itens são exibidos agrupados por categoria em cards expansíveis (`CardItemsList`) com barra de progresso individual e ícone da categoria.
- **Cadastro vs. Edição/Marcação:**
  - No cadastro (`register`), são obrigatórios: `name`, `category`, `quantity` (> 0) e `measuredUnit`.
  - Ao tentar marcar um item como pego no carrinho (`markItem`), se `amount` (preço unitário) ou `totalCaught` (quantidade pega) não estiverem preenchidos (> 0), o app abre automaticamente o modal de edição (`DialogItem`) exigindo o preenchimento antes de confirmar a marcação.
  - Ao desmarcar um item (`unmarkItemPurchase`), `amount` e `totalCaught` são zerados e `checked` volta para `false`.
- **Cálculo de Valor Total (`calculateValuesByMeasuredUnits`):**
  - Apenas itens com `checked: true` entram na soma de `totalPurchase`.
  - Unidades `ml` e `g` calculam proporcionalmente por quilo/litro: `amount * (quantity / 1000)`.
  - Demais unidades (`un`, `pc`, `dz`, `l`, `kg`, etc.) multiplicam diretamente: `amount * quantity`.
  - Usa `totalCaught` (se > 0) ou `quantity` como base de cálculo.
- **Finalização de Compra:** O botão "Finalizar compra" (`shoplist-btn-finish-purchase`) só aparece se `anyItemMarked === true` e exige confirmação via `ModalConfirmation` antes de chamar `POST /list-supermarket/finish-purchase`.

### Configurações (`docs/specs/settings.md`)
- **Temas:** Alternância entre claro (`light`) e escuro (`dark`) via `Appearance.setColorScheme`, persistida na chave `"theme"` do `AsyncStorage`.
- **Categorias e Ícones:**
  - Criação/edição de categoria permite escolher entre 16 ícones pré-definidos do Lucide (`Tag`, `Apple`, `Beef`, `Utensils`, `Coffee`, `Milk`, `Cookie`, `Pizza`, `Fish`, `Carrot`, `Sparkles`, `Shirt`, `Baby`, `Heart`, `ShoppingBag`, `BottleWine`).
  - O ícone padrão e fallback defensivo no componente `<Icon />` é `"Tag"`.
- **Invalidação de Cache:** Qualquer `POST`, `PUT` ou `DELETE` em categorias ou unidades de medida deve chamar `removeItemCache("categories")` ou `removeItemCache("measuredUnits")` antes de recarregar a listagem.

## Convenções de Desenvolvimento
- **Spec-Driven Development (SDD):** Toda feature deve seguir e manter atualizada sua spec em `docs/specs/`.
- **Testabilidade:** Todo elemento interativo deve possuir `testID` em `kebab-case` conforme documentado nas specs.
- **Ambiente Windows/WSL:** `node_modules` e Android SDK pertencem ao ambiente Windows; não executar `npm install` diretamente do Linux/WSL.
