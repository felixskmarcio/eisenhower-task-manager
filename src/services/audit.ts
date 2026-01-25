export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ACCESS_DENIED';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: AuditAction;
  table_name: string;
  record_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  timestamp: string;
  user_agent?: string;
}

const STORAGE_KEY = 'audit_logs';
const MAX_LOGS = 500;

const getStoredLogs = (): AuditLogEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLogsToStorage = (logs: AuditLogEntry[]): void => {
  try {
    const trimmedLogs = logs.slice(-MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.warn('Falha ao salvar logs de auditoria:', error);
  }
};

export const logAudit = async (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'user_agent'>): Promise<void> => {
  const timestamp = new Date().toISOString();
  const logEntry: AuditLogEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
  };

  console.log(`[AUDIT] ${timestamp} | ${entry.action} | ${entry.table_name} | User: ${entry.user_id} | Record: ${entry.record_id || 'N/A'}`);
  
  const logs = getStoredLogs();
  logs.push(logEntry);
  saveLogsToStorage(logs);
};

export const logAccessDenied = async (userId: string, resource: string, attemptedAction: string): Promise<void> => {
  console.warn(`[SECURITY] Acesso negado | User: ${userId} | Resource: ${resource} | Action: ${attemptedAction}`);
  
  await logAudit({
    user_id: userId,
    action: 'ACCESS_DENIED',
    table_name: resource,
    metadata: { attempted_action: attemptedAction }
  });
};

export const getRecentAuditLogs = (userId: string, limit: number = 50): AuditLogEntry[] => {
  const logs = getStoredLogs();
  return logs
    .filter(log => log.user_id === userId)
    .slice(-limit)
    .reverse();
};

export const getAllAuditLogs = (userId: string): AuditLogEntry[] => {
  const logs = getStoredLogs();
  return logs
    .filter(log => log.user_id === userId)
    .reverse();
};

export const clearUserAuditLogs = (userId: string): void => {
  const logs = getStoredLogs();
  const filteredLogs = logs.filter(log => log.user_id !== userId);
  saveLogsToStorage(filteredLogs);
};

export const logTaskAction = async (
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  taskId: string,
  oldData?: Record<string, unknown>,
  newData?: Record<string, unknown>
): Promise<void> => {
  await logAudit({
    user_id: userId,
    action,
    table_name: 'tasks',
    record_id: taskId,
    old_data: oldData,
    new_data: newData,
  });
};

export const logAuthAction = async (
  userId: string,
  action: 'LOGIN' | 'LOGOUT'
): Promise<void> => {
  await logAudit({
    user_id: userId,
    action,
    table_name: 'auth',
  });
};
