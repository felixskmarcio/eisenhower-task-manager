/**
 * Sistema de registro e gerenciamento de erros
 * 
 * Esta biblioteca fornece funções para registrar, formatar e analisar erros
 * em toda a aplicação, permitindo uma experiência unificada de tratamento de erros.
 */

// Tipos de erros
export enum ErrorType {
  API = 'api_error',
  NETWORK = 'network_error',
  VALIDATION = 'validation_error',
  AUTH = 'authentication_error',
  DATABASE = 'database_error',
  UNKNOWN = 'unknown_error'
}

// Interface para erros estruturados
export interface ErrorDetails {
  type: ErrorType;
  code?: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  timestamp: string;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    [key: string]: any;
  };
}

// Armazenamento de erros em memória (para debug e análise)
const errorHistory: ErrorDetails[] = [];
const MAX_ERROR_HISTORY = 20;

/**
 * Registra um erro no sistema
 */
export function logError(error: Error | string, options: {
  type?: ErrorType;
  code?: string;
  details?: Record<string, unknown>;
  context?: Record<string, any>;
}): ErrorDetails {
  const errorType = options.type || ErrorType.UNKNOWN;
  
  // Formatar o erro
  const errorDetails: ErrorDetails = {
    type: errorType,
    code: options.code,
    message: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'string' ? undefined : error.stack,
    details: options.details,
    timestamp: new Date().toISOString(),
    context: options.context
  };
  
  // Adicionar ao histórico
  errorHistory.unshift(errorDetails);
  if (errorHistory.length > MAX_ERROR_HISTORY) {
    errorHistory.pop();
  }
  
  // Log no console
  console.error(`[${errorType}]${options.code ? ` [${options.code}]` : ''} ${errorDetails.message}`);
  if (errorDetails.stack) {
    console.error(errorDetails.stack);
  }
  
  // Opcionalmente, enviar para um serviço de log externo
  if (process.env.NODE_ENV === 'production') {
    // sendToLogService(errorDetails);
  }
  
  return errorDetails;
}

/**
 * Recupera o histórico de erros
 */
export function getErrorHistory(): ErrorDetails[] {
  return [...errorHistory];
}

/**
 * Limpa o histórico de erros
 */
export function clearErrorHistory(): void {
  errorHistory.length = 0;
}

/**
 * Formata um erro para exibição
 */
export function formatErrorForDisplay(errorDetails: ErrorDetails): string {
  let formattedError = `Erro: ${errorDetails.message}\n`;
  
  if (errorDetails.code) {
    formattedError += `Código: ${errorDetails.code}\n`;
  }
  
  if (errorDetails.details) {
    formattedError += `\nDetalhes:\n${JSON.stringify(errorDetails.details, null, 2)}\n`;
  }
  
  if (errorDetails.stack) {
    formattedError += `\nStack Trace:\n${errorDetails.stack}\n`;
  }
  
  return formattedError;
}

/**
 * Formata um erro para clipboard
 */
export function formatErrorForClipboard(errorDetails: ErrorDetails): string {
  return `ERRO: ${errorDetails.message}
TIPO: ${errorDetails.type}${errorDetails.code ? `\nCÓDIGO: ${errorDetails.code}` : ''}
TIMESTAMP: ${errorDetails.timestamp}
${errorDetails.context ? `\nCONTEXTO:\n${JSON.stringify(errorDetails.context, null, 2)}` : ''}
${errorDetails.details ? `\nDETALHES:\n${JSON.stringify(errorDetails.details, null, 2)}` : ''}
${errorDetails.stack ? `\nSTACK TRACE:\n${errorDetails.stack}` : ''}`;
}

/**
 * Copia um erro para a área de transferência
 */
export function copyErrorToClipboard(errorDetails: ErrorDetails): Promise<void> {
  const formattedError = formatErrorForClipboard(errorDetails);
  return navigator.clipboard.writeText(formattedError);
}

export default {
  logError,
  getErrorHistory,
  clearErrorHistory,
  formatErrorForDisplay,
  formatErrorForClipboard,
  copyErrorToClipboard,
  ErrorType
}; 