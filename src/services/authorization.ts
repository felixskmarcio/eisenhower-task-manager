import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'ADM' | 'USER';

export interface UserProfile {
  id: string;
  nome: string | null;
  email: string | null;
  foto_url: string | null;
  role: UserRole;
  active: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Erro ao verificar permissão de admin:', error);
      return false;
    }

    return (data as any).role === 'ADM';
  } catch (error) {
    console.error('Erro ao verificar permissão de admin:', error);
    return false;
  }
};

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return ((data as any).role as UserRole) || 'USER';
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    role?: UserRole | '';
    active?: boolean | null;
  },
  sortBy: string = 'criado_em',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ users: UserProfile[]; total: number }> => {
  try {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (filters?.search) {
      query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    let filteredData = data || [];
    
    if (filters?.role) {
      filteredData = filteredData.filter((u: any) => u.role === filters.role);
    }
    
    if (filters?.active !== null && filters?.active !== undefined) {
      filteredData = filteredData.filter((u: any) => u.active === filters.active);
    }

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return { users: [], total: 0 };
    }

    const users = filteredData.map((user: any) => ({
      ...user,
      role: user.role || 'USER',
      active: user.active !== false,
    }));

    return { users, total: count || 0 };
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return { users: [], total: 0 };
  }
};

export const createUser = async (userData: {
  email: string;
  nome: string;
  senha: string;
  role: UserRole;
}): Promise<{ success: boolean; error?: string; userId?: string }> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.senha,
      options: {
        data: {
          nome: userData.nome,
          role: userData.role,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: userData.email,
          nome: userData.nome,
          role: userData.role as any,
          active: true as any,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        } as any);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
      }

      return { success: true, userId: authData.user.id };
    }

    return { success: false, error: 'Erro desconhecido ao criar usuário' };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<{
    nome: string;
    email: string;
    role: UserRole;
    active: boolean;
  }>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const updateData: any = {
      ...userData,
      atualizado_em: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
};

export const deactivateUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  return updateUser(userId, { active: false });
};

export const activateUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  return updateUser(userId, { active: true });
};

export const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  return deactivateUser(userId);
};
