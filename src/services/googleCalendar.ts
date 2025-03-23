<<<<<<< HEAD
import { getAccessToken } from './auth';
import { logError, ErrorType } from '@/lib/logError';
import { toast } from '@/components/ui/use-toast';

// Adicionar declaração para o tipo Window global com gapi
declare global {
  interface Window {
    gapi: typeof gapi;
    GOOGLE_API_KEY?: string;
  }
}

// Tipos para tarefas
=======

import { logError, ErrorType } from '@/lib/logError';

// Google API configuration - use environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// Interface for the Google auth instance
interface GoogleAuthInstance {
  isSignedIn: {
    get: () => boolean;
    listen: (callback: (isSignedIn: boolean) => void) => void;
  };
  signIn: () => Promise<any>;
  signOut: () => Promise<any>;
  currentUser: {
    get: () => {
      getBasicProfile: () => {
        getName: () => string;
        getEmail: () => string;
        getImageUrl: () => string;
      };
      getAuthResponse: () => {
        access_token: string;
      };
    };
  };
}

// Interface for the Google API client
interface GoogleApiClient {
  init: (config: any) => Promise<void>;
  calendar: {
    events: {
      insert: (params: any) => Promise<any>;
      list: (params: any) => Promise<any>;
      delete: (params: any) => Promise<any>;
      update: (params: any) => Promise<any>;
    };
  };
}

// Task interface 
>>>>>>> 76534f3dce8a6338e185f7c448554f8f74a8967d
export interface Task {
  id: string;
  title: string;
  description?: string;
<<<<<<< HEAD
  quadrant: number;
  dueDate?: string;
  completed: boolean;
  tags?: string[];
}

// Tipos para erros específicos do Google Calendar
export interface GoogleCalendarError {
  code?: string;
  message: string;
  details?: Record<string, unknown>;
}

// Interface para erros da API Google
interface GoogleApiError extends Error {
  code?: string;
  status?: number;
  result?: {
    error?: {
      code: number;
      message: string;
      errors: Array<{
        message: string;
        domain: string;
        reason: string;
      }>;
    }
  };
}

// Verifica se a API do Google está carregada
const isGapiLoaded = (): boolean => {
  return Boolean(window.gapi && window.gapi.client);
};

// Inicializa a API do Google Calendar
export const initGoogleCalendarApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      const error = new Error('API do Google não carregada');
      logError(error, { 
        type: ErrorType.API, 
        code: 'gapi_not_loaded',
        context: { component: 'googleCalendar', action: 'initApi' }
      });
      reject(error);
      return;
    }

    // Carregar a biblioteca cliente
    window.gapi.load('client', async () => {
      try {
        // Inicializar cliente com chaves da aplicação
        await window.gapi.client.init({
          // As chaves devem ser obtidas do ambiente ou configuração
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY || window.GOOGLE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });

        // Carregar a biblioteca do calendário
        await window.gapi.client.load('calendar', 'v3');
        resolve();
      } catch (error) {
        if (error instanceof Error) {
          logError(error, { 
            type: ErrorType.API, 
            code: 'gapi_init_failed',
            context: { component: 'googleCalendar', action: 'initApi' }
          });
        }
        reject(error);
      }
    });
  });
};

// Verifica se tem permissão para acessar o calendário
export const checkCalendarAccess = async (): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    if (!isGapiLoaded()) {
      await initGoogleCalendarApi();
    }

    // Tento listar os calendários como teste de permissão
    await window.gapi.client.calendar.calendarList.list({
      maxResults: 1
    });
    return true;
  } catch (error) {
    // Se der erro 401 ou 403, provavelmente é falta de permissão
    console.error('Erro ao verificar acesso ao calendário:', error);
    return false;
  }
};

