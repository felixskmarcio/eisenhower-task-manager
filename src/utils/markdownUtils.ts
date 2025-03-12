
interface MarkdownTask {
  title: string;
  description?: string;
  urgency: number;
  importance: number;
  tags?: string[];
  deadlines?: string;
  finalizado?: string;
}

/**
 * Extrai tarefas de um arquivo Markdown.
 * Procura por cabeçalhos e listas de tarefas no formato Markdown.
 * Também suporta formatos como "Urgente: Sim/No" e "Importante: Sim/No".
 */
export const extractTasksFromMarkdown = (markdownContent: string): MarkdownTask[] => {
  const tasks: MarkdownTask[] = [];
  
  // Dividir o conteúdo em linhas
  const lines = markdownContent.split('\n');
  
  let currentSection = "";
  let currentTitle = "";
  let description = "";
  let urgency = 5;
  let importance = 5;
  let tags: string[] = [];
  let deadlines = "";
  let finalizado = "";
  let isTaskStart = false;
  
  // Expressões regulares para identificar padrões no Markdown
  const headingRegex = /^#{1,6}\s+(.+)$/;
  const taskRegex = /^\s*[-*]\s+\[([ x])\]\s+(.+)$/i;
  const importanceRegex = /importance[:=]\s*(\d+)/i;
  const urgencyRegex = /urgency[:=]\s*(\d+)/i;
  const tagsRegex = /#([a-zA-Z0-9_]+)/g;
  
  // Novos padrões para suportar o formato adicional
  const titleLineRegex = /^.+$/;
  const importantLineRegex = /^Importante:\s*(Sim|Não|No|Yes)$/i;
  const urgenteLineRegex = /^Urgente:\s*(Sim|Não|No|Yes)$/i;
  const statusLineRegex = /^Status:\s*(.+)$/i;
  const deadlinesLineRegex = /^Deadlines:\s*(.+)$/i;
  const finalizadoLineRegex = /^Finalizado:\s*(Sim|Não|No|Yes)$/i;
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Verifica se é um cabeçalho no formato tradicional
    const headingMatch = line.match(headingRegex);
    const taskMatch = line.match(taskRegex);
    
    if (headingMatch) {
      // Encontrou um cabeçalho, define a seção atual
      currentSection = headingMatch[1].trim();
      
      // Se temos uma tarefa em andamento, vamos finalizá-la
      if (isTaskStart && currentTitle) {
        tasks.push({
          title: currentTitle,
          description: description || undefined,
          importance: Math.min(Math.max(importance, 1), 10),
          urgency: Math.min(Math.max(urgency, 1), 10),
          tags: tags.length > 0 ? tags : undefined,
          deadlines: deadlines || undefined,
          finalizado: finalizado || undefined
        });
        
        // Reseta os valores
        currentTitle = "";
        description = "";
        urgency = 5;
        importance = 5;
        tags = [];
        deadlines = "";
        finalizado = "";
        isTaskStart = false;
      }
    } else if (taskMatch) {
      // Formato tradicional: "- [ ] Descrição da tarefa"
      const isCompleted = taskMatch[1].toLowerCase() === 'x';
      const taskText = taskMatch[2].trim();
      
      // Se a tarefa estiver concluída, ignoramos (não queremos importar tarefas já concluídas)
      if (!isCompleted) {
        // Extrair tags da descrição da tarefa
        tags = [];
        let tagMatch;
        const tagRegexClone = new RegExp(tagsRegex);
        while ((tagMatch = tagRegexClone.exec(taskText)) !== null) {
          tags.push(tagMatch[1]);
        }
        
        // Limpar a descrição removendo as tags
        const cleanDescription = taskText.replace(tagsRegex, '').trim();
        
        // Tentar extrair importância e urgência da descrição
        const importanceMatch = cleanDescription.match(importanceRegex);
        const urgencyMatch = cleanDescription.match(urgencyRegex);
        
        // Valores padrão ou extraídos
        importance = importanceMatch ? parseInt(importanceMatch[1], 10) : 5;
        urgency = urgencyMatch ? parseInt(urgencyMatch[1], 10) : 5;
        
        // Título é a descrição limpa, sem os metadados
        currentTitle = cleanDescription
          .replace(importanceRegex, '')
          .replace(urgencyRegex, '')
          .trim();
        
        tasks.push({
          title: currentTitle,
          description: currentSection !== currentTitle ? currentSection : undefined,
          importance: Math.min(Math.max(importance, 1), 10),
          urgency: Math.min(Math.max(urgency, 1), 10),
          tags: tags.length > 0 ? tags : undefined
        });
        
        // Reseta os valores
        currentTitle = "";
        description = "";
        urgency = 5;
        importance = 5;
        tags = [];
        deadlines = "";
        finalizado = "";
      }
    } else if (titleLineRegex.test(line) && !isTaskStart && line !== "") {
      // Possível início de uma tarefa no novo formato
      currentTitle = line;
      isTaskStart = true;
      
      // Vamos tentar reunir informações sobre essa tarefa
      let j = i + 1;
      let foundTaskInfo = false;
      
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        
        const importantMatch = nextLine.match(importantLineRegex);
        const urgenteMatch = nextLine.match(urgenteLineRegex);
        const statusMatch = nextLine.match(statusLineRegex);
        const deadlinesMatch = nextLine.match(deadlinesLineRegex);
        const finalizadoMatch = nextLine.match(finalizadoLineRegex);
        
        if (importantMatch) {
          const isImportant = importantMatch[1].toLowerCase() === 'sim' || importantMatch[1].toLowerCase() === 'yes';
          importance = isImportant ? 9 : 3;
          foundTaskInfo = true;
        } else if (urgenteMatch) {
          const isUrgent = urgenteMatch[1].toLowerCase() === 'sim' || urgenteMatch[1].toLowerCase() === 'yes';
          urgency = isUrgent ? 9 : 3;
          foundTaskInfo = true;
        } else if (statusMatch) {
          // Utilizamos o status para determinar os quadrantes
          const status = statusMatch[1].trim();
          
          // Verifica se o status contém numerais como "❶", "❷", "❸", "❹"
          if (status.includes("❶")) {
            urgency = 9;
            importance = 9;
          } else if (status.includes("❷")) {
            urgency = 3;
            importance = 9;
          } else if (status.includes("❸")) {
            urgency = 9;
            importance = 3;
          } else if (status.includes("❹")) {
            urgency = 3;
            importance = 3;
          }
          
          foundTaskInfo = true;
        } else if (deadlinesMatch) {
          deadlines = deadlinesMatch[1].trim();
          foundTaskInfo = true;
        } else if (finalizadoMatch) {
          finalizado = finalizadoMatch[1].trim();
          foundTaskInfo = true;
        } else if (nextLine === "" || j === lines.length - 1 || nextLine.match(titleLineRegex)) {
          // Uma linha em branco ou final do arquivo ou nova tarefa = fim da tarefa atual
          break;
        } else {
          // Adicione à descrição
          if (description) {
            description += "\n" + nextLine;
          } else {
            description = nextLine;
          }
        }
        
        j++;
      }
      
      // Se encontramos informações da tarefa, adicionamos à lista
      if (foundTaskInfo) {
        tasks.push({
          title: currentTitle,
          description: description || undefined,
          importance: Math.min(Math.max(importance, 1), 10),
          urgency: Math.min(Math.max(urgency, 1), 10),
          tags: tags.length > 0 ? tags : undefined,
          deadlines: deadlines || undefined,
          finalizado: finalizado || undefined
        });
        
        // Avançamos o índice para após esta tarefa
        i = j - 1;
      }
      
      // Reseta os valores
      currentTitle = "";
      description = "";
      urgency = 5;
      importance = 5;
      tags = [];
      deadlines = "";
      finalizado = "";
      isTaskStart = false;
    }
    
    i++;
  }
  
  // Se ainda tiver uma tarefa em processamento no final, adicione-a
  if (isTaskStart && currentTitle) {
    tasks.push({
      title: currentTitle,
      description: description || undefined,
      importance: Math.min(Math.max(importance, 1), 10),
      urgency: Math.min(Math.max(urgency, 1), 10),
      tags: tags.length > 0 ? tags : undefined,
      deadlines: deadlines || undefined,
      finalizado: finalizado || undefined
    });
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

# Exemplo Formato Alternativo

IXC Experience - Clientes IXC Soft
R$ 500,00 (+ R$ 50,00 taxa)

Urgente: No
Importante: No
Deadlines: 1 de fevereiro de 2025
Finalizado: No
Status: ❹ Eliminar
`;
