import React, { useState, useEffect } from 'react';
import './styles.css';

// Substitua pelos seus valores
const API_KEY = 'SUA_API_KEY';
const CLIENT_ID = 'SEU_CLIENT_ID';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

const GoogleCalendarIntegration = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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
        
        // Se já estiver conectado, obtenha informações do usuário
        if (authInstance.isSignedIn.get()) {
          const profile = authInstance.currentUser.get().getBasicProfile();
          setUserInfo({
            name: profile.getName(),
            email: profile.getEmail(),
            imageUrl: profile.getImageUrl()
          });
        }
      }).catch(error => {
        console.error('Erro ao inicializar cliente GAPI', error);
      });
    };

    // Atualiza o estado quando o status de login muda
    const updateSigninStatus = (isUserSignedIn) => {
      setIsSignedIn(isUserSignedIn);
      
      if (isUserSignedIn) {
        const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        setUserInfo({
          name: profile.getName(),
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl()
        });
      } else {
        setUserInfo(null);
      }
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

  return (
    <div className="configuracoes-card">
      <h3 className="configuracoes-section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Integração com Google Calendar
      </h3>
      
      <div className="configuracoes-divider"></div>
      
      <p className="calendar-description">
        Sincronize suas tarefas com o Google Calendar para manter tudo organizado em um só lugar.
      </p>
      
      {isSignedIn && userInfo ? (
        <div className="google-account-info">
          <div className="user-profile">
            <img src={userInfo.imageUrl} alt={userInfo.name} className="user-avatar" />
            <div className="user-details">
              <p className="user-name">{userInfo.name}</p>
              <p className="user-email">{userInfo.email}</p>
            </div>
          </div>
          
          <p className="sync-status-active">Conectado ao Google Calendar</p>
          
          <div className="account-actions">
            <button 
              className="google-disconnect-btn"
              onClick={handleAuthClick}
            >
              Desconectar conta
            </button>
            
            <button 
              className="google-sync-settings-btn"
              onClick={() => window.open('https://calendar.google.com/calendar/u/0/r/settings', '_blank')}
            >
              Configurações do Calendário
            </button>
          </div>
        </div>
      ) : (
        <div className="google-auth-section">
          <p className="auth-instruction">
            Conecte-se ao Google Calendar para sincronizar automaticamente suas tarefas.
          </p>
          
          <button 
            className="google-auth-btn"
            onClick={handleAuthClick}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
              <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
              <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.399 18 7.19052 16.3415 6.35852 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
              <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
            </svg>
            Conectar com Google
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarIntegration; 