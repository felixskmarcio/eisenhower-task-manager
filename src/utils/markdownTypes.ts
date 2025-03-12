
/**
 * Interface representing a task extracted from Markdown
 */
export interface MarkdownTask {
  title: string;
  description?: string;
  urgency: number;
  importance: number;
  tags?: string[];
  deadlines?: string;
  finalizado?: string;
}
