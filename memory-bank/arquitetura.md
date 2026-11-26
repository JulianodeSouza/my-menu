# Arquitetura — my-menu

## Visão Geral
Aplicativo mobile/web em **React Native (Expo 58 + Expo Router)** para gestão de lista de compras de supermercado, integrado à API REST irmã (`api-my-menu` em Node.js/Express).

## Mapa de Diretórios e Responsabilidades

- **`src/app/`** — Roteamento baseado em arquivos (`expo-router`):
  - `_layout.tsx`: Root layout com hierarquia de Providers (`ThemeProvider` → `PaperProvider` → `ModalProvider` → `ReduxProvider` → `ApiProvider`), controle de splash animado (`SplashScreen`), `Toast` global e `ModalConfirmation`.
  - `index.tsx`: Tela inicial ("Minha Lista") envolvida por `ShoppingProvider`, com cabeçalho e atalho para `/settings`.
  - `shopList/`: Módulo da Lista de Compras:
    - `index.tsx`: Container da lista, pull-to-refresh, botão "Finalizar compra" e FAB de novo item.
    - `ShoppingStatus.tsx`: Card superior de resumo (progresso percentual e valor total da compra).
    - `CardItemsList.tsx`: Acordeão expansível por categoria com itens, marcação (radio/checkbox), edição e exclusão.
    - `DialogItem.tsx`: SheetModal que hospeda `FormListPurchase` para criar, editar ou marcar item no carrinho.
    - `EmptyList.tsx`: Estado vazio quando não há itens na lista.
  - `settings/`: Módulo de Configurações (`/settings`):
    - `index.tsx`: Tela agregadora das seções de configuração.
    - `ThemeOptions.tsx`: Alternância de tema (Claro / Escuro) persistida no `AsyncStorage`.
    - `Categories.tsx`: CRUD de categorias de produtos com seletor visual de ícones (`lucide-react-native`).
    - `MeasuredUnits.tsx`: CRUD de unidades de medida (nome e símbolo).
- **`src/components/`** — Componentes visuais reutilizáveis:
  - `FormListPurchase.tsx`: Formulário principal de item (`Formik` + `Yup`), com máscara monetária e prévia de valor total em tempo real.
  - `Buttons/`, `Dialogs/DialogConfirmation.tsx`, `Icon/`, `Select/` (`SelectCategories`, `SelectMeasuredUnits`), `SheetModal/`, `Input.tsx`, `Toast.tsx`, `CardShop.tsx`.
- **`src/contexts/` & `src/ApiContext.tsx`** — Estado contextual e comunicação:
  - `ApiContext.tsx`: Wrapper sobre `src/services/api.ts` que intercepta erros HTTP, formata mensagens via `errorUtils.ts` e dispara Toast no Redux.
  - `ShoppingContext.tsx`: Estado da lista (`shoppingList`), cálculo derivado de progresso (`progress`), custo total (`totalPurchase`), flag `anyItemMarked` e ação `finishPurchase`.
  - `ThemeContext.tsx`: Provedor de paleta de cores (`lightTheme` / `darkTheme` definidos em `theme/index.tsx`).
  - `DialogContext.tsx`: Controle do modal global de confirmação (`useModalConfirmation`).
- **`src/store/`** — Estado global via Redux Toolkit:
  - `reducers/geral.ts`: Controle global de notificações (`infoToast`) e flags de atualização.
- **`src/services/`** — Integração externa e persistência local:
  - `api.ts`: Instância do `axios` com resolução automática de `baseURL` (`API_URL` de env, `10.0.2.2` no emulador Android ou IP do `hostUri` do Expo).
  - `cache.ts`: Cache local em `AsyncStorage` com TTL de 24 horas (`getItemCache`, `setItemCache`, `removeItemCache`).
- **`src/utils/`** — Funções puras e helpers:
  - `cacheFunctions.ts`: Busca com cache-aside para `categories` e `measuredUnits`.
  - `sumUtils.ts`: Cálculo de valores proporcionais por unidade de medida (`ml`/`g` dividem por 1000; demais multiplicam direto) e progresso da lista.
  - `stringUtils.ts`: Máscara monetária (`R$`), formatação decimal e sanitização numérica.
  - `errorUtils.ts`: Tradução amigável de erros de rede/HTTP por contexto (`fetch`, `save`, `update`, `delete`).
- **`src/types/`** — Contratos e interfaces TypeScript (`shopList.ts`, `categories.ts`, `measuredUnit.ts`, `forms.ts`, etc.).
- **`theme/index.tsx`** — Tokens de design (cores light/dark, `spacing`, `typography`, `fontWeights`, `borderRadius`).
- **`docs/specs/`** — Especificações SDD (`shopping-list.md`, `settings.md`, `_TEMPLATE.md`).
- **`.maestro/`** — Fluxos de testes E2E automatizados com Maestro.

## Fluxo Principal de Dados

1. **Inicialização:** `_layout.tsx` carrega o tema salvo no `AsyncStorage`, exibe o splash animado e monta a árvore de Providers.
2. **Listagem e Derivação:** Ao focar na Home (`ShopList`), `useFocusEffect` aciona `setLoadItems(true)` no `ShoppingContext`, que chama `GET /list-supermarket` via `useApi()`. Ao atualizar `shoppingList`, um `useEffect` recalcula automaticamente `progress`, `totalPurchase` e `anyItemMarked`.
3. **Dados Auxiliares com Cache:** `SelectCategories`, `SelectMeasuredUnits` e as telas de `settings/` consultam `loadCategories()` e `loadMeasuredUnits()`, que leem do `AsyncStorage` (TTL 24h) antes de requisitar `GET /categories` ou `GET /measuredUnits`. Mutações nas configurações invalidam o cache com `removeItemCache`.
4. **Mutações e Feedback:** Ações de criação, edição, marcação (`POST /list-supermarket/mark-item/:id`) e finalização (`POST /list-supermarket/finish-purchase`) passam pelo `ApiContext`, disparam `setInfoToast` no Redux em caso de sucesso/erro e recarregam a lista ativa (`setLoadItems(true)`).
