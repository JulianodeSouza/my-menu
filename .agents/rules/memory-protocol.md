---
trigger: always_on
---

# Protocolo de Memory Bank

Siga obrigatoriamente estas 3 etapas em todas as tarefas neste repositório:

1. **Leitura Prévia:** Antes de buscar ou abrir arquivos de código, leia os arquivos em `memory-bank/` (`arquitetura.md`, `decisoes.md` e `contexto-atual.md`) para entender o contexto do projeto, a localização dos módulos e as regras de negócio.
2. **Execução Cirúrgica:** Com base no mapa da arquitetura, abra e inspecione apenas os arquivos estritamente necessários para resolver a tarefa solicitada, evitando varreduras amplas desnecessárias no repositório.
3. **Auto-Memória Obrigatória:** Sempre que você criar, editar ou apagar qualquer arquivo de código no projeto, você DEVE, automaticamente e sem precisar que o usuário peça, atualizar `memory-bank/contexto-atual.md` (e `memory-bank/decisoes.md` caso haja nova decisão arquitetural, biblioteca ou regra de negócio) como último passo antes de finalizar sua resposta. Mantenha os resumos curtos, objetivos e organizados em tópicos.
