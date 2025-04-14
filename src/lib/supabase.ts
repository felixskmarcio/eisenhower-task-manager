import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Tipos para as tabelas do Supabase
export interface Task {
  id: string;
  title: string;
  description?: string;
  urgency: number;
  importance: number;
  quadrant: number;
  completed: boolean;
  created_at: string;
  start_date?: string | null;
  completed_at?: string | null;
  tags?: string[];
  user_id?: string;
}

// Tipo para as tarefas locais que podem ter formato diferente
export interface LocalTask {
  id: string;
  title?: string;
  description?: string;
  urgency?: number;
  importance?: number;
  quadrant?: number;
  completed?: boolean;
  created_at?: string;
  createdAt?: Date | string;
  start_date?: string | null;
  startDate?: Date | string | null;
  completed_at?: string | null;
  completedAt?: Date | string | null;
  tags?: string[];
  user_id?: string;
  [key: string]: unknown;
}

// Inicializa o cliente Supabase com credenciais do localStorage ou variáveis de ambiente
export const initSupabaseClient = () => {
  try {
    // Tenta usar credenciais do localStorage primeiro
    const supabaseUrl = localStorage.getItem('supabaseUrl');
    const supabaseKey = localStorage.getItem('supabaseKey');
    
    if (supabaseUrl && supabaseKey) {
      console.log('Usando credenciais do Supabase do localStorage');
      return createClient(supabaseUrl, supabaseKey);
    }
    
    // Se não encontrar no localStorage, usa as variáveis de ambiente
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (envUrl && envKey) {
      console.log('Usando credenciais do Supabase das variáveis de ambiente');
      return createClient(envUrl, envKey);
    }
    
    // Se não encontrou em nenhum lugar, lança erro
    throw new Error('Credenciais do Supabase não encontradas. Configure no .env ou na interface de usuário.');
  } catch (error) {
    console.error('Erro ao inicializar cliente Supabase:', error);
    throw new Error('Não foi possível inicializar o cliente Supabase');
  }
};

