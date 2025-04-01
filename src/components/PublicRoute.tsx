import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import LoadingScreen from './LoadingScreen';

interface PublicRouteProps {
  children: React.ReactNode;
  allowAuthenticated?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, allowAuthenticated = false }) => {
  const { user, loading: authLoading } = useAuth();
  const { isLoading } = useLoading();
  const location = useLocation();
  
  // Se estiver carregando a autenticação, mostre o componente de carregamento
  if (authLoading) {
    return <LoadingScreen />;
  }

  if (user && !allowAuthenticated) {
    const from = location.state?.from || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
