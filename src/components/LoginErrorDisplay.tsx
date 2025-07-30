
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface LoginErrorDisplayProps {
  email: string;
  errorCode?: string;
  errorMessage?: string;
  onTryAgain: () => void;
  onResetPassword: () => void;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({
  email,
  errorCode,
  errorMessage,
  onTryAgain,
  onResetPassword
}) => {
  const navigate = useNavigate();
  
  // Mapear códigos de erro normalizados
  const isInvalidCredentials = errorCode === 'auth/invalid-credential' || 
                              errorCode === 'auth/wrong-password' ||
                              errorCode === 'invalid_credentials' ||
                              errorMessage?.toLowerCase().includes('invalid login credentials') ||
                              errorMessage?.toLowerCase().includes('senha incorreta');
  
  const isUserNotFound = errorCode === 'auth/user-not-found' || 
                         errorCode === 'user_not_found' ||
                         errorMessage?.toLowerCase().includes('user not found') ||
                         errorMessage?.toLowerCase().includes('usuário não encontrado');
  
  const isEmailNotConfirmed = errorCode === 'email_not_confirmed' ||
                             errorMessage?.toLowerCase().includes('email not confirmed');
  
  const isTooManyRequests = errorCode === 'auth/too-many-requests' ||
                           errorCode === 'too_many_requests' ||
                           errorMessage?.toLowerCase().includes('too many requests') ||
                           errorMessage?.toLowerCase().includes('muitas tentativas');
  
  const isUnknownError = errorCode === 'unknown_error' || 
                        (!isInvalidCredentials && !isUserNotFound && !isEmailNotConfirmed && !isTooManyRequests);
  
  return (
    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 shadow-md mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-3 items-start">
          {(isInvalidCredentials || isUserNotFound || isEmailNotConfirmed) ? (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-medium text-foreground">
              {isInvalidCredentials ? 'Credenciais inválidas' : 
               isUserNotFound ? 'Usuário não encontrado' :
               isEmailNotConfirmed ? 'Email não confirmado' :
               isTooManyRequests ? 'Muitas tentativas' : 'Erro no login'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isInvalidCredentials 
                ? errorMessage || `A senha inserida para o email "${email}" está incorreta.`
                : isUserNotFound
                ? errorMessage || `O email "${email}" não foi encontrado no sistema.`
                : isEmailNotConfirmed
                ? errorMessage || `O email "${email}" precisa ser confirmado. Verifique sua caixa de entrada.`
                : isTooManyRequests
                ? errorMessage || 'Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.'
                : errorMessage || 'Ocorreu um erro durante o processo de login.'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end bg-red-100/50 dark:bg-red-950/10 p-3 rounded-b-lg">
        {isUserNotFound && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/login', { state: { activateSignup: true, email } })}
          >
            Criar conta
          </Button>
        )}
        {(isInvalidCredentials || isUserNotFound) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onResetPassword}
          >
            Esqueci a senha
          </Button>
        )}
        {!isTooManyRequests && (
          <Button 
            variant="default" 
            size="sm"
            onClick={onTryAgain}
          >
            Tentar novamente
          </Button>
        )}
        {isTooManyRequests && (
          <Button 
            variant="outline" 
            size="sm"
            disabled
          >
            Aguarde para tentar novamente
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LoginErrorDisplay;
