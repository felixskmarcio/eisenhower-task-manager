
interface MarkdownTask {
  title: string;
  description?: string;
  urgency: number;
  importance: number;
  tags?: string[];
}

/**
 * Extrai tarefas de um arquivo Markdown.
 * Procura por cabeçalhos e listas de tarefas no formato Markdown.
 */
export const extractTasksFromMarkdown = (markdownContent: string): MarkdownTask[] => {
  const tasks: MarkdownTask[] = [];
  
  // Dividir o conteúdo em linhas
  const lines = markdownContent.split('\n');
  
  let currentSection = "";
  let currentTask: Partial<MarkdownTask> | null = null;
  
  // Expressões regulares para identificar padrões no Markdown
  const headingRegex = /^#{1,6}\s+(.+)$/;
  const taskRegex = /^\s*[-*]\s+\[([ x])\]\s+(.+)$/i;
  const importanceRegex = /importance[:=]\s*(\d+)/i;
  const urgencyRegex = /urgency[:=]\s*(\d+)/i;
  const tagsRegex = /#([a-zA-Z0-9_]+)/g;
  
  for (const line of lines) {
    const headingMatch = line.match(headingRegex);
    const taskMatch = line.match(taskRegex);
    
    if (headingMatch) {
      // Encontrou um cabeçalho, define a seção atual
      currentSection = headingMatch[1].trim();
    } else if (taskMatch) {
      // Encontrou uma tarefa no formato "- [ ] Descrição da tarefa"
      const isCompleted = taskMatch[1].toLowerCase() === 'x';
      const taskText = taskMatch[2].trim();
      
      // Se a tarefa estiver concluída, ignoramos (não queremos importar tarefas já concluídas)
      if (!isCompleted) {
        // Extrair tags da descrição da tarefa
        const tags: string[] = [];
        let tagMatch;
        while ((tagMatch = tagsRegex.exec(taskText)) !== null) {
          tags.push(tagMatch[1]);
        }
        
        // Limpar a descrição removendo as tags
        const cleanDescription = taskText.replace(tagsRegex, '').trim();
        
        // Tentar extrair importância e urgência da descrição
        const importanceMatch = cleanDescription.match(importanceRegex);
        const urgencyMatch = cleanDescription.match(urgencyRegex);
        
        // Valores padrão ou extraídos
        const importance = importanceMatch ? parseInt(importanceMatch[1], 10) : 5;
        const urgency = urgencyMatch ? parseInt(urgencyMatch[1], 10) : 5;
        
        // Título é a descrição limpa, sem os metadados
        const title = cleanDescription
          .replace(importanceRegex, '')
          .replace(urgencyRegex, '')
          .trim();
        
        tasks.push({
          title,
          description: currentSection !== title ? currentSection : undefined,
          importance: Math.min(Math.max(importance, 1), 10), // Limitar entre 1 e 10
          urgency: Math.min(Math.max(urgency, 1), 10), // Limitar entre 1 e 10
          tags: tags.length > 0 ? tags : undefined
        });
      }
    }
  }
  
  return tasks;
};

/**
 * Analisa o conteúdo Markdown para tentar inferir o quadrante da tarefa
 * com base na urgência e importância.
 */
export const determineTaskQuadrant = (urgency: number, importance: number): number => {
  if (importance > 6 && urgency > 6) return 0; // Quadrante 1: Importante e Urgente
  if (importance > 6) return 1; // Quadrante 2: Importante, mas não Urgente
  if (urgency > 6) return 2; // Quadrante 3: Não Importante, mas Urgente
  return 3; // Quadrante 4: Não Importante e Não Urgente
};

/**
 * Exemplo de um Markdown que contém tarefas para teste
 */
export const sampleMarkdown = `# Projeto X

## Tarefas de Alta Prioridade

- [ ] Finalizar a apresentação do projeto #work #presentation importance:9 urgency:8
- [ ] Agendar reunião com stakeholders #meeting urgency:7 importance:9
- [ ] Revisar proposta do cliente #client importance:8 urgency:9

## Desenvolvimento

- [ ] Implementar nova feature de login #dev importance:7 urgency:5
- [ ] Corrigir bugs reportados #bugfix importance:6 urgency:7
- [ ] Documentar API #documentation importance:7 urgency:4

## Pessoal

- [ ] Agendar consulta médica #health importance:8 urgency:6
- [ ] Pagar contas #finance importance:7 urgency:8
- [ ] Estudar para certificação #learning importance:9 urgency:5
`;
