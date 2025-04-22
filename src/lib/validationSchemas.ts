import { z } from 'zod';

// Schema para validação de autenticação
export const loginSchema = z.object({
  email: z.string()
    .email('Digite um e-mail válido')
    .min(5, 'E-mail muito curto')
    .max(100, 'E-mail muito longo'),
  password: z.string()
    .min(6, 'A senha precisa ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa')
});

export const signupSchema = z.object({
  name: z.string()
    .min(3, 'O nome precisa ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'.-]+$/, 'Nome contém caracteres inválidos'),
  email: z.string()
    .email('Digite um e-mail válido')
    .min(5, 'E-mail muito curto')
    .max(100, 'E-mail muito longo'),
  password: z.string()
    .min(6, 'A senha precisa ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
  confirmPassword: z.string()
    .min(6, 'A confirmação de senha precisa ter pelo menos 6 caracteres')
})
.refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// Schema para tarefa
export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string()
    .min(1, 'O título é obrigatório')
    .max(255, 'O título deve ter no máximo 255 caracteres'),
  description: z.string()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres')
    .optional(),
  quadrant: z.number()
    .int('O quadrante deve ser um número inteiro')
    .min(1, 'O quadrante deve ser entre 1 e 4')
    .max(4, 'O quadrante deve ser entre 1 e 4'),
  completed: z.boolean().default(false),
  dueDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.number().int().min(1).max(5).optional(),
  userId: z.string().optional(),
});

// Schema para validação de configurações
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.boolean().default(true),
  language: z.string().min(2).max(5).default('pt-BR'),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().default(false),
});

// Schema para validação de categorias/tags
export const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, 'O nome da tag é obrigatório')
    .max(50, 'O nome da tag deve ter no máximo 50 caracteres'),
  color: z.string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Cor inválida')
    .optional(),
  userId: z.string().optional(),
});

// Schema para validação de pesquisa
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Digite algo para pesquisar')
    .max(100, 'Pesquisa muito longa'),
  filter: z.enum(['all', 'title', 'description', 'tags']).optional(),
  quadrant: z.number().int().min(1).max(4).optional(),
});

// Schema para validação de importação de dados
export const importSchema = z.object({
  format: z.enum(['json', 'csv', 'markdown']),
  data: z.string().min(1, 'Dados vazios'),
});

// Schema para validação de reset de senha
export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Digite um e-mail válido')
    .min(5, 'E-mail muito curto')
    .max(100, 'E-mail muito longo'),
}); 