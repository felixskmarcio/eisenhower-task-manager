
import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface TutorialAlertProps {
  onClose: () => void;
}

const TutorialAlert: React.FC<TutorialAlertProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Alert className="bg-primary/10 border-primary/20">
        <div className="flex justify-between w-full">
          <div className="flex-1">
            <AlertTitle className="text-lg font-semibold text-primary mb-2">
              Bem-vindo à demonstração da Matriz de Eisenhower
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              <p className="mb-2">
                Esta é uma versão demonstrativa onde você pode experimentar como funciona a 
                matriz de Eisenhower sem necessidade de criar uma conta.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Como usar:</h4>
                  <ul className="space-y-1 text-sm list-disc pl-5">
                    <li>Clique em <strong>Nova Tarefa</strong> para adicionar novas atividades</li>
                    <li>Escolha o quadrante apropriado para cada tarefa</li>
                    <li>Use as abas para filtrar tarefas por quadrante</li>
                    <li><strong>Arraste e solte</strong> tarefas entre os quadrantes para reclassificá-las</li>
                    <li>Passe o mouse sobre uma tarefa e clique no ícone de lixeira para removê-la</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Dicas para classificar suas tarefas:</h4>
                  <ul className="space-y-1 text-sm list-disc pl-5">
                    <li><strong>Q1 (Vermelho):</strong> Crises, problemas urgentes, prazos inadiáveis</li>
                    <li><strong>Q2 (Verde):</strong> Planejamento, desenvolvimento pessoal, relacionamentos</li>
                    <li><strong>Q3 (Amarelo):</strong> Interrupções, algumas reuniões, e-mails</li>
                    <li><strong>Q4 (Cinza):</strong> Distrações, atividades triviais, procrastinação</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm">
                As tarefas que você adicionar ficarão salvas apenas neste navegador. Para salvar permanentemente e 
                acessar recursos avançados, crie uma conta.
              </p>
            </AlertDescription>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </motion.div>
  );
};

export default TutorialAlert;
