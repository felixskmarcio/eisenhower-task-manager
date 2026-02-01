import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  pageVisited: boolean;
  setPageTransition: (isTransitioning: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageVisited, setPageVisited] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(false);

  // Lidar com transições de página
  // Lidar com transições de página
  useEffect(() => {
    // REMOVIDO: Transição de página com loading foi desabilitada por solicitação
    if (isPageTransition) {
      // Apenas resetamos o estado de transição sem ativar o loading
      const timer = setTimeout(() => {
        setIsPageTransition(false);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isPageTransition]);

  // Ao iniciar a aplicação, verificamos se o usuário já visitou a página antes
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');

    if (hasVisited) {
      setPageVisited(true);

      // Se já visitou, podemos mostrar o loader por menos tempo ou não mostrar
      // Aqui optamos por mostrar um loader rápido mesmo para usuários recorrentes
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } else {
      // Se é a primeira visita, mostramos o loader por mais tempo
      setPageVisited(false);

      // Após a primeira visita, marcamos que o usuário já visitou
      localStorage.setItem('hasVisitedBefore', 'true');

      // Deixamos o loader visível por um tempo maior na primeira visita
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  }, []);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setPageTransition = (isTransitioning: boolean) => {
    setIsPageTransition(isTransitioning);
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      startLoading,
      stopLoading,
      pageVisited,
      setPageTransition
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider');
  }
  return context;
};

export default LoadingContext; 