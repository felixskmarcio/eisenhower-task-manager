/**
 * Utilitário de proteção CSRF para aplicações frontend
 * Em produção, a proteção CSRF deve ser primariamente implementada no backend
 * Esta é uma implementação limitada para frontend que pode ajudar em alguns cenários
 */

import { v4 as uuidv4 } from 'uuid';

// Armazenar o token CSRF atual
const CSRF_TOKEN_KEY = 'app_csrf_token';
const CSRF_TOKEN_HEADER = 'X-CSRF-Token';

/**
 * Gera um novo token CSRF
 */
export const generateCsrfToken = (): string => {
  const token = uuidv4();
  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  return token;
};

/**
 * Obtém o token CSRF atual ou gera um novo se não existir
 */
export const getCsrfToken = (): string => {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!token) {
    token = generateCsrfToken();
  }
  
  return token;
};

/**
 * Adiciona o token CSRF aos cabeçalhos de uma requisição fetch
 */
export const addCsrfHeader = (headers: HeadersInit = {}): HeadersInit => {
  return {
    ...headers,
    [CSRF_TOKEN_HEADER]: getCsrfToken()
  };
};

/**
 * Wrapper para fetch que adiciona proteção CSRF
 */
export const fetchWithCsrf = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  // Garantir que estamos usando um objeto de cabeçalhos
  const headers = options.headers 
    ? { ...options.headers as Record<string, string> } 
    : {};
  
  // Adicionar token CSRF ao cabeçalho
  headers[CSRF_TOKEN_HEADER] = getCsrfToken();
  
  // Executar a requisição com os cabeçalhos atualizados
  return fetch(url, {
    ...options,
    headers
  });
};

/**
 * Adiciona CSRF protection para formulários HTML
 * Retorna uma função para ser usada em onSubmit
 */
export const protectForm = (formId: string): (() => void) => {
  // Cria um campo oculto no formulário com o token CSRF
  const setupForm = () => {
    const form = document.getElementById(formId) as HTMLFormElement;
    
    if (!form) {
      console.error(`Formulário com ID ${formId} não encontrado`);
      return;
    }
    
    // Verificar se já existe um campo CSRF
    let csrfInput = form.querySelector(`input[name="${CSRF_TOKEN_HEADER}"]`) as HTMLInputElement;
    
    // Se não existe, criar
    if (!csrfInput) {
      csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = CSRF_TOKEN_HEADER;
      form.appendChild(csrfInput);
    }
    
    // Atualizar valor com token atual
    csrfInput.value = getCsrfToken();
  };
  
  return setupForm;
};

/**
 * Valida um token CSRF recebido do servidor
 * Na prática, isso seria feito principalmente no backend
 */
export const validateCsrfToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!storedToken || !token) {
    return false;
  }
  
  // Validação de tempo constante para evitar timing attacks
  // (na prática, isto seria feito no backend, não no frontend)
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    if (i >= storedToken.length || token[i] !== storedToken[i]) {
      result = 1;
    }
  }
  
  if (token.length !== storedToken.length) {
    result = 1;
  }
  
  return result === 0;
}; 