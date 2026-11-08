# Spec: <Nome da Feature ou Módulo>

- **Status:** Rascunho | Aprovada | Implementada
- **Repositórios impactados:** `api-my-menu` (Backend) / `my-menu` (Frontend)

---

## 1. Contexto e Objetivo
Descreva em 2–4 linhas qual problema de negócio esta feature resolve e para qual perfil de usuário.

## 2. Regras de Negócio
- **RN01:** <Ex.: Apenas usuários autenticados podem favoritar um item.>
- **RN02:** <Ex.: Favoritar um item já favoritado deve ser idempotente (não duplicar registro).>

## 3. Banco de Dados (Backend)
- **Tabelas novas / alteradas:**
  - `nome_da_tabela`: colunas, tipos, chaves estrangeiras e índices.
- **Migration necessária?** Sim / Não.

## 4. Contrato da API (Backend ↔ Frontend)

### `POST /exemplo`
- **Auth:** Bearer Token obrigatório? Sim / Não
- **Request (Params / Query / Body):**
  ```json
  {
    "campo": "valor"
  }
  ```
- **Response `200 / 201`:**
  ```json
  {
    "id": 1,
    "campo": "valor"
  }
  ```
- **Erros esperados:**
  - `400`: Payload inválido
  - `401`: Não autenticado
  - `404`: Recurso não encontrado

## 5. Comportamento de Tela e UX (Frontend)
- **Telas/Rotas afetadas:** `src/app/...`
- **Estados obrigatórios:**
  - *Loading:* o que exibir enquanto busca/envia;
  - *Vazio:* o que exibir quando não há itens;
  - *Erro:* como avisar o usuário em falha de rede/API;
  - *Sucesso:* feedback visual / navegação.
- **`testID`s obrigatórios (para o QA / Maestro):**
  - `<feature>-<elemento>-button`
  - `<feature>-<elemento>-input`
  - `<feature>-<elemento>-list`

## 6. Critérios de Aceite (Roteiro do QA)
- [ ] **CA01 (API):** Enviar payload válido retorna `201` e persiste no banco.
- [ ] **CA02 (API):** Enviar payload sem campo obrigatório retorna `400`.
- [ ] **CA03 (App E2E):** Usuário toca em `<testID>`, preenche `<testID>` e vê `<texto/elemento esperado>` na tela.
