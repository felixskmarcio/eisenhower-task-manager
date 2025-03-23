import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload, Check, AlertTriangle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { extractTasksFromMarkdown } from '@/utils/markdownUtils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MarkdownImport: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
        setSelectedFile(file);
        setImportStatus('idle');
        setErrorMessage("");
      } else {
        toast({
          title: "Formato de arquivo inválido",
          description: "Por favor, selecione um arquivo Markdown (.md ou .markdown).",
          variant: "destructive"
        });
        setSelectedFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    try {
      const fileContent = await readFileAsText(selectedFile);
      const tasks = extractTasksFromMarkdown(fileContent);
      
      // Simular um atraso para feedback visual
      setTimeout(() => {
        if (tasks.length > 0) {
          // Adicionar propriedades necessárias para compatibilidade com o formato Task usado em Matrix.tsx
          const processedTasks = tasks.map(task => ({
            ...task,
            id: `md-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            completed: false,
            description: task.description || "", // Garantir que description nunca seja undefined
            quadrant: determineQuadrant(task.importance, task.urgency),
            createdAt: new Date().toISOString(),
            completedAt: null
          }));

          // Simulação de armazenamento das tarefas
          localStorage.setItem('importedMarkdownTasks', JSON.stringify(processedTasks));
          
          toast({
            title: "Importação concluída",
            description: `${tasks.length} tarefas foram importadas com sucesso.`,
            variant: "default"
          });
          
          setImportStatus('success');
          setErrorMessage("");
        } else {
          const errorMsg = "O arquivo não contém tarefas no formato esperado. Verifique se seu Markdown contém tarefas no formato adequado, como '- [ ] Tarefa' ou com marcadores 'Urgente:' e 'Importante:'.";
          setErrorMessage(errorMsg);
          
          toast({
            title: "Nenhuma tarefa encontrada",
            description: errorMsg,
            variant: "destructive"
          });
          setImportStatus('error');
        }
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      const errorMsg = "Ocorreu um erro ao processar o arquivo. Verifique o formato e tente novamente.";
      setErrorMessage(errorMsg);
      
      toast({
        title: "Erro ao importar",
        description: errorMsg,
        variant: "destructive"
      });
      setImportStatus('error');
      setIsLoading(false);
    }
  };

  // Helper function to determine quadrant from importance and urgency
  const determineQuadrant = (importance: number, urgency: number): number => {
    if (importance > 6 && urgency > 6) return 0; // Quadrante 1: Importante e Urgente
    if (importance > 6) return 1; // Quadrante 2: Importante, mas não Urgente
    if (urgency > 6) return 2; // Quadrante 3: Não Importante, mas Urgente
    return 3; // Quadrante 4: Não Importante e Não Urgente
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('Falha ao ler o arquivo'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsText(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
        <input
          type="file"
          id="markdownFile"
          accept=".md,.markdown"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <label 
          htmlFor="markdownFile" 
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <FileText size={40} className="text-primary/70" />
          <p className="font-medium">
            {selectedFile ? selectedFile.name : "Selecione um arquivo Markdown"}
          </p>
          <p className="text-sm text-muted-foreground">
            Arraste e solte ou clique para selecionar
          </p>
        </label>
      </div>
      
      {selectedFile && (
        <div className="space-y-3">
          <Button 
            onClick={handleImport}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                Importando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload size={16} />
                Importar Tarefas
              </span>
            )}
          </Button>
          
          {importStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span className="text-sm text-muted-foreground">
                Importação concluída com sucesso
              </span>
            </div>
          )}
          
          {importStatus === 'error' && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro na importação</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <Alert variant="default" className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4" />
            <AlertTitle>Formatos suportados</AlertTitle>
            <AlertDescription>
              <p className="text-sm mt-1">O importador suporta os seguintes formatos de tarefas:</p>
              <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                <li>Lista de tarefas Markdown: <code>- [ ] Título da tarefa #tag importance:8 urgency:7</code></li>
                <li>Formato com metadados separados:<br />
                  <code>Título da tarefa<br />
                  Urgente: Sim/No<br />
                  Importante: Sim/No<br />
                  Deadlines: Data<br />
                  Finalizado: Sim/No<br />
                  Status: ❶/❷/❸/❹</code>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default MarkdownImport;
