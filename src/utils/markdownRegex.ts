
/**
 * Collection of regular expressions for Markdown parsing
 */

// Regular expressions for traditional Markdown task format
export const headingRegex = /^#{1,6}\s+(.+)$/;
export const taskRegex = /^\s*[-*]\s+\[([ x])\]\s+(.+)$/i;
export const importanceRegex = /importance[:=]\s*(\d+)/i;
export const urgencyRegex = /urgency[:=]\s*(\d+)/i;
export const tagsRegex = /#([a-zA-Z0-9_]+)/g;

// Regular expressions for alternative task format
export const titleLineRegex = /^.+$/;
export const importantLineRegex = /^Importante:\s*(Sim|Não|No|Yes)$/i;
export const urgenteLineRegex = /^Urgente:\s*(Sim|Não|No|Yes)$/i;
export const statusLineRegex = /^Status:\s*(.+)$/i;
export const deadlinesLineRegex = /^Deadlines:\s*(.+)$/i;
export const finalizadoLineRegex = /^Finalizado:\s*(Sim|Não|No|Yes)$/i;
