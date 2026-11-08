# my-menu — regras do projeto

## Projetos relacionados

- Backend (API consumida por este app): `\api-my-menu` (WSL: `/api-my-menu`) — Node.js/Express.

## Stack

- Expo 57, React Native 0.86, TypeScript.
- Rotas: expo-router (`src/app`). Estado: Redux Toolkit (`src/store`) + contexts (`src/contexts`, `src/ApiContext.tsx`).
- HTTP: axios (`src/services`). Formulários: Formik + Yup. UI: react-native-paper, styled-components.

## Comandos

- Dev build Android: `npx expo run:android`. Bundler: `npm start`.
- Lint: `npx eslint src` (eslint-config-universe + prettier). Tipos: `npx tsc --noEmit`.
- Dependências nativas: `npx expo install <pacote>`.

## Testes

- E2E com Maestro em `.maestro/`. O `appId` é o `android.package` definido em `app.config.ts`.
- Todo componente interativo precisa de `testID` em kebab-case.

## Regras

- `node_modules` e Android SDK são do Windows: no WSL, se `node` não existir, use `cmd.exe /c "npx ..."` e nunca rode `npm install` pelo WSL.

## Especificações e Design (SDD)

- Especificações detalhadas de features, fluxos e contratos ficam em `docs/specs/` (modelo em `docs/specs/_TEMPLATE.md`).
- Antes de implementar ou alterar uma feature, verifique se existe spec em `docs/specs/` (neste repositório ou na API irmã) e siga o contrato e os `testID`s definidos nela.
- Ao mudar regras de negócio ou contratos de API, mantenha a spec correspondente atualizada.
