# my-menu — Regras e Guia do Projeto

## Memory Bank (Leitura Obrigatória)

- **REGRA EXPLÍCITA:** Antes de varrer, buscar ou editar qualquer arquivo de código no repositório, consulte **sempre** os arquivos da pasta `memory-bank/` para obter contexto arquitetural, decisões técnicas e estado atual:
  - @[arquitetura](memory-bank/arquitetura.md)
  - @[decisoes](memory-bank/decisoes.md)
  - @[contexto-atual](memory-bank/contexto-atual.md)
- Após criar, editar ou remover qualquer arquivo de código, mantenha `memory-bank/contexto-atual.md` (e `memory-bank/decisoes.md`, se aplicável) atualizado conforme definido em `.agents/rules/memory-protocol.md`.

## Projetos Relacionados

- **Backend (API REST consumida por este app):** `\api-my-menu` (WSL: `/api-my-menu`) — Node.js/Express.

## Stack Tecnológica

- **Core:** Expo 58, React Native 0.88, React 19.3, TypeScript 6.0 (path alias `~/*` → `./src/*`).
- **Rotas:** `expo-router` (`src/app`).
- **Estado:** Redux Toolkit (`src/store` — toasts/UI global) + React Contexts (`src/contexts`, `src/ApiContext.tsx` — domínio, tema, modais e cliente HTTP).
- **HTTP & Cache:** `axios` (`src/services/api.ts`) + `@react-native-async-storage/async-storage` (`src/services/cache.ts`, TTL 24h).
- **Formulários & UI:** Formik + Yup, `react-native-paper`, `lucide-react-native`, `styled-components` e tokens próprios em `theme/index.tsx`.

## Arquitetura Geral

- `src/app/`: Telas e rotas do Expo Router (`_layout.tsx`, `index.tsx`, `shopList/` para lista de compras e `settings/` para tema, categorias e unidades de medida).
- `src/components/`: Componentes visuais reutilizáveis, modais (`SheetModal`, `DialogConfirmation`) e formulário principal (`FormListPurchase.tsx`).
- `src/contexts/` e `src/ApiContext.tsx`: Estado da lista de compras (`ShoppingContext`), tema (`ThemeContext`), confirmação (`DialogContext`) e chamadas de API com tratamento de erro (`ApiContext`).
- `src/services/` e `src/utils/`: Cliente Axios, cache local com `AsyncStorage`, cálculos por unidade de medida (`sumUtils.ts`), máscaras (`stringUtils.ts`) e tradução de erros (`errorUtils.ts`).
- `docs/specs/` e `.maestro/`: Especificações SDD de features e fluxos de testes E2E com Maestro.

## Comandos Principais

- **Bundler (Dev Server):** `npm start` (ou `npx expo start`).
- **Rodar no Android / iOS:** `npm run android` (`npx expo run:android`) | `npm run ios` (`npx expo run:ios`).
- **Build (EAS):** `npm run build` (script interativo `scripts/build.js`), `npm run build:apk:development` ou `npm run build:apk:production`.
- **Lint e Tipagem:** `npx eslint src` (eslint-config-universe + prettier) | `npx tsc --noEmit`.
- **Testes E2E (Maestro):** `maestro test .maestro/` (o `appId` é `com.mymenu`, definido em `app.config.ts`).
- **Dependências nativas:** `npx expo install <pacote>`.

## Regras do Ambiente e Testes

- **Testabilidade:** Todo componente interativo precisa de `testID` em `kebab-case`.
- **Windows / WSL:** `node_modules` e Android SDK são do Windows. No WSL, se `node` não existir, use `cmd.exe /c "npx ..."` e nunca rode `npm install` pelo WSL.

## Especificações e Design (SDD)

- Especificações detalhadas de features, fluxos e contratos ficam em `docs/specs/` (modelo em `docs/specs/_TEMPLATE.md`).
- Antes de implementar ou alterar uma feature, verifique se existe spec em `docs/specs/` (neste repositório ou na API irmã) e siga o contrato e os `testID`s definidos nela.
- Ao mudar regras de negócio ou contratos de API, mantenha a spec correspondente atualizada.
- Caso seja uma implementação nova, crie uma spec seguindo o modelo `_TEMPLATE.md` e adicione o link no PR.
