/**
 * Biblioteca para logging centralizado de erros na aplicação
 */
export enum ErrorType {
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  VALIDATION = 'validation',
  NETWORK = 'network',
  RENDER = 'render',
  UNKNOWN = 'unknown'
}

export interface ErrorLogOptions {
  type: ErrorType;
  code?: string;
  details?: Record<string, unknown>;
  context?: Record<string, unknown>;
  isFatal?: boolean;
}

// Interface para futura integração com serviços de log
export interface ErrorLogService {
  log(error: Error, options: ErrorLogOptions): Promise<void>;
}

// Serviço de log básico para console
class ConsoleErrorLogger implements ErrorLogService {
  async log(error: Error, options: ErrorLogOptions): Promise<void> {
    const timestamp = new Date().toISOString();
    const errorLog = {
      timestamp,
      type: options.type,
      code: options.code || 'unknown_error',
      message: error.message,
      stack: error.stack,
      details: options.details || {},
      context: options.context || {},
      isFatal: options.isFatal || false
    };

    // Log no console para desenvolvimento
    console.group(`[ERROR] ${options.type.toUpperCase()} - ${timestamp}`);
    console.error('Error:', error.message);
    if (options.code) console.error('Code:', options.code);
    if (options.details) console.error('Details:', options.details);
    if (options.context) console.log('Context:', options.context);
    console.error('Stack:', error.stack);
    console.groupEnd();

    // Armazenar log no localStorage para debug/desenvolvimento
    this.storeErrorLog(errorLog);
  }

  private storeErrorLog(errorLog: Record<string, unknown>): void {
    try {
      const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      
      // Limitar a 50 erros para não ocupar muito espaço
      if (errorLogs.length >= 50) {
        errorLogs.pop(); // Remove o mais antigo
      }
      
      errorLogs.unshift(errorLog); // Adiciona o novo no início
      localStorage.setItem('errorLogs', JSON.stringify(errorLogs));
    } catch (error) {
      console.error('Falha ao salvar log de erro no localStorage:', error);
    }
  }
}

// Serviço para enviar logs para servidor (mock para futura implementação)
class ServerErrorLogger implements ErrorLogService {
  async log(error: Error, options: ErrorLogOptions): Promise<void> {
    // No futuro, implementar envio para serviço de log como Sentry, LogRocket, etc.
    // Por enquanto, apenas loga no console
    if (options.isFatal || options.type === ErrorType.AUTH || options.type === ErrorType.API) {
      console.info('Enviando log para o servidor (simulação):', {
        error: error.message,
        type: options.type,
        code: options.code
      });
    }
  }
}

// Lista de serviços de log
const errorLogServices: ErrorLogService[] = [
  new ConsoleErrorLogger(),
  new ServerErrorLogger()
];

/**
 * Registra um erro em todos os serviços de log configurados
 */
export async function logError(error: Error, options: ErrorLogOptions): Promise<void> {
  // Registra o erro em todos os serviços
  await Promise.all(
    errorLogServices.map(service => service.log(error, options))
  );
}

/**
 * Recupera todos os logs de erro armazenados no localStorage
 */
export function getErrorLogs(): Record<string, unknown>[] {
  try {
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  } catch {
    return [];
  }
}

/**
 * Limpa todos os logs de erro armazenados no localStorage
 */
export function clearErrorLogs(): void {
  localStorage.removeItem('errorLogs');
}

export default {
  logError,
  getErrorLogs,
  clearErrorLogs,
  ErrorType
}; 