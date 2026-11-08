# Fluxos de Teste E2E (Maestro) — my-menu

Este diretório contém os fluxos de testes de ponta a ponta (E2E) e usabilidade executados pelo **Maestro** no emulador Android ou aparelho físico.

- **App ID:** `com.mymenu` (definido em `app.config.ts`)
- **Emulador padrão:** `Pixel_9_Pro_Fold`

---

## 📋 Fluxos Disponíveis

1. **`shopping-list-flow.yaml`**: Testa o fluxo principal de usabilidade:
   - Abertura da home e carregamento da lista
   - Abertura do modal de adicionar produto via FAB
   - Preenchimento dos dados do item e gravação
   - Exibição do item agrupado por categoria
   - Marcação do item como pego
   - Ativação do botão de finalizar compra e registro de screenshot

2. **`settings-category-flow.yaml`**: Testa o fluxo de configurações:
   - Navegação da Home até a tela de Configurações
   - Abertura do modal de cadastro de categoria
   - Criação de uma nova categoria
   - Validação da persistência e exibição na listagem

---

## 🚀 Como Rodar os Testes

### 1. Iniciar o Emulador
Certifique-se de que o emulador está rodando:
```powershell
emulator -avd Pixel_9_Pro_Fold
# ou via canvas do Maestri:
# maestri portal create --simulator Pixel_9_Pro_Fold "Pixel"
```

### 2. Iniciar o Bundler / App
```powershell
# Inicia a API no repositório irmão api-my-menu (porta 21200)
npm run dev

# No my-menu:
npm start
```

### 3. Executar Todos os Fluxos
```powershell
maestro test .maestro/
```

### 4. Executar um Fluxo Específico
```powershell
maestro test .maestro/shopping-list-flow.yaml
maestro test .maestro/settings-category-flow.yaml
```

*(Com mais de um dispositivo conectado, adicione `--device <device_id>`)*