// Cria um evento no calendário do Google a partir de uma tarefa
export const createEventFromTask = async (task: Task): Promise<string | null> => {
  try {
    if (!isGapiLoaded()) {
      await initGoogleCalendarApi();
    }

    // Verifica se tem acesso
    const hasAccess = await checkCalendarAccess();
    if (!hasAccess) {
      throw new Error('Sem permissão para acessar o Google Calendar');
    }

    // Determina a cor do evento baseado no quadrante da matriz
    let colorId;
    switch(task.quadrant) {
      case 1: // Urgente e Importante
        colorId = '11'; // Vermelho
        break;
      case 2: // Importante, Não Urgente
        colorId = '9'; // Verde
        break;
      case 3: // Urgente, Não Importante
        colorId = '5'; // Amarelo
        break;
      case 4: // Não Urgente, Não Importante
        colorId = '8'; // Cinza
        break;
      default:
        colorId = '1'; // Azul
    }

    // Descrição padrão incluindo informações da matriz de Eisenhower
    const quadrantNames = ['', 'Fazer', 'Agendar', 'Delegar', 'Eliminar'];
    const description = task.description || '';
    const enhancedDescription = `${description}\n\n--\nMatriz de Eisenhower: ${quadrantNames[task.quadrant]}${task.tags?.length ? `\nTags: ${task.tags.join(', ')}` : ''}`;

    // Define data de início e fim (padrão: hora atual + 1h se não especificado)
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60*60*1000);
    
    const startDate = task.dueDate ? new Date(task.dueDate) : now;
    const endDate = new Date(startDate.getTime() + 60*60*1000); // 1 hora depois

    // Cria o evento
    const event = {
      'summary': task.title,
      'description': enhancedDescription,
      'start': {
        'dateTime': startDate.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': endDate.toISOString(),
=======
  urgency: number;
  importance: number;
  quadrant?: number | string;
  completed: boolean;
  completedAt?: Date | string | null;
  createdAt?: Date | string;
  created_at?: string;
  completed_at?: string | null;
  tags?: string[];
  dueDate?: string | Date;
  [key: string]: any;
}

let gapiInitialized = false;
let authInstance: GoogleAuthInstance | null = null;

/**
 * Loads the Google API client library
 */
export const loadGoogleApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (gapiInitialized) {
      resolve();
      return;
    }

    if (!window.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        window.gapi.load('client:auth2', async () => {
          try {
            await initGoogleClient();
            gapiInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google API script'));
      };
      
      document.body.appendChild(script);
    } else {
      window.gapi.load('client:auth2', async () => {
        try {
          await initGoogleClient();
          gapiInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }
  });
};

/**
 * Initialize the Google API client
 */
const initGoogleClient = async (): Promise<void> => {
  try {
    console.log('Initializing Google API client with:', { 
      apiKey: API_KEY ? 'API Key exists' : 'No API Key', 
      clientId: CLIENT_ID ? 'Client ID exists' : 'No Client ID',
      scope: SCOPES
    });
    
    await window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    });
    
    authInstance = window.gapi.auth2.getAuthInstance();
    console.log('Google API client initialized successfully');
  } catch (error) {
    console.error('Error initializing Google API client:', error);
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.API,
      code: 'google-client-init-failed',
      context: { component: 'googleCalendar' }
    });
    throw error;
  }
};

/**
 * Checks if the user is signed in
 */
export const isUserSignedIn = (): boolean => {
  if (!authInstance) return false;
  return authInstance.isSignedIn.get();
};

/**
 * Signs in with Google
 */
export const signInWithGoogle = async (): Promise<any> => {
  if (!authInstance) {
    try {
      await loadGoogleApi();
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        type: ErrorType.AUTH,
        code: 'google-auth-load-failed',
        context: { component: 'googleCalendar' }
      });
      throw new Error('Failed to load Google API');
    }
  }
  
  if (!authInstance) {
    throw new Error('Google Auth not initialized');
  }
  
  try {
    return await authInstance.signIn();
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.AUTH,
      code: 'google-sign-in-failed',
      context: { component: 'googleCalendar' }
    });
    throw error;
  }
};

/**
 * Signs out from Google
 */
export const signOutFromGoogle = async (): Promise<void> => {
  if (!authInstance) {
    return;
  }
  
  try {
    await authInstance.signOut();
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.AUTH,
      code: 'google-sign-out-failed',
      context: { component: 'googleCalendar' }
    });
    throw error;
  }
};

/**
 * Gets user information
 */
