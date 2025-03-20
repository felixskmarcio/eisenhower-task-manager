import React, { useState, useEffect } from 'react';
import './styles.css';

// Substitua pelos seus valores
const API_KEY = 'SUA_API_KEY';
const CLIENT_ID = 'SEU_CLIENT_ID';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

const GoogleCalendarSync = ({ tasks }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    // Carrega a biblioteca do cliente GAPI
    const loadGapiAndInitClient = () => {
      gapi.load('client:auth2', initClient);
    };

    // Inicializa o cliente GAPI
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
      }).then(() => {
        // Atualiza o estado de login
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        
        // Adiciona listener para mudanças de estado de autenticação
        authInstance.isSignedIn.listen(updateSigninStatus);
      }).catch(error => {
        console.error('Erro ao inicializar cliente GAPI', error);
        setSyncStatus('Erro ao conectar com Google Calendar');
      });
    };

    // Atualiza o estado quando o status de login muda
    const updateSigninStatus = (isUserSignedIn) => {
      setIsSignedIn(isUserSignedIn);
    };

    // Carrega a API quando o componente é montado
    if (window.gapi) {
      loadGapiAndInitClient();
    }
  }, []);

  // Faz login no Google
  const handleAuthClick = () => {
    if (window.gapi) {
      if (!isSignedIn) {
        gapi.auth2.getAuthInstance().signIn();
      } else {
        gapi.auth2.getAuthInstance().signOut();
      }
    }
  };

  // Sincroniza tarefas com o Google Calendar
  const syncTasksToCalendar = async () => {
    if (!isSignedIn || !tasks || tasks.length === 0) {
      setSyncStatus('Não há tarefas para sincronizar ou usuário não está logado');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Sincronizando tarefas...');

    try {
      // Para cada tarefa, cria um evento no Google Calendar
      const promises = tasks.map(async (task) => {
        // Determina a cor do evento baseado no quadrante da matriz
        let colorId;
        switch(task.quadrant) {
          case 'fazer':
            colorId = '11'; // Vermelho
            break;
          case 'agendar':
            colorId = '9'; // Verde
            break;
          case 'delegar':
            colorId = '5'; // Amarelo
            break;
          case 'eliminar':
            colorId = '8'; // Cinza
            break;
          default:
            colorId = '1'; // Azul
        }

        // Cria o evento
        const event = {
          'summary': task.title,
          'description': task.description || 'Tarefa da Matriz de Eisenhower',
          'start': {
            'dateTime': task.dueDate || new Date().toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          'end': {
            'dateTime': task.dueDate || new Date(new Date().getTime() + 60*60*1000).toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          'colorId': colorId,
          'reminders': {
            'useDefault': true
          }
        };

        // Adiciona o evento ao calendário
        return gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
        });
      });

      await Promise.all(promises);
      setSyncStatus('Tarefas sincronizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao sincronizar tarefas', error);
      setSyncStatus('Erro ao sincronizar tarefas: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="google-calendar-sync">
      <h3>Integração com Google Calendar</h3>
      <p className="sync-description">
        Sincronize suas tarefas com o Google Calendar para manter tudo organizado em um só lugar.
      </p>
      
      <button 
        className={`auth-button ${isSignedIn ? 'signed-in' : ''}`}
        onClick={handleAuthClick}
      >
        {isSignedIn ? 'Desconectar do Google' : 'Conectar ao Google Calendar'}
      </button>
      
      {isSignedIn && (
        <button 
          className="sync-button"
          onClick={syncTasksToCalendar}
          disabled={isSyncing}
        >
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Tarefas'}
        </button>
      )}
      
      {syncStatus && (
        <p className="sync-status">{syncStatus}</p>
      )}
    </div>
  );
};

export default GoogleCalendarSync; 