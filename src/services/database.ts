
import { initSupabaseClient } from '@/lib/supabase';
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
        const supabase = initSupabaseClient();
        
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
        
        const { data, error } = await supabase
          .from('tasks')
          .insert(taskToInsert)
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
