import { supabase } from '@/integrations/supabase/client';
import { Task, DatabaseResponse } from './types';
import { applyRateLimit, MAX_MUTATION_REQUESTS, sanitizeInput, sanitizeTaskData, taskSchema } from './utils';
import { logTaskAction, logAccessDenied } from './audit';

const validateUserId = (userId: string | undefined | null): { valid: boolean; sanitizedId: string; error?: string } => {
  if (!userId || userId === 'anonymous-user' || userId.trim() === '') {
    return { valid: false, sanitizedId: '', error: 'Usuário não autenticado' };
  }
  
  const sanitized = sanitizeInput(userId);
  if (sanitized.length < 10) {
    return { valid: false, sanitizedId: '', error: 'ID de usuário inválido' };
  }
  
  return { valid: true, sanitizedId: sanitized };
};

export const createTask = async (taskData: Partial<Task>, userId: string): Promise<DatabaseResponse<Task>> => {
  const userValidation = validateUserId(userId);
  
  if (!userValidation.valid) {
    await logAccessDenied(userId || 'unknown', 'tasks', 'CREATE');
    return { 
      data: null, 
      error: new Error(userValidation.error || 'Usuário não autorizado') 
    };
  }
  
  return applyRateLimit(
    'db:create-task',
    async () => {
      try {
        const sanitizedTask = sanitizeTaskData(taskData);
        
        if (!sanitizedTask) {
          return { 
            data: null, 
            error: new Error('Dados inválidos') 
          };
        }
        
        try {
          taskSchema.parse({
            ...sanitizedTask,
            user_id: userValidation.sanitizedId
          });
        } catch (validationError) {
          return { 
            data: null, 
            error: validationError instanceof Error 
              ? validationError 
              : new Error('Erro de validação')
          };
        }
        
        const taskToInsert: Task = {
          title: sanitizedTask.title || 'Sem título',
          description: sanitizedTask.description,
          importance: Number(sanitizedTask.importance) || 5,
          urgency: Number(sanitizedTask.urgency) || 5,
          quadrant: Number(sanitizedTask.quadrant) || 4,
          completed: Boolean(sanitizedTask.completed) || false,
          created_at: new Date().toISOString(),
          user_id: userValidation.sanitizedId
        };
        
        console.log('Inserindo tarefa para usuário:', userValidation.sanitizedId);
        
        const { data, error } = await supabase
          .from('tasks')
          .insert(taskToInsert)
          .select()
          .single();
        
        if (error) {
          console.error('Erro ao criar tarefa:', error);
          return { 
            data: null, 
            error: new Error(error.message) 
          };
        }
        
        await logTaskAction(userValidation.sanitizedId, 'CREATE', data.id, undefined, taskToInsert as unknown as Record<string, unknown>);
        
        return { 
          data, 
          error: null 
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

export const getTasks = async (userId: string): Promise<DatabaseResponse<Task[]>> => {
  const userValidation = validateUserId(userId);
  
  if (!userValidation.valid) {
    console.warn('Tentativa de buscar tarefas sem autenticação válida');
    return { 
      data: [], 
      error: null 
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userValidation.sanitizedId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar tarefas:', error);
      return { 
        data: null, 
        error: new Error(error.message) 
      };
    }
    
    return { 
      data: data || [], 
      error: null 
    };
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Erro desconhecido')
    };
  }
};

export const updateTask = async (taskId: string, taskData: Partial<Task>, userId: string): Promise<DatabaseResponse<Task>> => {
  const userValidation = validateUserId(userId);
  
  if (!userValidation.valid) {
    await logAccessDenied(userId || 'unknown', 'tasks', 'UPDATE');
    return { 
      data: null, 
      error: new Error(userValidation.error || 'Usuário não autorizado') 
    };
  }
  
  return applyRateLimit(
    'db:update-task',
    async () => {
      try {
        const sanitizedTaskId = sanitizeInput(taskId);
        const sanitizedTask = sanitizeTaskData(taskData);
        
        if (!sanitizedTask) {
          return { 
            data: null, 
            error: new Error('Dados inválidos') 
          };
        }
        
        const { data: existingTask } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', sanitizedTaskId)
          .eq('user_id', userValidation.sanitizedId)
          .single();
        
        if (!existingTask) {
          await logAccessDenied(userValidation.sanitizedId, 'tasks', `UPDATE:${sanitizedTaskId}`);
          return { 
            data: null, 
            error: new Error('Tarefa não encontrada ou acesso negado') 
          };
        }
        
        const { data, error } = await supabase
          .from('tasks')
          .update(sanitizedTask)
          .eq('id', sanitizedTaskId)
          .eq('user_id', userValidation.sanitizedId)
          .select()
          .single();
        
        if (error) {
          console.error('Erro ao atualizar tarefa:', error);
          return { 
            data: null, 
            error: new Error(error.message) 
          };
        }
        
        await logTaskAction(
          userValidation.sanitizedId, 
          'UPDATE', 
          sanitizedTaskId, 
          existingTask as unknown as Record<string, unknown>, 
          data as unknown as Record<string, unknown>
        );
        
        return { 
          data, 
          error: null 
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

export const deleteTask = async (taskId: string, userId: string): Promise<DatabaseResponse<null>> => {
  const userValidation = validateUserId(userId);
  
  if (!userValidation.valid) {
    await logAccessDenied(userId || 'unknown', 'tasks', 'DELETE');
    return { 
      data: null, 
      error: new Error(userValidation.error || 'Usuário não autorizado') 
    };
  }
  
  return applyRateLimit(
    'db:delete-task',
    async () => {
      try {
        const sanitizedTaskId = sanitizeInput(taskId);
        
        const { data: existingTask } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', sanitizedTaskId)
          .eq('user_id', userValidation.sanitizedId)
          .single();
        
        if (!existingTask) {
          await logAccessDenied(userValidation.sanitizedId, 'tasks', `DELETE:${sanitizedTaskId}`);
          return { 
            data: null, 
            error: new Error('Tarefa não encontrada ou acesso negado') 
          };
        }
        
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', sanitizedTaskId)
          .eq('user_id', userValidation.sanitizedId);
        
        if (error) {
          console.error('Erro ao excluir tarefa:', error);
          return { 
            data: null, 
            error: new Error(error.message) 
          };
        }
        
        await logTaskAction(
          userValidation.sanitizedId, 
          'DELETE', 
          sanitizedTaskId, 
          existingTask as unknown as Record<string, unknown>
        );
        
        return { 
          data: null, 
          error: null 
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

export const toggleTaskCompletion = async (taskId: string, completed: boolean, userId: string): Promise<DatabaseResponse<Task>> => {
  const userValidation = validateUserId(userId);
  
  if (!userValidation.valid) {
    await logAccessDenied(userId || 'unknown', 'tasks', 'UPDATE');
    return { 
      data: null, 
      error: new Error(userValidation.error || 'Usuário não autorizado') 
    };
  }
  
  return applyRateLimit(
    'db:toggle-task',
    async () => {
      try {
        const sanitizedTaskId = sanitizeInput(taskId);
        
        const updates = {
          completed,
          completed_at: completed ? new Date().toISOString() : null
        };
        
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', sanitizedTaskId)
          .eq('user_id', userValidation.sanitizedId)
          .select()
          .single();
        
        if (error) {
          console.error('Erro ao atualizar status da tarefa:', error);
          return { 
            data: null, 
            error: new Error(error.message) 
          };
        }
        
        if (!data) {
          await logAccessDenied(userValidation.sanitizedId, 'tasks', `TOGGLE:${sanitizedTaskId}`);
          return { 
            data: null, 
            error: new Error('Tarefa não encontrada ou acesso negado') 
          };
        }
        
        await logTaskAction(
          userValidation.sanitizedId, 
          'UPDATE', 
          sanitizedTaskId, 
          undefined, 
          { completed, completed_at: updates.completed_at }
        );
        
        return { 
          data, 
          error: null 
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

export const getTaskById = async (taskId: string, userId: string): Promise<DatabaseResponse<Task>> => {
  const userValidation = validateUserId(userId);
  
  if (!userValidation.valid) {
    return { 
      data: null, 
      error: new Error(userValidation.error || 'Usuário não autorizado') 
    };
  }
  
  try {
    const sanitizedTaskId = sanitizeInput(taskId);
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', sanitizedTaskId)
      .eq('user_id', userValidation.sanitizedId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar tarefa:', error);
      return { 
        data: null, 
        error: new Error(error.message) 
      };
    }
    
    return { 
      data, 
      error: null 
    };
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Erro desconhecido')
    };
  }
};
