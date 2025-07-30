/**
 * Tipos TypeScript para autenticação
 * Fornece type safety para erros de autenticação e estados do usuário
 */

// Códigos de erro padronizados para autenticação
export type AuthErrorCode = 
  | 'invalid_credentials'
  | 'user_not_found'
  | 'email_not_confirmed'
  | 'too_many_requests'
  | 'unknown_error'
  | 'auth/invalid-credential'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/too-many-requests'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/popup-closed-by-user'
  | 'auth/popup-blocked'
  | 'auth/unauthorized-domain'
  | 'auth/operation-not-allowed';

// Interface para erro de autenticação normalizado
export interface NormalizedAuthError {
  code: AuthErrorCode;
  message: string;
  originalError?: any;
}

// Interface para resultado de verificação de credenciais
export interface CredentialVerificationResult {
  valid: boolean;
  message: string;
  errorCode?: AuthErrorCode;
}

// Interface para estado de login
export interface LoginState {
  email: string;
  errorCode?: AuthErrorCode;
  errorMessage?: string;
  isLoading?: boolean;
}

// Interface para perfil do usuário
export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  foto_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para dados de cadastro
export interface SignUpData {
  email: string;
  password: string;
  nome: string;
}

// Interface para dados de login
export interface SignInData {
  email: string;
  password: string;
}

// Interface para resultado de autenticação
export interface AuthResult {
  success: boolean;
  user?: any;
  profile?: UserProfile;
  error?: NormalizedAuthError;
}

// Interface para configurações de autenticação
export interface AuthConfig {
  enableSupabase: boolean;
  enableFirebase: boolean;
  enableGoogleAuth: boolean;
  passwordMinLength: number;
  maxLoginAttempts: number;
  lockoutDuration: number; // em minutos
}

// Interface para contexto de autenticação (estendida)
export interface ExtendedAuthContextType {
  user: any | null;
  profile: UserProfile | null;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signIn: (data: SignInData) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyUserCredentials: (email: string, password: string) => Promise<CredentialVerificationResult>;
  loading: boolean;
  lastError?: NormalizedAuthError;
}

// Tipos para validação de entrada
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EmailValidation extends ValidationResult {
  email?: string;
}

export interface PasswordValidation extends ValidationResult {
  strength?: 'weak' | 'medium' | 'strong';
}

// Tipos para eventos de autenticação
export type AuthEventType = 
  | 'sign_in_success'
  | 'sign_in_error'
  | 'sign_up_success'
  | 'sign_up_error'
  | 'sign_out'
  | 'password_reset_requested'
  | 'password_reset_success'
  | 'password_reset_error';

export interface AuthEvent {
  type: AuthEventType;
  timestamp: Date;
  email?: string;
  errorCode?: AuthErrorCode;
  provider?: 'supabase' | 'firebase' | 'google';
}

// Tipos para configuração de provedores
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  redirectTo?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Tipos para rate limiting
export interface RateLimitState {
  attempts: number;
  lastAttempt: Date;
  isLocked: boolean;
  unlockTime?: Date;
}

// Tipos para sessão
export interface SessionData {
  userId: string;
  email: string;
  provider: 'supabase' | 'firebase';
  expiresAt: Date;
  refreshToken?: string;
}

// Tipos para logs de auditoria
export interface AuditLog {
  id: string;
  userId?: string;
  email: string;
  action: AuthEventType;
  provider: 'supabase' | 'firebase' | 'google';
  success: boolean;
  errorCode?: AuthErrorCode;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Type guards para verificação de tipos
export const isAuthError = (error: any): error is NormalizedAuthError => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password && password.length >= 6;
};

// Constantes para configuração
export const AUTH_CONSTANTS = {
  PASSWORD_MIN_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  SESSION_TIMEOUT_HOURS: 24,
  REFRESH_TOKEN_THRESHOLD_MINUTES: 30
} as const;

// Tipos para mensagens de erro localizadas
export interface ErrorMessages {
  [key: string]: {
    pt: string;
    en: string;
  };
}

export const AUTH_ERROR_MESSAGES: ErrorMessages = {
  invalid_credentials: {
    pt: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.',
    en: 'Invalid email or password. Please check your credentials and try again.'
  },
  user_not_found: {
    pt: 'Usuário não encontrado. Verifique o email ou crie uma nova conta.',
    en: 'User not found. Please check the email or create a new account.'
  },
  email_not_confirmed: {
    pt: 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email.',
    en: 'Email not confirmed. Please check your inbox and confirm your email.'
  },
  too_many_requests: {
    pt: 'Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.',
    en: 'Too many login attempts. Please wait a few minutes before trying again.'
  },
  unknown_error: {
    pt: 'Ocorreu um erro inesperado. Tente novamente.',
    en: 'An unexpected error occurred. Please try again.'
  }
} as const;