export const getGoogleUserInfo = (): { name: string; email: string; imageUrl: string } | null => {
  if (!authInstance || !authInstance.isSignedIn.get()) {
    return null;
  }
  
  try {
    const profile = authInstance.currentUser.get().getBasicProfile();
    return {
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    };
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.AUTH,
      code: 'google-user-info-failed',
      context: { component: 'googleCalendar' }
    });
    return null;
  }
};

/**
 * Gets the access token
 */
export const getAccessToken = (): string | null => {
  if (!authInstance || !authInstance.isSignedIn.get()) {
    return null;
  }
  
  try {
    return authInstance.currentUser.get().getAuthResponse().access_token;
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.AUTH,
      code: 'google-token-failed',
      context: { component: 'googleCalendar' }
    });
    return null;
  }
};

/**
 * Adds event listener for sign-in state
 */
export const addSignInListener = (callback: (isSignedIn: boolean) => void): void => {
  if (!authInstance) {
    loadGoogleApi()
      .then(() => {
        if (authInstance) {
          authInstance.isSignedIn.listen(callback);
          // Initial callback with current state
          callback(authInstance.isSignedIn.get());
        }
      })
      .catch((error) => {
        logError(error instanceof Error ? error : new Error(String(error)), {
          type: ErrorType.AUTH,
          code: 'google-listener-failed',
          context: { component: 'googleCalendar' }
        });
      });
    return;
  }
  
  authInstance.isSignedIn.listen(callback);
  // Initial callback with current state
  callback(authInstance.isSignedIn.get());
};

/**
 * Determines the color of the event based on the task quadrant
 */
const getEventColorId = (quadrant: number | string | undefined): string => {
  if (typeof quadrant === 'string') {
    switch(quadrant.toLowerCase()) {
      case 'fazer':
      case '1':
        return '11'; // Red
      case 'agendar':
      case '2':
        return '9';  // Green
      case 'delegar':
      case '3':
        return '5';  // Yellow
      case 'eliminar':
      case '4': 
        return '8';  // Gray
      default:
        return '1';  // Blue
    }
  } else if (typeof quadrant === 'number') {
    switch(quadrant) {
      case 1: return '11'; // Red
      case 2: return '9';  // Green
      case 3: return '5';  // Yellow
      case 4: return '8';  // Gray
      default: return '1'; // Blue
    }
  }
  
  return '1'; // Default blue
};

/**
 * Gets the due date for a task, or creates one if none exists
 */
const getTaskDueDate = (task: Task): { start: Date; end: Date } => {
  let startDate: Date;
  
  if (task.dueDate) {
    startDate = new Date(task.dueDate);
  } else {
    // If no due date, set it to now + 1 day
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    // Set to 9 AM
    startDate.setHours(9, 0, 0, 0);
  }
  
  // End date is 1 hour after start
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  
  return { start: startDate, end: endDate };
};

/**
 * Syncs a single task to Google Calendar
 */
export const syncTaskToCalendar = async (task: Task): Promise<string | null> => {
  if (!window.gapi || !window.gapi.client || !isUserSignedIn()) {
    throw new Error('Google API not initialized or user not signed in');
  }
  
  try {
    const { start, end } = getTaskDueDate(task);
    const colorId = getEventColorId(task.quadrant);
    
    const event = {
      'summary': task.title,
      'description': task.description || 'Tarefa da Matriz de Eisenhower',
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end.toISOString(),
>>>>>>> 76534f3dce8a6338e185f7c448554f8f74a8967d
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'colorId': colorId,
      'reminders': {
        'useDefault': true
<<<<<<< HEAD
      }
    };

    // Adiciona o evento ao calendário
=======
      },
      'extendedProperties': {
        'private': {
          'taskId': task.id,
          'quadrant': String(task.quadrant || ''),
          'eisenhowerApp': 'true'
        }
      }
    };
    
>>>>>>> 76534f3dce8a6338e185f7c448554f8f74a8967d
    const response = await window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });
