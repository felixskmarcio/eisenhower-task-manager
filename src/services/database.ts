
import { initSupabaseClient } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { Task, DatabaseResponse } from './types';
import { applyRateLimit, MAX_MUTATION_REQUESTS, sanitizeInput, sanitizeTaskData, taskSchema } from './utils';

/**
 * Cria uma nova tarefa
 */
export const createTask = async (taskData: Partial<Task>, userId: string): Promise<DatabaseResponse<Task>> => {
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
            user_id: sanitizedUserId
          });
        } catch (validationError) {
          return { 
            data: null, 
            error: validationError instanceof Error 
              ? validationError 
              : new Error('Erro de validação')
          };
        }
        
        // Criar no banco com valores padrão para campos obrigatórios
        const taskToInsert: Task = {
          title: sanitizedTask.title || 'Sem título',
          description: sanitizedTask.description,
          importance: Number(sanitizedTask.importance) || 5, // valor padrão médio
          urgency: Number(sanitizedTask.urgency) || 5,      // valor padrão médio
          quadrant: Number(sanitizedTask.quadrant) || 4,    // valor padrão quadrante 4
          completed: Boolean(sanitizedTask.completed) || false,
          created_at: new Date().toISOString(),
          user_id: sanitizedUserId
        };
        
        // Usar o cliente supabase otimizado
        const { data, error } = await supabase
          .from('tasks')
          .insert(taskToInsert)
          .select()
          .single();
        
        return { 
          data, 
          error: error ? new Error(error.message) : null 
        };
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
 * Busca todas as tarefas do usuário
 */
export const getTasks = async (userId: string): Promise<DatabaseResponse<Task[]>> => {
  try {
    const sanitizedUserId = sanitizeInput(userId);
    
    // Usar o cliente supabase otimizado
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', sanitizedUserId)
      .order('created_at', { ascending: false });
    
    return { 
      data, 
      error: error ? new Error(error.message) : null 
    };
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Erro desconhecido')
    };
  }
};

/**
 * Atualiza uma tarefa existente
 */
export const updateTask = async (taskId: string, taskData: Partial<Task>, userId: string): Promise<DatabaseResponse<Task>> => {
  return applyRateLimit(
    'db:update-task',
    async () => {
      try {
        const sanitizedUserId = sanitizeInput(userId);
        const sanitizedTaskId = sanitizeInput(taskId);
        const sanitizedTask = sanitizeTaskData(taskData);
        
        if (!sanitizedTask) {
          return { 
            data: null, 
            error: new Error('Dados inválidos') 
          };
        }
        
        // Usar o cliente supabase otimizado
        const { data, error } = await supabase
          .from('tasks')
          .update(sanitizedTask)
          .eq('id', sanitizedTaskId)
          .eq('user_id', sanitizedUserId)
          .select()
          .single();
        
        return { 
          data, 
          error: error ? new Error(error.message) : null 
        };
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
export const deleteTask = async (taskId: string, userId: string): Promise<DatabaseResponse<null>> => {
  return applyRateLimit(
    'db:delete-task',
    async () => {
      try {
        const sanitizedUserId = sanitizeInput(userId);
        const sanitizedTaskId = sanitizeInput(taskId);
        
        // Usar o cliente supabase otimizado
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', sanitizedTaskId)
          .eq('user_id', sanitizedUserId);
        
        return { 
          data: null, 
          error: error ? new Error(error.message) : null 
        };
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

/**
 * Marca uma tarefa como concluída ou não concluída
 */
export const toggleTaskCompletion = async (taskId: string, completed: boolean, userId: string): Promise<DatabaseResponse<Task>> => {
  return applyRateLimit(
    'db:toggle-task',
    async () => {
      try {
        const sanitizedUserId = sanitizeInput(userId);
        const sanitizedTaskId = sanitizeInput(taskId);
        
        const updates = {
          completed,
          completed_at: completed ? new Date().toISOString() : null
        };
        
        // Usar o cliente supabase otimizado
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', sanitizedTaskId)
          .eq('user_id', sanitizedUserId)
          .select()
          .single();
        
        return { 
          data, 
          error: error ? new Error(error.message) : null 
        };
      } catch (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
        return { 
          data: null, 
          error: error instanceof Error ? error : new Error('Erro desconhecido')
        };
      }
    },
    MAX_MUTATION_REQUESTS
  );
};
