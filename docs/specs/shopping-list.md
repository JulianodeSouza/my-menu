# Spec: Lista de Supermercado (Shopping List)

- **Status:** Implementada
- **Repositórios impactados:** `api-my-menu` (Backend) / `my-menu` (Frontend)

---

## 1. Contexto e Objetivo
Permite ao usuário gerenciar sua lista de compras de supermercado: planejar os itens a comprar, agrupá-los por categoria, marcar itens conforme são colocados no carrinho (com a opção de informar o valor real e a quantidade obtida), acompanhar o valor total previsto/gasto e finalizar a compra.

## 2. Regras de Negócio
- **RN01:** Os itens da lista devem ser agrupados visualmente pela sua categoria correspondente.
- **RN02:** Ao adicionar um item, o nome, a categoria, a quantidade e a unidade de medida são campos obrigatórios.
- **RN03:** O usuário pode marcar um item como "pego no carrinho". Se o item não possuir preço ou quantidade coletada informados, a tela deve abrir o formulário para preenchimento.
- **RN04:** O valor total da compra e a barra de progresso devem refletir em tempo real a soma dos itens marcados com seus respectivos valores multiplicados pela quantidade/unidade.
- **RN05:** O botão "Finalizar compra" só deve ser exibido quando houver pelo menos um item marcado na lista.
- **RN06:** Finalizar a compra encerra o ciclo de compras atual via API (`/list-supermarket/finish-purchase`), limpando os itens comprados da lista ativa.

## 3. Banco de Dados (Backend)
- Tabela `list_supermarkets`:
  - `id`: INTEGER (PK, AutoIncrement)
  - `name`: VARCHAR(255) (Obrigatório)
  - `quantity`: DECIMAL (Obrigatório)
  - `amount`: DECIMAL (Opcional)
  - `totalCaught`: DECIMAL (Opcional)
  - `checked`: BOOLEAN (Default: false)
  - `category_id`: INTEGER (FK -> categories.id)
  - `measured_unit_id`: INTEGER (FK -> measured_units.id)

## 4. Contrato da API (Backend ↔ Frontend)

### `GET /list-supermarket`
- **Request:** Sem parâmetros obrigatórios.
- **Response `200`:**
  ```json
  [
    {
      "category": "Hortifruti",
      "categoryIcon": "Apple",
      "items": [
        {
          "id": 1,
          "name": "Maçã Fuji",
          "quantity": 1.5,
          "amount": 8.99,
          "totalCaught": 1.5,
          "checked": true,
          "unitSymbol": "kg",
          "category": 2,
          "measuredUnit": 1
        }
      ]
    }
  ]
  ```

### `POST /list-supermarket`
- **Request Body:**
  ```json
  {
    "name": "Banana Prata",
    "quantity": 1,
    "category": 2,
    "measuredUnit": 1,
    "amount": 0
  }
  ```
- **Response `201`:**
  ```json
  {
    "id": 2,
    "name": "Banana Prata",
    "quantity": 1,
    "category": 2,
    "measuredUnit": 1
  }
  ```

### `POST /list-supermarket/mark-item/:id`
- **Request Body:**
  ```json
  {
    "checked": true,
    "amount": 5.50,
    "totalCaught": 1
  }
  ```
- **Response `200`:**
  ```json
  {
    "message": "Item atualizado com sucesso"
  }
  ```

### `POST /list-supermarket/finish-purchase`
- **Request Body:** `{}`
- **Response `200`:**
  ```json
  {
    "message": "Compra finalizada com sucesso"
  }
  ```

### `DELETE /list-supermarket/:id`
- **Response `200`:**
  ```json
  {
    "message": "Item removido com sucesso"
  }
  ```

## 5. Comportamento de Tela e UX (Frontend)
- **Telas/Rotas:** `src/app/index.tsx`, `src/app/shopList/index.tsx`
- **Estados obrigatórios:**
  - *Loading:* Skeleton ou indicador de carregamento durante a busca inicial (`onRefreshControl` / foco).
  - *Vazio:* Exibe o componente `EmptyList` (`testID="shoplist-empty-state"`) quando a lista não possui nenhum item cadastrado.
  - *Erro:* Toast informativo de erro em caso de falha de requisição da API.
  - *Sucesso:* Toast informativo de confirmação (ex: "Item adicionado com sucesso!").
- **`testID`s obrigatórios (para o QA / Maestro):**
  - `header-btn-settings`: Botão no topo direito para navegar para a tela de configurações.
  - `shoplist-container`: Container principal da tela da lista de compras.
  - `shoplist-empty-state`: Estado vazio da lista.
  - `shoplist-status-card`: Card no topo com valor total da compra e progresso.
  - `shoplist-btn-add-item`: Botão flutuante (FAB) verde com ícone `+` para abrir o modal de cadastro.
  - `shoplist-btn-finish-purchase`: Botão "Finalizar compra" no rodapé quando itens estão marcados.
  - `shoplist-form-input-name`: Campo de texto do nome do produto no modal.
  - `shoplist-form-input-quantity`: Campo de texto da quantidade no modal.
  - `shoplist-form-input-amount`: Campo monetário de valor unitário no modal.
  - `shoplist-form-select-category`: Seletor de categoria do produto.
  - `shoplist-form-select-unit`: Seletor de unidade de medida (kg, un, L, etc.).
  - `shoplist-form-btn-save`: Botão "Salvar" no rodapé do modal.
  - `shoplist-form-btn-save-continue`: Botão "Salvar e continuar" no modal.
  - `shoplist-category-card`: Card expansível de agrupamento de categoria.
  - `shoplist-item-row`: Linha individual de cada produto.
  - `shoplist-item-checkbox`: Checkbox / RadioButton para marcar o item como pego.
  - `shoplist-item-btn-edit`: Botão com ícone de lápis para editar o item.
  - `shoplist-item-btn-delete`: Botão com ícone de lixeira para remover o item.

## 6. Critérios de Aceite (Roteiro do QA)
- [ ] **CA01 (E2E):** Ao abrir o app sem itens cadastrados, a tela exibe o estado vazio (`shoplist-empty-state`).
- [ ] **CA02 (E2E):** Ao tocar em `shoplist-btn-add-item`, o modal de cadastro de item deve abrir com os campos visíveis.
- [ ] **CA03 (E2E):** Preencher `shoplist-form-input-name`, selecionar categoria e unidade e tocar em `shoplist-form-btn-save` fecha o modal, exibe Toast de sucesso e o item aparece listado sob sua respectiva categoria.
- [ ] **CA04 (E2E):** Ao tocar no `shoplist-item-checkbox`, o item é marcado como pego, o valor/progresso em `shoplist-status-card` é atualizado e o botão `shoplist-btn-finish-purchase` torna-se visível.
- [ ] **CA05 (E2E):** Ao tocar em `shoplist-btn-finish-purchase` e confirmar a ação, os itens marcados são finalizados e a lista é atualizada.
