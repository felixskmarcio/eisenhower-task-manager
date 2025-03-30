
/**
 * Utility for loading and initializing Google API
 */

// Use environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';

/**
 * Loads the Google API client library
 */
export const loadGoogleApiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.gapi) {
      resolve();
      return;
    }
    
    // Check if script is already being loaded
    if (document.getElementById('google-api-script')) {
      const checkGapiLoaded = setInterval(() => {
        if (window.gapi) {
          clearInterval(checkGapiLoaded);
          resolve();
        }
      }, 100);
      
      // Set timeout to avoid infinite loop
      setTimeout(() => {
        clearInterval(checkGapiLoaded);
        reject(new Error('Timeout waiting for Google API to load'));
      }, 10000);
      
      return;
    }
    
    // Load the script
    const script = document.createElement('script');
    script.id = 'google-api-script';
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google API script loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load Google API script');
      reject(new Error('Failed to load Google API script'));
    };
    
    document.body.appendChild(script);
  });
};

/**
 * Initialize the Google API client with required scopes
 */
export const initializeGoogleApi = async (): Promise<void> => {
  if (!window.gapi) {
    await loadGoogleApiScript();
  }
  
  return new Promise((resolve, reject) => {
    window.gapi.load('client:auth2', async () => {
      try {
        console.log('Initializing Google API client with:', {
          apiKey: API_KEY ? 'API Key exists' : 'No API Key',
          clientId: CLIENT_ID ? 'Client ID exists' : 'No Client ID',
          scope: CALENDAR_SCOPE
        });
        
        await window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: CALENDAR_SCOPE,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        });
        
        console.log('Google API client initialized successfully');
        resolve();
      } catch (error) {
        console.error('Error initializing Google API client:', error);
        reject(error);
      }
    });
  });
};

/**
 * Get the Google Auth instance (after initialization)
 */
export const getGoogleAuthInstance = (): any | null => {
  if (!window.gapi || !window.gapi.auth2) {
    console.warn('Google Auth is not initialized yet');
    return null;
  }
  
  try {
    return window.gapi.auth2.getAuthInstance();
  } catch (error) {
    console.error('Error getting Google Auth instance:', error);
    return null;
  }
};

/**
 * Trigger Google sign in
 */
export const signInWithGoogle = async (): Promise<any> => {
  const authInstance = getGoogleAuthInstance();
  if (!authInstance) {
    throw new Error('Google Auth not initialized');
  }
  
  return authInstance.signIn();
};

/**
 * Sign out from Google
 */
export const signOutFromGoogle = async (): Promise<void> => {
  const authInstance = getGoogleAuthInstance();
  if (!authInstance) {
    throw new Error('Google Auth not initialized');
  }
  
  return authInstance.signOut();
};

/**
 * Check if user is signed in
 */
export const isUserSignedIn = (): boolean => {
  const authInstance = getGoogleAuthInstance();
  if (!authInstance) {
    return false;
  }
  
  return authInstance.isSignedIn.get();
};

/**
 * Get user information if signed in
 */
export const getGoogleUserInfo = (): { name: string; email: string; imageUrl: string } | null => {
  const authInstance = getGoogleAuthInstance();
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
    console.error('Error getting user info:', error);
    return null;
  }
};

// Use TS interface instead of redefining Window
export default {
  loadGoogleApiScript,
  initializeGoogleApi,
  getGoogleAuthInstance,
  signInWithGoogle,
  signOutFromGoogle,
  isUserSignedIn,
  getGoogleUserInfo
};
