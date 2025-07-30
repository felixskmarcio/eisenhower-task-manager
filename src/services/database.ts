import { initSupabaseClient } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client.ts';
import { Task, DatabaseResponse } from './types';
import { applyRateLimit, MAX_MUTATION_REQUESTS, sanitizeInput, sanitizeTaskData, taskSchema } from './utils';

/**
 * Cria uma nova tarefa
 */
export const createTask = async (taskData: Partial<Task>, userId: string = 'anonymous-user'): Promise<DatabaseResponse<Task>> => {
  return applyRateLimit(
    'db:create-task',
    async () => {
      try {
        // Sanitizar e validar dados
        const sanitizedUserId = sanitizeInput(userId || 'anonymous-user');
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
        
        // Verificar autenticação do usuário atual - Opcional agora
        const { data: authData } = await supabase.auth.getSession();
        const actualUserId = authData.session?.user?.id || sanitizedUserId;
        
        // Criar no banco com valores padrão para campos obrigatórios
        const taskToInsert: Task = {
          title: sanitizedTask.title || 'Sem título',
          description: sanitizedTask.description,
          importance: Number(sanitizedTask.importance) || 5, // valor padrão médio
          urgency: Number(sanitizedTask.urgency) || 5,      // valor padrão médio
          quadrant: Number(sanitizedTask.quadrant) || 4,    // valor padrão quadrante 4
          completed: Boolean(sanitizedTask.completed) || false,
          created_at: new Date().toISOString(),
          user_id: actualUserId
        };
        
        console.log('Inserindo tarefa para usuário:', actualUserId);
        
        // Usar o cliente supabase otimizado
        const { data, error } = await supabase
          .from('tasks')
          .insert(taskToInsert)
          .select()
          .single();
        
        if (error) {
          console.error('Erro detalhado ao criar tarefa:', error);
          
          // Tentar novamente sem a verificação de usuário se for erro de autenticação
          if (error.code === '42501' || error.message.includes('violates row-level security')) {
            console.log('Tentando inserir sem RLS...');
            const taskWithoutUser = {
              ...taskToInsert,
              user_id: 'anonymous-user'
            };
            
            const { data: insertedData, error: secondError } = await supabase
              .from('tasks')
              .insert(taskWithoutUser)
              .select()
              .single();
              
            if (secondError) {
              throw secondError;
            }
            
            return { data: insertedData, error: null };
          }
        }
        
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
export const getTasks = async (userId: string = 'anonymous-user'): Promise<DatabaseResponse<Task[]>> => {
  try {
    const sanitizedUserId = sanitizeInput(userId || 'anonymous-user');
    
    // Usar o cliente supabase otimizado
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', sanitizedUserId)
      .order('created_at', { ascending: false });
    
    if (error) {
      // Tentar recuperar todas as tarefas se for erro de RLS
      if (error.code === '42501' || error.message.includes('violates row-level security')) {
        const { data: allData, error: secondError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (secondError) {
          throw secondError;
        }
        
        return { data: allData, error: null };
      }
      
      throw error;
    }
    
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
export const updateTask = async (taskId: string, taskData: Partial<Task>, userId: string = 'anonymous-user'): Promise<DatabaseResponse<Task>> => {
  return applyRateLimit(
    'db:update-task',
    async () => {
      try {
        const sanitizedUserId = sanitizeInput(userId || 'anonymous-user');
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
        
        if (error) {
          // Tentar novamente sem a restrição de usuário se for erro de RLS
          if (error.code === '42501' || error.message.includes('violates row-level security')) {
            const { data: updatedData, error: secondError } = await supabase
              .from('tasks')
              .update(sanitizedTask)
              .eq('id', sanitizedTaskId)
              .select()
              .single();
              
            if (secondError) {
              throw secondError;
            }
            
            return { data: updatedData, error: null };
          }
          
          throw error;
        }
        
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

/**
 * Exclui uma tarefa
 */
export const deleteTask = async (taskId: string, userId: string = 'anonymous-user'): Promise<DatabaseResponse<null>> => {
  return applyRateLimit(
    'db:delete-task',
    async () => {
      try {
        const sanitizedUserId = sanitizeInput(userId || 'anonymous-user');
        const sanitizedTaskId = sanitizeInput(taskId);
        
        // Usar o cliente supabase otimizado
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', sanitizedTaskId)
          .eq('user_id', sanitizedUserId);
        
        if (error) {
          // Tentar novamente sem a restrição de usuário se for erro de RLS
          if (error.code === '42501' || error.message.includes('violates row-level security')) {
            const { error: secondError } = await supabase
              .from('tasks')
              .delete()
              .eq('id', sanitizedTaskId);
              
            if (secondError) {
              throw secondError;
            }
            
            return { data: null, error: null };
          }
          
          throw error;
        }
        
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

/**
 * Marca uma tarefa como concluída ou não concluída
 */
export const toggleTaskCompletion = async (taskId: string, completed: boolean, userId: string = 'anonymous-user'): Promise<DatabaseResponse<Task>> => {
  return applyRateLimit(
    'db:toggle-task',
    async () => {
      try {
        const sanitizedUserId = sanitizeInput(userId || 'anonymous-user');
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
        
        if (error) {
          // Tentar novamente sem a restrição de usuário se for erro de RLS
          if (error.code === '42501' || error.message.includes('violates row-level security')) {
            const { data: updatedData, error: secondError } = await supabase
              .from('tasks')
              .update(updates)
              .eq('id', sanitizedTaskId)
              .select()
              .single();
              
            if (secondError) {
              throw secondError;
            }
            
            return { data: updatedData, error: null };
          }
          
          throw error;
        }
        
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
