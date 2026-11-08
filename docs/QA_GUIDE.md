# Guia de Testes de Usabilidade e QA — my-menu

Este documento é o roteiro oficial para o **Agente de QA** (e desenvolvedores) realizarem a validação de ponta a ponta (E2E), usabilidade e regressão no aplicativo móvel `my-menu`.

---

## 1. Visão Geral da Arquitetura de Testes

- **App Mobile:** React Native 0.86 / Expo 57 (`com.mymenu`).
- **Automação E2E:** [Maestro](https://maestro.mobile.dev/).
- **Automação no Canvas Maestri:** `maestri portal` (permite snapshots, taps e inspecionar árvore de acessibilidade no emulador).
- ** Backend:** A porta que o backend está rodando está definida na variável de ambiente `API_PORT` do arquivo `.env` do projeto do backend, consulte o agente `backend` para saber o valor correto.
- **Backend Consumido:** `http://10.0.2.2:${process.env.API_PORT}` (quando no emulador Android, apontando para `localhost:process.env.API_PORT` do Windows).

---

## 2. Checklist Pré-Voo do Agente de QA

Antes de iniciar qualquer teste, o Agente de QA deve validar:

1. **Backend Ativo:**
   - Testar se a API responde na porta definida pela variável `API_PORT`:
     ```powershell
     curl.exe -s http://localhost:${process.env.API_PORT}/health
     ```
2. **Emulador Android Operacional:**
   - Verificar se há dispositivo conectado:
     ```powershell
     adb devices
     ```
   - Caso nenhum esteja rodando, iniciar o AVD:
     ```powershell
     emulator -avd Pixel_9_Pro_Fold
     ```
     _(Ou via portal do Maestri: `maestri portal create --simulator Pixel_9_Pro_Fold "Pixel"`)_
3. **App Instalado:**
   - O pacote `com.mymenu` deve estar instalado no emulador.
4. **Variáveis e Specs:**
   - Conferir as especificações da funcionalidade em `docs/specs/<feature>.md`.

---

## 3. Dicionário Oficial de `testID`s

Para que os testes do Maestro ou inspeção por snapshot funcionem de forma determinística, use estes identificadores:

### Navegação e Header

| `testID`              | Elemento      | Descrição                                    |
| :-------------------- | :------------ | :------------------------------------------- |
| `header-btn-settings` | Botão / Ícone | Botão de engrenagem para abrir configurações |

### Tela Principal (Lista de Compras)

| `testID`                       | Elemento       | Descrição                                             |
| :----------------------------- | :------------- | :---------------------------------------------------- |
| `shoplist-container`           | View           | Container da tela principal                           |
| `shoplist-empty-state`         | View           | Estado vazio quando não há itens na lista             |
| `shoplist-status-card`         | View           | Card do topo com total monetário e barra de progresso |
| `shoplist-btn-add-item`        | FloatingButton | Botão flutuante (+) para cadastrar novo item          |
| `shoplist-btn-finish-purchase` | Button         | Botão "Finalizar compra" no rodapé                    |

### Modal de Cadastro / Edição de Item (`DialogItem`)

| `testID`                          | Elemento          | Descrição                    |
| :-------------------------------- | :---------------- | :--------------------------- |
| `shoplist-dialog-item`            | SheetModal        | Modal de formulário do item  |
| `shoplist-form-input-name`        | TextInput         | Campo do nome do produto     |
| `shoplist-form-input-quantity`    | TextInput         | Campo da quantidade          |
| `shoplist-form-input-amount`      | TextInput         | Campo monetário de preço     |
| `shoplist-form-select-category`   | Pressable / Modal | Seletor de categoria         |
| `shoplist-form-select-unit`       | Pressable / Modal | Seletor de unidade de medida |
| `shoplist-form-btn-save`          | Button            | Botão "Salvar"               |
| `shoplist-form-btn-save-continue` | Button            | Botão "Salvar e continuar"   |

### Lista e Itens (`CardItemsList`)

| `testID`                   | Elemento    | Descrição                                                 |
| :------------------------- | :---------- | :-------------------------------------------------------- |
| `shoplist-category-card`   | CardShop    | Card de agrupamento da categoria (clicável para expandir) |
| `shoplist-item-checkbox`   | RadioButton | Checkbox para marcar o item como pego                     |
| `shoplist-item-btn-edit`   | Button      | Botão com ícone de lápis para editar o item               |
| `shoplist-item-btn-delete` | Button      | Botão com ícone de lixeira para excluir o item            |

### Tela de Configurações (`settings`)

| `testID`                       | Elemento  | Descrição                          |
| :----------------------------- | :-------- | :--------------------------------- |
| `settings-screen`              | View      | Container da tela de configurações |
| `settings-theme-option-light`  | Pressable | Opção tema Claro                   |
| `settings-theme-option-dark`   | Pressable | Opção tema Escuro                  |
| `settings-category-btn-add`    | Button    | Botão "+ Adicionar" categoria      |
| `settings-category-input-name` | TextInput | Campo do nome da nova categoria    |
| `settings-category-btn-save`   | Button    | Botão "Salvar" categoria           |
| `settings-category-btn-cancel` | Button    | Botão "Cancelar" categoria         |

---

## 4. Execução dos Testes com Maestro

O Agente de QA deve executar:

```powershell
# Executar a suíte inteira:
maestro test .maestro/

# Executar fluxo individual:
maestro test .maestro/shopping-list-flow.yaml
```

### Se o teste falhar:

1. O Maestro salva a screenshot no local indicado no arquivo `.yaml` (ou na pasta de saída do Maestro).
2. O agente deve capturar os logs recentes com:
   ```powershell
   adb logcat -d -t 150 *:E
   ```
3. O agente deve reportar no formato obrigatório (abaixo).

---

## 5. Formato do Relatório de QA

O Agente de QA deve reportar sempre a entrega neste padrão:

```markdown
### 📋 Relatório de Testes E2E e Usabilidade

- **Ambiente:** Emulador Android (Pixel_9_Pro_Fold), Android SDK, Backend v1.0 (porta 21200)
- **Status Geral:** ✅ Aprovado | ❌ Falha

#### Cenários Testados:

- [x] **CA01 - Fluxo de Lista de Compras:** Adição de produto, agrupamento em categoria, marcação de item e finalização da compra.
- [x] **CA02 - Gestão de Categorias:** Navegação para configurações e persistência de nova categoria.

#### Evidências:

- Screenshots: `.maestro/evidencia-lista-compra-sucesso.png`
- Logs: Sem erros detectados no Logcat.

#### Parecer:

A funcionalidade cumpre todos os critérios de aceite definidos na especificação.
```
