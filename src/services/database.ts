/**
 * Serviço para operações seguras com banco de dados
 * Encapsula as chamadas ao Supabase com validações de segurança
 */

import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, sanitizeTaskData } from '@/utils/security';
import { applyRateLimit } from '@/utils/rateLimiter';
import { addCsrfHeader } from '@/utils/csrfProtection';
import { taskSchema } from '@/lib/validationSchemas';
import type { PostgrestError } from '@supabase/supabase-js';

// Estrutura para respostas padronizadas
interface DatabaseResponse<T> {
  data: T | null;
  error: PostgrestError | Error | null;
  message?: string;
}

// Constantes para limite de taxa
const MAX_MUTATION_REQUESTS = 10; // por minuto
const MAX_QUERY_REQUESTS = 30;    // por minuto

/**
 * Busca todas as tarefas do usuário atual
 */
export const getTasks = async (userId: string): Promise<DatabaseResponse<any[]>> => {
  return applyRateLimit(
    'db:get-tasks',
    async () => {
      try {
        // Sanitizar entradas
        const sanitizedUserId = sanitizeInput(userId);
        
        // Aplicar query parametrizada
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('userId', sanitizedUserId)
          .order('createdAt', { ascending: false });
        
        return { data, error };
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        return { 
          data: null, 
          error: error instanceof Error ? error : new Error('Erro desconhecido')
        };
      }
    },
    MAX_QUERY_REQUESTS
  );
};

/**
 * Busca uma tarefa específica
 */
export const getTaskById = async (taskId: string, userId: string): Promise<DatabaseResponse<any>> => {
  return applyRateLimit(
    'db:get-task',
    async () => {
      try {
        // Sanitizar entradas
        const sanitizedTaskId = sanitizeInput(taskId);
        const sanitizedUserId = sanitizeInput(userId);
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', sanitizedTaskId)
          .eq('userId', sanitizedUserId)
          .single();
        
        return { data, error };
      } catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        return { 
          data: null, 
          error: error instanceof Error ? error : new Error('Erro desconhecido')
        };
      }
    },
    MAX_QUERY_REQUESTS
  );
};

/**
 * Cria uma nova tarefa
 */
export const createTask = async (taskData: any, userId: string): Promise<DatabaseResponse<any>> => {
  return applyRateLimit(
    'db:create-task',
    async () => {
      try {
        // Sanitizar e validar dados
        const sanitizedUserId = sanitizeInput(userId);
        const sanitizedTask = sanitizeTaskData(taskData);
        
        if (!sanitizedTask) {
          return { 
            data: null, 
            error: new Error('Dados inválidos') 
          };
        }
        
        // Validar com Zod
        try {
          taskSchema.parse({
            ...sanitizedTask,
            userId: sanitizedUserId
          });
        } catch (validationError) {
          return { 
            data: null, 
            error: validationError instanceof Error 
              ? validationError 
              : new Error('Erro de validação')
          };
        }
        
        // Criar no banco
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            ...sanitizedTask,
            userId: sanitizedUserId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .select()
          .single();
        
        return { data, error };
      } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        return { 
          data: null, 
          error: error instanceof Error ? error : new Error('Erro desconhecido')
        };
      }
    },
    MAX_MUTATION_REQUESTS
  );
};

/**
 * Atualiza uma tarefa existente
 */
export const updateTask = async (taskId: string, taskData: any, userId: string): Promise<DatabaseResponse<any>> => {
  return applyRateLimit(
    'db:update-task',
    async () => {
      try {
        // Sanitizar e validar dados
        const sanitizedTaskId = sanitizeInput(taskId);
        const sanitizedUserId = sanitizeInput(userId);
        const sanitizedTask = sanitizeTaskData(taskData);
        
        if (!sanitizedTask) {
          return { 
            data: null, 
            error: new Error('Dados inválidos') 
          };
        }
        
        // Verificar se o usuário é dono da tarefa
        const { data: existingTask, error: fetchError } = await supabase
          .from('tasks')
          .select('userId')
          .eq('id', sanitizedTaskId)
          .single();
        
        if (fetchError) {
          return { data: null, error: fetchError };
        }
        
        if (!existingTask || existingTask.userId !== sanitizedUserId) {
          return { 
            data: null, 
            error: new Error('Você não tem permissão para editar esta tarefa') 
          };
        }
        
        // Atualizar no banco
        const { data, error } = await supabase
          .from('tasks')
          .update({
            ...sanitizedTask,
            updatedAt: new Date().toISOString()
          })
          .eq('id', sanitizedTaskId)
          .eq('userId', sanitizedUserId) // Garantia dupla de segurança
          .select()
          .single();
        
        return { data, error };
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        return { 
          data: null, 
          error: error instanceof Error ? error : new Error('Erro desconhecido')
        };
      }
    },
    MAX_MUTATION_REQUESTS
  );
};

/**
 * Exclui uma tarefa
 */
export const deleteTask = async (taskId: string, userId: string): Promise<DatabaseResponse<any>> => {
  return applyRateLimit(
    'db:delete-task',
    async () => {
      try {
        // Sanitizar entradas
        const sanitizedTaskId = sanitizeInput(taskId);
        const sanitizedUserId = sanitizeInput(userId);
        
        // Verificar se o usuário é dono da tarefa
        const { data: existingTask, error: fetchError } = await supabase
          .from('tasks')
          .select('userId')
          .eq('id', sanitizedTaskId)
          .single();
        
        if (fetchError) {
          return { data: null, error: fetchError };
        }
        
        if (!existingTask || existingTask.userId !== sanitizedUserId) {
          return { 
            data: null, 
            error: new Error('Você não tem permissão para excluir esta tarefa') 
          };
        }
        
        // Excluir do banco
        const { data, error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', sanitizedTaskId)
          .eq('userId', sanitizedUserId) // Garantia dupla de segurança
          .select()
          .single();
        
        return { data, error };
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        return { 
          data: null, 
          error: error instanceof Error ? error : new Error('Erro desconhecido')
        };
      }
    },
    MAX_MUTATION_REQUESTS
  );
}; 