import { z } from 'zod';
import DOMPurify from 'dompurify';

/**
 * Sanitiza uma string de entrada para prevenir XSS e outros ataques
 */
export const sanitizeInput = (input: string): string => {
  // Primeiro sanitiza usando DOMPurify para prevenir XSS
  return DOMPurify.sanitize(input.trim());
};

/**
 * Sanitiza e valida um objeto inteiro usando Zod
 * @param data Dados a serem validados
 * @param schema Schema Zod para validação
 * @returns Dados validados e sanitizados, ou lança erro
 */
export function validateAndSanitize<T>(data: unknown, schema: z.ZodType<T>): T {
  return schema.parse(data);
}

/**
 * Interface para dados de tarefas
 */
interface TaskData {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Sanitiza objetos de tarefas antes de salvar
 */
export const sanitizeTaskData = (taskData: TaskData | null): TaskData | null => {
  if (!taskData) return null;
  
  return {
    ...taskData,
    title: taskData.title ? sanitizeInput(taskData.title) : '',
    description: taskData.description ? sanitizeInput(taskData.description) : '',
    // Preservar propriedades seguras como datas, booleanos, números, etc.
  };
};

/**
 * Limita o tamanho das entradas de texto
 */
export const limitInputLength = (input: string, maxLength = 255): string => {
  return input.slice(0, maxLength);
};

/**
 * Verifica se as credenciais são seguras (não são hardcoded)
 * @returns true se as credenciais vêm de variáveis de ambiente
 */
export const areCredentialsSecure = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Verificar se as variáveis de ambiente estão sendo usadas
  return Boolean(supabaseUrl && supabaseKey);
};

/**
 * Valida um token JWT
 * Esta é uma implementação simplificada - em produção deve usar bibliotecas específicas
 */
export const validateJwtToken = (token: string): boolean => {
  if (!token) return false;
  
  // Um token JWT tem 3 partes separadas por "."
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Tenta decodificar o payload (segunda parte)
    const payload = JSON.parse(atob(parts[1]));
    
    // Verifica expiração
    const expiry = payload.exp * 1000; // converte para milissegundos
    if (Date.now() >= expiry) return false;
    
    return true;
  } catch (e) {
    return false;
  }
}; 