
// Tipos para serviços de banco de dados
export interface Task {
  id?: string;
  title: string;
  description?: string;
  urgency: number;
  importance: number;
  quadrant: number;
  completed: boolean;
  created_at?: string;
  start_date?: string | null;
  completed_at?: string | null;
  tags?: string[];
  user_id?: string;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Outros tipos que podem ser necessários
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
}
