# Spec: Configurações do Sistema (Settings)

- **Status:** Implementada
- **Repositórios impactados:** `api-my-menu` (Backend) / `my-menu` (Frontend)

---

## 1. Contexto e Objetivo
Permite ao usuário gerenciar as opções globais do aplicativo: preferências de tema (Claro / Escuro / Sistema), além de cadastrar, editar e remover categorias e unidades de medida utilizadas no cadastro dos itens do supermercado.

## 2. Regras de Negócio
- **RN01:** O aplicativo suporta temas claro (`light`), escuro (`dark`) e sincronização com o sistema operacional (`system`). A preferência é salva no `AsyncStorage`.
- **RN02:** O usuário pode criar novas categorias de produtos. O nome não pode ser vazio.
- **RN03:** O usuário pode editar o nome de uma categoria existente ou excluí-la. Ao excluir, um modal de confirmação deve ser exibido.
- **RN04:** O usuário pode gerenciar unidades de medida (ex: kg, un, L, pct).

## 3. Contrato da API (Backend ↔ Frontend)

### `GET /categories`
- **Response `200`:**
  ```json
  [
    { "id": 1, "name": "Bebidas", "icon": "CupSoda" },
    { "id": 2, "name": "Hortifruti", "icon": "Apple" }
  ]
  ```

### `POST /categories`
- **Request Body:**
  ```json
  { "name": "Padaria" }
  ```
- **Response `201`:**
  ```json
  { "id": 3, "name": "Padaria" }
  ```

### `PUT /categories/:id`
- **Request Body:**
  ```json
  { "name": "Panificação" }
  ```
- **Response `200`:**
  ```json
  { "id": 3, "name": "Panificação" }
  ```

### `DELETE /categories/:id`
- **Response `200`:**
  ```json
  { "message": "Categoria removida com sucesso" }
  ```

## 4. Comportamento de Tela e UX (Frontend)
- **Telas/Rotas:** `src/app/settings/index.tsx`, `Categories.tsx`, `MeasuredUnits.tsx`, `ThemeOptions.tsx`
- **`testID`s obrigatórios (para o QA / Maestro):**
  - `settings-screen`: Container principal da tela de configurações.
  - `settings-theme-option-light`: Opção de seleção do tema claro.
  - `settings-theme-option-dark`: Opção de seleção do tema escuro.
  - `settings-category-btn-add`: Botão "Adicionar" na seção de categorias.
  - `settings-category-input-name`: Campo de texto do nome da categoria no modal.
  - `settings-category-btn-save`: Botão "Salvar" no modal de categoria.
  - `settings-category-btn-cancel`: Botão "Cancelar" no modal de categoria.
  - `settings-category-item`: Linha de exibição de uma categoria na listagem.
  - `settings-category-btn-edit`: Botão de edição de uma categoria.
  - `settings-category-btn-delete`: Botão de exclusão de uma categoria.
  - `settings-unit-btn-add`: Botão "Adicionar" na seção de unidades de medida.

## 5. Critérios de Aceite (Roteiro do QA)
- [ ] **CA01 (E2E):** O usuário acessa Configurações pelo botão `header-btn-settings` na home.
- [ ] **CA02 (E2E):** Ao tocar em `settings-category-btn-add`, um modal abre para digitar o nome da nova categoria.
- [ ] **CA03 (E2E):** Digitar um nome válido em `settings-category-input-name` e tocar em `settings-category-btn-save` fecha o modal e insere a nova categoria na listagem.
- [ ] **CA04 (E2E):** Ao alternar o tema em `settings-theme-option-dark`, a interface adota as cores escuras imediatamente.
