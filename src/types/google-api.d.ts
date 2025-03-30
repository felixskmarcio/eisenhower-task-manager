
// Type definitions for Google API client
interface GoogleApiEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  colorId?: string;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
  extendedProperties?: {
    private?: Record<string, string>;
    shared?: Record<string, string>;
  };
}

interface GoogleApiResponse {
  result: any;
  body?: string;
  headers?: Record<string, string>;
  status?: number;
  statusText?: string;
}

interface GoogleApiCalendar {
  events: {
    insert: (params: { calendarId: string; resource: GoogleApiEvent }) => Promise<GoogleApiResponse>;
    update: (params: { calendarId: string; eventId: string; resource: GoogleApiEvent }) => Promise<GoogleApiResponse>;
    delete: (params: { calendarId: string; eventId: string }) => Promise<GoogleApiResponse>;
    list: (params: { calendarId: string; [key: string]: any }) => Promise<{
      result: {
        items: GoogleApiEvent[];
        [key: string]: any;
      };
    }>;
  };
  calendarList: {
    list: (params?: { maxResults?: number; [key: string]: any }) => Promise<{
      result: {
        items: Array<{
          id: string;
          summary: string;
          [key: string]: any;
        }>;
        [key: string]: any;
      };
    }>;
  };
}

declare namespace gapi {
  namespace client {
    function init(config: {
      apiKey: string;
      clientId?: string;
      scope?: string;
      discoveryDocs?: string[];
    }): Promise<void>;

    const calendar: GoogleApiCalendar;
  }

  namespace auth2 {
    function getAuthInstance(): {
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
    };
  }

  function load(api: string, callback: () => void): void;
}

declare global {
  interface Window {
    gapi: typeof gapi;
  }
}
