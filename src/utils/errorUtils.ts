import { AxiosError } from "axios";

// ============================================
// TIPOS DE RESPOSTA DE ERRO
// ============================================

/**
 * Formato de erro simples com mensagem
 * Exemplo: { message: "Erro ao processar" }
 */
export interface SimpleErrorResponse {
  message: string;
  [key: string]: any;
}

/**
 * Formato de erro com propriedade 'error'
 * Exemplo: { error: "Erro ao processar" }
 */
export interface ErrorPropertyResponse {
  error: string;
  [key: string]: any;
}

/**
 * Formato de erro com array de erros
 * Exemplo: [{ message: "Campo inválido" }, "Outro erro"]
 */
export type ArrayErrorResponse = Array<string | { message: string; [key: string]: any }>;

/**
 * Formato de erro com objeto 'errors'
 * Exemplo: { errors: ["Erro 1", "Erro 2"] }
 */
export interface ErrorsPropertyResponse {
  errors: Array<string | { message: string; [key: string]: any }>;
  [key: string]: any;
}

/**
 * Union de todos os formatos de erro possíveis
 */
export type ServerErrorResponse =
  | string
  | SimpleErrorResponse
  | ErrorPropertyResponse
  | ArrayErrorResponse
  | ErrorsPropertyResponse;

/**
 * Formato de resposta que vem do nosso serviço
 */
export interface ErrorMessage {
  message: string;
  type: "error" | "warning" | "info";
}

/**
 * Extrai a mensagem de erro de um objeto de resposta do servidor
 * @param data - Dados da resposta do servidor
 * @returns Mensagem de erro ou null se não encontrou
 */
function extractErrorMessage(data: ServerErrorResponse | any): string | null {
  if (!data) return null;

  // 1. data.message (string)
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  // 2. data.error (string)
  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  // 3. data é uma string
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  // 4. data é um array de strings ou objetos com message
  if (Array.isArray(data) && data.length > 0) {
    const firstError = data[0];
    if (typeof firstError === "string" && firstError.trim()) {
      return firstError;
    }
    if (typeof firstError === "object" && firstError?.message) {
      return firstError.message;
    }
  }

  // 5. data.errors é um array
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const firstError = data.errors[0];
    if (typeof firstError === "string" && firstError.trim()) {
      return firstError;
    }
    if (typeof firstError === "object" && firstError?.message) {
      return firstError.message;
    }
  }

  return null;
}

/**
 * Mapeia erros do Axios para mensagens amigáveis ao usuário
 * @param error - Erro capturado
 * @param context - Contexto da operação (ex: "buscar dados", "salvar")
 * @returns Mensagem amigável e tipo de notificação
 */
export function getErrorMessage(
  error: any,
  context: "fetch" | "save" | "update" | "delete" = "fetch"
): ErrorMessage {
  const axiosError = error as AxiosError;

  // Mensagens padrão por contexto
  const defaultMessages = {
    fetch: "Não conseguimos buscar os dados. Tente novamente.",
    save: "Não conseguimos salvar os dados. Tente novamente.",
    update: "Não conseguimos atualizar os dados. Tente novamente.",
    delete: "Não conseguimos deletar os dados. Tente novamente.",
  };

  // Se o servidor respondeu com uma mensagem de erro
  if (axiosError?.response?.data) {
    const errorMessage = extractErrorMessage(axiosError.response.data);
    if (errorMessage) {
      return {
        message: errorMessage,
        type: "error",
      };
    }

    // Fallback para statusText
    if (
      axiosError.response.statusText &&
      axiosError.response.statusText !== "Unknown" &&
      axiosError.response.statusText.trim()
    ) {
      return {
        message: axiosError.response.statusText,
        type: "error",
      };
    }
  }

  // Verificar código de status HTTP
  if (axiosError?.response?.status) {
    const status = axiosError.response.status;

    if (status === 400) {
      return {
        message: "Dados inválidos. Verifique e tente novamente.",
        type: "error",
      };
    }

    if (status === 401) {
      return {
        message: "Sua sessão expirou. Por favor, faça login novamente.",
        type: "error",
      };
    }

    if (status === 403) {
      return {
        message: "Você não tem permissão para realizar esta ação.",
        type: "error",
      };
    }

    if (status === 404) {
      return {
        message: "Recurso não encontrado. Tente novamente.",
        type: "error",
      };
    }

    if (status === 429) {
      return {
        message: "Muitas requisições. Aguarde um momento e tente novamente.",
        type: "warning",
      };
    }

    if (status >= 500) {
      return {
        message:
          "Nossos servidores estão temporariamente indisponíveis. Tente novamente em alguns momentos.",
        type: "error",
      };
    }
  }

  // Verificar tipo de erro de rede
  if (!axiosError?.response) {
    // Timeout
    if (axiosError?.code === "ECONNABORTED") {
      return {
        message: "A requisição levou muito tempo. Verifique sua conexão e tente novamente.",
        type: "error",
      };
    }

    // Sem conexão de rede
    if (
      error.message === "Network Error" ||
      axiosError?.code === "ERR_NETWORK" ||
      !navigator.onLine
    ) {
      return {
        message: "Sem conexão com a internet. Verifique sua conexão Wi-Fi ou dados móveis.",
        type: "error",
      };
    }

    // Erro de requisição abortada
    if (axiosError?.code === "ERR_CANCELLED") {
      return {
        message: "Requisição cancelada. Tente novamente.",
        type: "warning",
      };
    }
  }

  // Mensagem genérica baseada no contexto
  return {
    message: defaultMessages[context],
    type: "error",
  };
}
