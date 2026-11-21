# Spec: Configurações do Sistema (Settings)

- **Status:** Implementada
- **Repositórios impactados:** `api-my-menu` (Backend) / `my-menu` (Frontend)

---

## 1. Contexto e Objetivo
Permite ao usuário gerenciar as opções globais do aplicativo: preferências de tema (Claro / Escuro / Sistema), além de cadastrar, editar e remover categorias e unidades de medida utilizadas no cadastro dos itens do supermercado.

## 2. Regras de Negócio
- **RN01:** O aplicativo suporta temas claro (`light`), escuro (`dark`) e sincronização com o sistema operacional (`system`). A preferência é salva no `AsyncStorage`.
- **RN02:** O usuário pode criar novas categorias de produtos. O nome não pode ser vazio e um ícone pertinente pode ser selecionado (fallback padrão: `Tag`).
- **RN03:** O usuário pode editar o nome e o ícone de uma categoria existente ou excluí-la. Ao excluir, um modal de confirmação deve ser exibido.
- **RN04:** O usuário pode gerenciar unidades de medida (ex: kg, un, L, pct).
- **RN05:** Renderização de ícones no componente `Icon` possui fallback defensivo para `icons.Tag` caso o ícone informado não seja encontrado no pacote de ícones.

## 3. Contrato da API (Backend ↔ Frontend)

### `GET /categories`
- **Response `200`:**
  ```json
  [
    { "id": 1, "name": "Bebidas", "icon": "BottleWine" },
    { "id": 2, "name": "Hortifruti", "icon": "Apple" }
  ]
  ```

### `POST /categories`
- **Request Body:**
  ```json
  {
    "name": "Padaria",
    "icon": "Cookie"
  }
  ```
- **Response `201`:**
  ```json
  { "id": 3, "name": "Padaria", "icon": "Cookie" }
  ```

### `PUT /categories/:id`
- **Request Body:**
  ```json
  {
    "name": "Panificação",
    "icon": "Cookie"
  }
  ```
- **Response `200`:**
  ```json
  { "id": 3, "name": "Panificação", "icon": "Cookie" }
  ```

### `DELETE /categories/:id`
- **Response `200`:**
  ```json
  { "message": "Categoria removida com sucesso" }
  ```

## 4. Comportamento de Tela e UX (Frontend)
- **Telas/Rotas:** `src/app/settings/index.tsx`, `Categories.tsx`, `MeasuredUnits.tsx`, `ThemeOptions.tsx`
- **Fluxo de Seleção de Ícones no Modal de Categorias:**
  - Ao abrir o modal para criação (`openCreate`), o estado `selectedIcon` é redefinido para `'Tag'`.
  - Ao abrir o modal para edição (`openEdit`), o estado `selectedIcon` é inicializado com `category.icon || 'Tag'`.
  - É disponibilizada uma grade com ícones pertinentes a categorias de mercado (`Tag`, `Apple`, `Beef`, `Utensils`, `Coffee`, `Milk`, `Cookie`, `Pizza`, `Fish`, `Carrot`, `Sparkles`, `Shirt`, `Baby`, `Heart`, `ShoppingBag`, `BottleWine`).
  - O ícone selecionado é visualmente destacado com borda e cor primária (`theme.primary`) e fundo com transparência primária.
  - Ao salvar categoria (`saveCategory`), o payload enviado via `postApi` ou `putApi` inclui tanto o `name` quanto o `icon`.
- **`testID`s obrigatórios (para o QA / Maestro):**
  - `settings-screen`: Container principal da tela de configurações.
  - `settings-theme-option-light`: Opção de seleção do tema claro.
  - `settings-theme-option-dark`: Opção de seleção do tema escuro.
  - `settings-category-btn-add`: Botão "Adicionar" na seção de categorias.
  - `settings-category-input-name`: Campo de texto do nome da categoria no modal.
  - `settings-category-icon-selector`: Container da grade de opções de ícones da categoria.
  - `settings-category-icon-option-<icon>`: Botão de seleção de cada ícone (em kebab-case, ex.: `settings-category-icon-option-tag`, `settings-category-icon-option-apple`, `settings-category-icon-option-bottlewine`).
  - `settings-category-btn-save`: Botão "Salvar" no modal de categoria.
  - `settings-category-btn-cancel`: Botão "Cancelar" no modal de categoria.
  - `settings-category-item`: Linha de exibição de uma categoria na listagem.
  - `settings-category-btn-edit`: Botão de edição de uma categoria.
  - `settings-category-btn-delete`: Botão de exclusão de uma categoria.
  - `settings-unit-btn-add`: Botão "Adicionar" na seção de unidades de medida.

## 5. Critérios de Aceite (Roteiro do QA)
- [ ] **CA01 (E2E):** O usuário acessa Configurações pelo botão `header-btn-settings` na home.
- [ ] **CA02 (E2E):** Ao tocar em `settings-category-btn-add`, um modal abre para digitar o nome da nova categoria e exibe o seletor `settings-category-icon-selector` com `Tag` selecionado por padrão.
- [ ] **CA03 (E2E):** Ao tocar em uma opção de ícone (ex.: `settings-category-icon-option-apple`), o ícone é selecionado com destaque visual e enviado no payload ao salvar via `settings-category-btn-save`.
- [ ] **CA04 (E2E):** Ao editar uma categoria existente através de `settings-category-btn-edit`, o ícone cadastrado previamente é carregado como selecionado no modal.
- [ ] **CA05 (E2E):** Ao alternar o tema em `settings-theme-option-dark`, a interface adota as cores escuras imediatamente.
