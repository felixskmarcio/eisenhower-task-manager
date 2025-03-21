import { useState } from 'react';

interface Task {
  title: string;
  important: boolean;
  urgent: boolean;
  deadline: Date | null;
  completed: boolean;
  status: '❶ Executar' | '❷ Agendar' | '❸ Delegar' | '❹ Eliminar';
}

interface ImportProps {
  onImport: (tasks: Task[]) => void;
}

export function ImportData({ onImport }: ImportProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      const file = event.target.files?.[0];
      
      if (!file) return;
      
      if (!file.name.endsWith('.md')) {
        throw new Error('Por favor, selecione um arquivo Markdown (.md)');
      }

      const content = await file.text();
      const tasks = parseMarkdownContent(content);
      onImport(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar arquivo');
    }
  };

  return (
    <div className="import-container">
      <div className="upload-area">
        <label htmlFor="file-input" className="file-label">
          <input
            id="file-input"
            type="file"
            accept=".md"
            onChange={handleFileSelect}
            className="file-input"
            aria-label="Selecione um arquivo Markdown"
          />
          <p>Arraste e solte ou clique para selecionar</p>
        </label>
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
    </div>
  );
}

function parseMarkdownContent(content: string): Task[] {
  const tasks: Task[] = [];
  const lines = content.split('\n');
  let currentTask: Partial<Task> | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Se é uma tarefa (linha que não tem ":" e não é cabeçalho)
    if (!trimmedLine.includes(':') && !trimmedLine.startsWith('#')) {
      if (currentTask?.title) {
        tasks.push(currentTask as Task);
      }

      currentTask = {
        title: trimmedLine,
        completed: false,
        important: false,
        urgent: false,
        deadline: null,
        status: '❶ Executar'
      };
      continue;
    }

    // Processa metadados da tarefa
    if (currentTask && trimmedLine.includes(':')) {
      const [key, value] = trimmedLine.split(':').map(s => s.trim());
      
      switch(key.toLowerCase()) {
        case 'urgente':
          currentTask.urgent = value.toLowerCase() === 'sim';
          break;
        case 'importante':
          currentTask.important = value.toLowerCase() === 'sim';
          break;
        case 'deadlines':
        case 'deadline':
          try {
            const [day, month, year] = value.split('/').map(Number);
            currentTask.deadline = new Date(year, month - 1, day);
          } catch {
            currentTask.deadline = null;
          }
          break;
        case 'status':
          currentTask.status = getTaskStatus(value);
          break;
        case 'finalizado':
          currentTask.completed = value.toLowerCase() === 'sim';
          break;
      }
    }
  }

  if (currentTask?.title) {
    tasks.push(currentTask as Task);
  }

  if (tasks.length === 0) {
    throw new Error('Nenhuma tarefa encontrada no arquivo. Verifique o formato do arquivo.');
  }

  return tasks;
}

function getTaskStatus(value: string): Task['status'] {
  if (value.includes('Delegar')) return '❸ Delegar';
  if (value.includes('Agendar')) return '❷ Agendar';
  if (value.includes('Eliminar')) return '❹ Eliminar';
  return '❶ Executar';
} 