import { getAccessToken } from './auth';
import { logError, ErrorType } from '@/lib/logError';
import { toast } from '@/hooks/use-toast';

// Adicionar declaração para o tipo Window global com gapi
declare global {
  interface Window {
    gapi: typeof gapi;
    GOOGLE_API_KEY?: string;
  }
}

// Tipos para tarefas
export interface Task {
  id: string;
  title: string;
  description?: string;
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
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY || window.GOOGLE_API_KEY,
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

    // Configurar o token de acesso
    window.gapi.client.setToken({
      access_token: token
    });

    // Lista os calendários para verificar permissão
    const response = await window.gapi.client.calendar.calendarList.list({
      maxResults: 1
    });
    
    return response.status === 200;
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
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'colorId': colorId,
      'reminders': {
        'useDefault': true
      }
    };

    // Adiciona o evento ao calendário
    const response = await window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });

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
    });
    
    return {
      success: false,
      synced,
      failed: tasks.length - synced,
      errors: [{
        message: errorMsg,
        code: error instanceof Error ? (error as any).code : 'unknown_error'
      }]
    };
  }
};

// Exportar para uso global
export default {
  initGoogleCalendarApi,
  checkCalendarAccess,
  createEventFromTask,
  syncTasksWithCalendar
};