// Cria a tabela tasks se ela não existir (observação: isso é simulado, no Supabase real
// você precisa criar a tabela pelo dashboard do Supabase)
export const setupDatabase = async () => {
  try {
    const supabase = initSupabaseClient();
    
    // No Supabase real, você criaria a tabela pelo dashboard ou SQL Editor
    // Este código apenas verifica se a tabela existe tentando acessá-la
    const { data, error } = await supabase.from('tasks').select('*').limit(1);
    
    if (error) {
      console.error('Erro ao verificar tabela tasks:', error);
      
      // Melhorar a mensagem de erro dependendo do tipo de erro
      if (error.code === 'PGRST116') {
        return {
          success: false,
          message: 'A tabela "tasks" não existe. Por favor, crie esta tabela no seu banco de dados Supabase.'
        };
      } else if (error.code === '401' || error.message.includes('Authentication')) {
        return {
          success: false,
          message: 'Erro de autenticação. Verifique se a chave API (anon key) está correta e tem permissões suficientes.'
        };
      } else if (error.code === '404' || error.message.includes('Not Found')) {
        return {
          success: false,
          message: 'URL do Supabase inválida ou projeto não encontrado. Verifique se a URL está correta.'
        };
      }
      
      return {
        success: false,
        message: `Erro ao acessar o Supabase: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: 'Conexão com o banco de dados estabelecida com sucesso.'
    };
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return {
      success: false,
      message: `Erro ao conectar com o Supabase: ${errorMessage}. Verifique suas credenciais e tente novamente.`
    };
  }
};

// CRUD para tarefas
// Buscar todas as tarefas
export const fetchTasks = async () => {
  try {
    const supabase = initSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return { data: null, error };
  }
};

// Adicionar uma tarefa
export const addTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
  try {
    const supabase = initSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          ...task,
          created_at: new Date().toISOString(),
        }
      ])
      .select();
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    return { data: null, error };
  }
};

// Sincronizar tarefas locais com o Supabase
export const syncTasks = async (localTasks: LocalTask[]) => {
  try {
    if (!localTasks || localTasks.length === 0) {
      console.log("Nenhuma tarefa local para sincronizar");
      return { 
        success: true, 
        syncedCount: 0,
        message: 'Nenhuma tarefa local para sincronizar.' 
      };
    }

    console.log("Iniciando sincronização de", localTasks.length, "tarefas");
    const supabase = initSupabaseClient();
    
    // Buscar tarefas existentes do Supabase
    const { data: existingTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*');
      
    if (fetchError) throw fetchError;

    const formattedTasks = formatTasksForSupabase(localTasks);
    console.log("Tarefas formatadas para sincronização:", formattedTasks);

    // Inserir todas as tarefas
    const { data: insertedData, error: insertError } = await supabase
      .from('tasks')
      .upsert(
        formattedTasks.map(task => ({
          ...task,
          id: task.id || generateUUID(), // Garante um UUID válido
          created_at: task.created_at || new Date().toISOString()
        })),
        { onConflict: 'id' } // Atualiza se já existir
      )
      .select();
      
    if (insertError) throw insertError;
    
    console.log("Sincronização concluída:", insertedData?.length || 0, "tarefas sincronizadas");
    
    return { 
      success: true, 
      syncedCount: insertedData?.length || 0,
      message: `${insertedData?.length || 0} tarefas sincronizadas com sucesso.`
    };
  } catch (error) {
    console.error('Erro ao sincronizar tarefas:', error);
    return { 
      success: false, 
      syncedCount: 0,
      message: error instanceof Error ? error.message : 'Erro ao sincronizar tarefas.'
    };
  }
};

// Atualizar uma tarefa
export const updateTask = async (id: string, updates: Partial<Task>) => {
  try {
    const supabase = initSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return { data: null, error };
  }
};

// Marcar tarefa como concluída
export const completeTask = async (id: string, completed: boolean) => {
  try {
    const supabase = initSupabaseClient();
    const updates = {
      completed,
      completed_at: completed ? new Date().toISOString() : null
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao marcar tarefa como concluída:', error);
    return { data: null, error };
  }
};

// Excluir uma tarefa
export const deleteTask = async (id: string) => {
  try {
    const supabase = initSupabaseClient();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return { success: false, error };
  }
};

// Função para gerar UUIDs válidos
function generateUUID(): string {
  return uuidv4(); // Usamos a biblioteca uuid para maior confiabilidade
}

// Verifica se uma string é um UUID válido
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Modificar a função formatTasksForSupabase para incluir o ID do usuário
function formatTasksForSupabase(localTasks: LocalTask[]): Task[] {
  return localTasks.map(task => {
    // Garantir que temos um ID de tarefa válido
    let taskId = task.id;
    
    // Verificar se o ID é um UUID válido
    if (!isValidUUID(taskId)) {
      // Se não for válido, gerar um novo
      taskId = generateUUID();
      console.log(`ID inválido "${task.id}" substituído por UUID válido: ${taskId}`);
    }
    
    // Preparar o created_at como string
    let created_at = typeof task.created_at === 'string' 
      ? task.created_at 
      : new Date().toISOString();
      
    // Se tiver createdAt, usar esse valor convertendo para string se necessário
    if (task.createdAt) {
      created_at = task.createdAt instanceof Date 
        ? task.createdAt.toISOString() 
        : String(task.createdAt);
    }
    
    // Preparar o completed_at como string ou null
    let completed_at = task.completed_at || null;
    
    // Se tiver completedAt, usar esse valor convertendo para string se necessário
    if (task.completedAt) {
      completed_at = task.completedAt instanceof Date 
        ? task.completedAt.toISOString() 
        : String(task.completedAt);
    }
    
    // Garantir que os campos numéricos sejam realmente números
    const urgency = typeof task.urgency === 'number' ? task.urgency : 
                   (task.urgency ? Number(task.urgency) : 5);
                   
    const importance = typeof task.importance === 'number' ? task.importance : 
                      (task.importance ? Number(task.importance) : 5);
                      
    const quadrant = typeof task.quadrant === 'number' ? task.quadrant : 
                    (task.quadrant ? Number(task.quadrant) : 4);
    
    // Garantir que os campos obrigatórios estão presentes
    const formattedTask: Task = {
      id: taskId,
      title: task.title || 'Sem título',
      description: task.description || null,
      urgency: urgency,
      importance: importance,
      quadrant: quadrant,
      completed: Boolean(task.completed),
      created_at,
      completed_at,
      tags: Array.isArray(task.tags) ? task.tags : [],
      user_id: task.user_id
    };
    
    return formattedTask;
  });
}
