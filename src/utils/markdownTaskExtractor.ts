
import { MarkdownTask } from './markdownTypes';
import * as regex from './markdownRegex';

/**
 * Process a task in traditional Markdown format: "- [ ] Task description"
 */
export function processTraditionalTask(taskMatch: RegExpMatchArray): MarkdownTask | null {
  const isCompleted = taskMatch[1].toLowerCase() === 'x';
  const taskText = taskMatch[2].trim();
  
  // If the task is already completed, ignore it
  if (isCompleted) {
    return null;
  }
  
  // Extract tags from the task description
  const tags: string[] = [];
  let tagMatch;
  const tagRegexClone = new RegExp(regex.tagsRegex);
  while ((tagMatch = tagRegexClone.exec(taskText)) !== null) {
    tags.push(tagMatch[1]);
  }
  
  // Clean the description by removing tags
  const cleanDescription = taskText.replace(regex.tagsRegex, '').trim();
  
  // Extract importance and urgency metadata
  const importanceMatch = cleanDescription.match(regex.importanceRegex);
  const urgencyMatch = cleanDescription.match(regex.urgencyRegex);
  
  // Default or extracted values
  const importance = importanceMatch ? parseInt(importanceMatch[1], 10) : 5;
  const urgency = urgencyMatch ? parseInt(urgencyMatch[1], 10) : 5;
  
  // Title is the clean description without metadata
  const title = cleanDescription
    .replace(regex.importanceRegex, '')
    .replace(regex.urgencyRegex, '')
    .trim();
  
  return {
    title,
    importance: Math.min(Math.max(importance, 1), 10),
    urgency: Math.min(Math.max(urgency, 1), 10),
    tags: tags.length > 0 ? tags : undefined
  };
}

/**
 * Process a task in alternative format with metadata fields
 */
export function processAlternativeTaskBlock(
  lines: string[], 
  startIndex: number, 
  endIndex: number
): { task: MarkdownTask | null; nextIndex: number } {
  const title = lines[startIndex].trim();
  let description = "";
  let urgency = 5;
  let importance = 5;
  let tags: string[] = [];
  let deadlines = "";
  let finalizado = "";
  let foundTaskInfo = false;
  
  let i = startIndex + 1;
  while (i <= endIndex) {
    const line = lines[i].trim();
    
    const importantMatch = line.match(regex.importantLineRegex);
    const urgenteMatch = line.match(regex.urgenteLineRegex);
    const statusMatch = line.match(regex.statusLineRegex);
    const deadlinesMatch = line.match(regex.deadlinesLineRegex);
    const finalizadoMatch = line.match(regex.finalizadoLineRegex);
    
    if (importantMatch) {
      const isImportant = importantMatch[1].toLowerCase() === 'sim' || importantMatch[1].toLowerCase() === 'yes';
      importance = isImportant ? 9 : 3;
      foundTaskInfo = true;
    } else if (urgenteMatch) {
      const isUrgent = urgenteMatch[1].toLowerCase() === 'sim' || urgenteMatch[1].toLowerCase() === 'yes';
      urgency = isUrgent ? 9 : 3;
      foundTaskInfo = true;
    } else if (statusMatch) {
      // Use status to determine quadrants
      const status = statusMatch[1].trim();
      
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
    } else if (line === "" || i === endIndex || regex.titleLineRegex.test(line) && line !== title) {
      // Blank line, end of file, or new task = end of current task
      break;
    } else {
      // Add to description
      if (description) {
        description += "\n" + line;
      } else {
        description = line;
      }
    }
    
    i++;
  }
  
  // If we found task metadata, return the task
  if (foundTaskInfo) {
    return {
      task: {
        title,
        description: description || undefined,
        importance: Math.min(Math.max(importance, 1), 10),
        urgency: Math.min(Math.max(urgency, 1), 10),
        tags: tags.length > 0 ? tags : undefined,
        deadlines: deadlines || undefined,
        finalizado: finalizado || undefined
      },
      nextIndex: i - 1
    };
  }
  
  // No task info found
  return { task: null, nextIndex: i - 1 };
}