<<<<<<< HEAD

    // Retornar o ID do evento criado
    toast({
      title: "Evento Criado",
      description: `Tarefa "${task.title}" sincronizada com o Google Calendar`,
    });
    
    return response.result.id;
  } catch (error) {
    // Tratamento de erro
    const calendarError: GoogleCalendarError = {
      message: error instanceof Error ? error.message : 'Erro ao criar evento no Google Calendar'
    };
    
    if (error instanceof Error) {
      const googleError = error as GoogleApiError;
      calendarError.code = googleError.code || 'calendar_create_event_error';
      
      logError(error, {
        type: ErrorType.API,
        code: calendarError.code,
        context: {
          component: 'googleCalendar',
          action: 'createEventFromTask',
          taskInfo: {
            id: task.id,
            title: task.title,
            quadrant: task.quadrant
          }
        }
      });
    }
    
    toast({
      title: "Falha ao Sincronizar",
      description: calendarError.message,
      variant: "destructive"
    });
    
    return null;
  }
};

// Sincroniza múltiplas tarefas com o Google Calendar
export const syncTasksWithCalendar = async (tasks: Task[]): Promise<{
  success: boolean;
  synced: number;
  failed: number;
  errors?: GoogleCalendarError[];
}> => {
  if (!tasks.length) {
    return { success: true, synced: 0, failed: 0 };
  }

  const errors: GoogleCalendarError[] = [];
  let synced = 0;
  let failed = 0;

  try {
    // Inicializar API se necessário
    if (!isGapiLoaded()) {
      await initGoogleCalendarApi();
    }

    // Verificar acesso
    const hasAccess = await checkCalendarAccess();
    if (!hasAccess) {
      throw new Error('Sem permissão para acessar o Google Calendar');
    }

    // Para cada tarefa, criar um evento
    for (const task of tasks) {
      try {
        const eventId = await createEventFromTask(task);
        if (eventId) {
          synced++;
        } else {
          failed++;
        }
      } catch (err) {
        failed++;
        if (err instanceof Error) {
          const googleError = err as GoogleApiError;
          errors.push({
            code: googleError.code,
            message: err.message,
            details: { task: { id: task.id, title: task.title } }
          });
        }
      }
    }

    // Resultado geral
    const success = failed === 0;
    if (success) {
      toast({
        title: "Sincronização Concluída",
        description: `${synced} tarefas sincronizadas com o Google Calendar`,
      });
    } else {
      toast({
        title: "Sincronização Parcial",
        description: `${synced} tarefas sincronizadas, ${failed} falhas`,
        variant: "destructive"
      });
    }

    return { success, synced, failed, errors: errors.length ? errors : undefined };
  } catch (error) {
    // Erro geral na sincronização
    const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido ao sincronizar com Google Calendar';
    
    if (error instanceof Error) {
      const googleError = error as GoogleApiError;
      logError(error, {
        type: ErrorType.API,
        code: 'calendar_sync_failed',
        context: {
          component: 'googleCalendar',
          action: 'syncTasksWithCalendar',
          tasksCount: tasks.length
        }
      });
    }
    
    toast({
      title: "Falha na Sincronização",
      description: errorMsg,
      variant: "destructive"
=======
    
    // Return the event ID for future reference
    return response.result.id || null;
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.API,
      code: 'google-calendar-sync-failed',
      context: { component: 'googleCalendar', taskId: task.id }
    });
    throw error;
  }
};

/**
 * Updates a task in Google Calendar
 */
export const updateCalendarTask = async (task: Task, eventId: string): Promise<void> => {
  if (!window.gapi || !window.gapi.client || !isUserSignedIn()) {
    throw new Error('Google API not initialized or user not signed in');
  }
  
  try {
    const { start, end } = getTaskDueDate(task);
    const colorId = getEventColorId(task.quadrant);
    
    const event = {
      'summary': task.title,
      'description': task.description || 'Tarefa da Matriz de Eisenhower',
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'colorId': colorId,
      'reminders': {
        'useDefault': true
      },
      'extendedProperties': {
        'private': {
          'taskId': task.id,
          'quadrant': String(task.quadrant || ''),
          'eisenhowerApp': 'true'
        }
      }
    };
    
    await window.gapi.client.calendar.events.update({
      'calendarId': 'primary',
      'eventId': eventId,
      'resource': event
    });
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.API,
      code: 'google-calendar-update-failed',
      context: { component: 'googleCalendar', taskId: task.id, eventId }
    });
    throw error;
  }
};

