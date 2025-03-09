
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload, Check, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { extractTasksFromMarkdown } from '@/utils/markdownUtils';

const MarkdownImport: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
        setSelectedFile(file);
        setImportStatus('idle');
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
          // Simulação de armazenamento das tarefas
          // Num caso real, você enviaria estas tarefas para o estado global
          // ou para a API do seu aplicativo
          localStorage.setItem('importedMarkdownTasks', JSON.stringify(tasks));
          
          toast({
            title: "Importação concluída",
            description: `${tasks.length} tarefas foram importadas com sucesso.`,
            variant: "default"
          });
          
          setImportStatus('success');
        } else {
          toast({
            title: "Nenhuma tarefa encontrada",
            description: "O arquivo não contém tarefas válidas para importação.",
            variant: "destructive"
          });
          setImportStatus('error');
        }
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      toast({
        title: "Erro ao importar",
        description: "Ocorreu um erro ao processar o arquivo. Tente novamente.",
        variant: "destructive"
      });
      setImportStatus('error');
      setIsLoading(false);
    }
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
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-sm text-muted-foreground">
                Ocorreu um erro ao importar o arquivo
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownImport;
