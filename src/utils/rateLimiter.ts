/**
 * Sistema simples de limitação de taxa de requisições para frontend
 * Em produção, isso deve ser implementado principalmente no backend
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

/**
 * Verifica se a operação está dentro dos limites de taxa
 * @param key Identificador da operação (ex: 'auth:login', 'api:tasks:create')
 * @param limit Número máximo de requisições permitidas no período
 * @param windowMs Período em milissegundos para considerar (padrão: 60000ms = 1 minuto)
 * @returns Objeto indicando se excedeu o limite e quantas tentativas restam
 */
export const checkRateLimit = (
  key: string, 
  limit: number, 
  windowMs = 60000
): { limited: boolean; remaining: number; resetInMs: number } => {
  const now = Date.now();
  const record = rateLimitStore[key];
  
  // Se não existe registro ou já passou o tempo de reset
  if (!record || now > record.resetTime) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs
    };
    
    return {
      limited: false,
      remaining: limit - 1,
      resetInMs: windowMs
    };
  }
  
  // Incrementa contador
  record.count += 1;
  
  // Verifica se excedeu o limite
  const limited = record.count > limit;
  const resetInMs = Math.max(0, record.resetTime - now);
  
  return {
    limited,
    remaining: Math.max(0, limit - record.count),
    resetInMs
  };
};

/**
 * Aplicar limite de taxa antes de uma operação
 * Se exceder o limite, retorna uma Promise rejected
 */
export const applyRateLimit = async <T>(
  key: string,
  operation: () => Promise<T>,
  limit: number,
  windowMs = 60000
): Promise<T> => {
  const check = checkRateLimit(key, limit, windowMs);
  
  if (check.limited) {
    const secondsToReset = Math.ceil(check.resetInMs / 1000);
    throw new Error(`Muitas tentativas. Tente novamente em ${secondsToReset} segundos.`);
  }
  
  return operation();
};

/**
 * Resetar o limite de taxa para uma chave específica
 */
export const resetRateLimit = (key: string): void => {
  delete rateLimitStore[key];
}; 