/**
 * Removes a task from Google Calendar
 */
export const removeCalendarTask = async (eventId: string): Promise<void> => {
  if (!window.gapi || !window.gapi.client || !isUserSignedIn()) {
    throw new Error('Google API not initialized or user not signed in');
  }
  
  try {
    await window.gapi.client.calendar.events.delete({
      'calendarId': 'primary',
      'eventId': eventId
    });
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.API,
      code: 'google-calendar-delete-failed',
      context: { component: 'googleCalendar', eventId }
    });
    throw error;
  }
};

/**
 * Syncs multiple tasks to Google Calendar
 */
export const syncTasksToCalendar = async (tasks: Task[]): Promise<{ success: boolean; syncedCount: number; message: string }> => {
  if (!window.gapi || !window.gapi.client || !isUserSignedIn()) {
    return {
      success: false,
      syncedCount: 0,
      message: 'Google API not initialized or user not signed in'
    };
  }
  
  if (!tasks || tasks.length === 0) {
    return {
      success: true,
      syncedCount: 0,
      message: 'Nenhuma tarefa para sincronizar'
    };
  }
  
  let syncedCount = 0;
  let errors = 0;
  
  try {
    // Get all existing events created by our app
    const listResponse = await window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'privateExtendedProperty': 'eisenhowerApp=true'
    });
    
    const existingEvents = listResponse.result.items || [];
    const eventMap = new Map();
    
    // Create a map of task IDs to event IDs
    existingEvents.forEach(event => {
      const taskId = event.extendedProperties?.private?.taskId;
      if (taskId) {
        eventMap.set(taskId, event.id);
      }
    });
    
    // Process each task
    for (const task of tasks) {
      try {
        if (eventMap.has(task.id)) {
          // Update existing event
          if (task.completed) {
            // Remove completed tasks
            await removeCalendarTask(eventMap.get(task.id));
          } else {
            // Update existing task
            await updateCalendarTask(task, eventMap.get(task.id));
          }
        } else if (!task.completed) {
          // Create new event for non-completed tasks
          await syncTaskToCalendar(task);
        }
        
        syncedCount++;
      } catch (taskError) {
        errors++;
        console.error(`Error syncing task ${task.id}:`, taskError);
      }
    }
    
    return {
      success: errors === 0,
      syncedCount,
      message: errors === 0 
        ? `${syncedCount} tarefas sincronizadas com sucesso` 
        : `${syncedCount} tarefas sincronizadas, ${errors} erros`
    };
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      type: ErrorType.API,
      code: 'google-calendar-batch-sync-failed',
      context: { component: 'googleCalendar', taskCount: tasks.length }
>>>>>>> 76534f3dce8a6338e185f7c448554f8f74a8967d
    });
    
    return {
      success: false,
<<<<<<< HEAD
      synced,
      failed: tasks.length - synced,
      errors: [{
        message: errorMsg,
        code: error instanceof Error ? (error as any).code : 'unknown_error'
      }]
=======
      syncedCount,
      message: 'Erro ao sincronizar tarefas com o Google Calendar'
>>>>>>> 76534f3dce8a6338e185f7c448554f8f74a8967d
    };
  }
};

<<<<<<< HEAD
// Exportar para uso global
export default {
  initGoogleCalendarApi,
  checkCalendarAccess,
  createEventFromTask,
  syncTasksWithCalendar
}; 
=======
// Add window type definitions
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: GoogleApiClient;
      auth2: {
        getAuthInstance: () => GoogleAuthInstance;
      };
    };
  }
}

export default {
  loadGoogleApi,
  isUserSignedIn,
  signInWithGoogle,
  signOutFromGoogle,
  getGoogleUserInfo,
  addSignInListener,
  syncTaskToCalendar,
  syncTasksToCalendar,
  updateCalendarTask,
  removeCalendarTask
};
>>>>>>> 76534f3dce8a6338e185f7c448554f8f74a8967d
