
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface LoginErrorDisplayProps {
  email: string;
  errorCode?: string;
  onTryAgain: () => void;
  onResetPassword: () => void;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({
  email,
  errorCode,
  onTryAgain,
  onResetPassword
}) => {
  const navigate = useNavigate();
  
  const isInvalidCredentials = errorCode === 'auth/invalid-credential';
  
  return (
    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 shadow-md mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-3 items-start">
          {isInvalidCredentials ? (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-medium text-foreground">
              {isInvalidCredentials ? 'Credenciais inválidas' : 'Erro no login'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isInvalidCredentials 
                ? `O email "${email}" não foi encontrado ou a senha está incorreta.`
                : 'Ocorreu um erro durante o processo de login.'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end bg-red-100/50 dark:bg-red-950/10 p-3 rounded-b-lg">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/login', { state: { activateSignup: true, email } })}
        >
          Criar conta
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onResetPassword}
        >
          Esqueci a senha
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={onTryAgain}
        >
          Tentar novamente
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginErrorDisplay;
