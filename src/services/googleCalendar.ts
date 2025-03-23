
import { logError, ErrorType } from '@/lib/logError';
import { 
  getGoogleAuthInstance,
  isUserSignedIn as checkUserSignedIn 
} from '@/utils/googleApiLoader';

// Use environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// Task interface 
export interface Task {
  id: string;
  title: string;
  description?: string;
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

/**
 * Checks if the user is signed in
 */
export const isUserSignedIn = (): boolean => {
  return checkUserSignedIn();
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
    
    const response = await window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });
    
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
    });
    
    return {
      success: false,
      syncedCount,
      message: 'Erro ao sincronizar tarefas com o Google Calendar'
    };
  }
};

// Add window type definitions
declare global {
  interface Window {
    gapi: any;
  }
}

export default {
  isUserSignedIn,
  syncTaskToCalendar,
  syncTasksToCalendar,
  updateCalendarTask,
  removeCalendarTask
};
