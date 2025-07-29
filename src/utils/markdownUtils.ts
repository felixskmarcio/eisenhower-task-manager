
import { MarkdownTask } from './markdownTypes';
import * as regex from './markdownRegex';
import { processTraditionalTask, processAlternativeTaskBlock } from './markdownTaskExtractor';

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
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Verifica se é um cabeçalho no formato tradicional
    const headingMatch = line.match(regex.headingRegex);
    const taskMatch = line.match(regex.taskRegex);
    
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
      // Processo para formato tradicional de tarefas Markdown
      const task = processTraditionalTask(taskMatch);
      if (task) {
        // Adicione o contexto da seção atual como descrição se relevante
        if (currentSection && currentSection !== task.title) {
          task.description = currentSection;
        }
        tasks.push(task);
      }
    } else if (regex.titleLineRegex.test(line) && !isTaskStart && line !== "") {
      // Possível início de uma tarefa no formato alternativo
      currentTitle = line;
      isTaskStart = true;
      
      // Processa o bloco de tarefa alternativo
      const result = processAlternativeTaskBlock(lines, i, lines.length - 1);
      if (result.task) {
        tasks.push(result.task);
        i = result.nextIndex;
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
 * Exemplo de um Markdown que contém tarefas
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
