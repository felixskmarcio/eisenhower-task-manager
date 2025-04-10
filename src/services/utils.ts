
import { z } from 'zod';
import { Task } from './types';

// Schema de validação para tarefas usando Zod
export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional().nullable(),
  urgency: z.number().min(1).max(10),
  importance: z.number().min(1).max(10),
  quadrant: z.number().min(1).max(4),
  completed: z.boolean(),
  created_at: z.string().optional(),
  start_date: z.string().optional().nullable(),
  completed_at: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  user_id: z.string().optional()
});

// Função para aplicar rate limiting
export const applyRateLimit = async <T>(
  key: string,
  fn: () => Promise<T>,
  maxRequests: number = 10
): Promise<T> => {
  // Implementação simples de rate limiting
  const now = Date.now();
  const rateKey = `ratelimit:${key}`;
  
  try {
    const rateData = localStorage.getItem(rateKey);
    let requests = rateData ? JSON.parse(rateData) : { count: 0, timestamp: now };
    
    // Reset contador se passou mais de 1 minuto
    if (now - requests.timestamp > 60000) {
      requests = { count: 0, timestamp: now };
    }
    
    // Verificar se excedeu limite
    if (requests.count >= maxRequests) {
      throw new Error(`Limite de requisições excedido para ${key}. Tente novamente em alguns segundos.`);
    }
    
    // Incrementar contador
    requests.count += 1;
    localStorage.setItem(rateKey, JSON.stringify(requests));
    
    // Executar função
    return await fn();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Limite de requisições')) {
      throw error;
    }
    console.error(`Erro ao aplicar rate limit para ${key}:`, error);
    throw error;
  }
};

// Constante para limite de requisições de mutação
export const MAX_MUTATION_REQUESTS = 20;

// Função para sanitizar input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Função para sanitizar dados de tarefa
export const sanitizeTaskData = (taskData: Partial<Task>): Partial<Task> | null => {
  if (!taskData) return null;
  
  try {
    const sanitized: Partial<Task> = {};
    
    if (taskData.title) sanitized.title = sanitizeInput(taskData.title);
    if (taskData.description) sanitized.description = sanitizeInput(taskData.description);
    if (typeof taskData.importance === 'number') sanitized.importance = Math.min(Math.max(1, taskData.importance), 10);
    if (typeof taskData.urgency === 'number') sanitized.urgency = Math.min(Math.max(1, taskData.urgency), 10);
    if (typeof taskData.quadrant === 'number') sanitized.quadrant = Math.min(Math.max(1, taskData.quadrant), 4);
    if (typeof taskData.completed === 'boolean') sanitized.completed = taskData.completed;
    if (taskData.tags && Array.isArray(taskData.tags)) {
      sanitized.tags = taskData.tags.map(tag => sanitizeInput(tag));
    }
    
    return sanitized;
  } catch (error) {
    console.error('Erro ao sanitizar dados da tarefa:', error);
    return null;
  }
};
