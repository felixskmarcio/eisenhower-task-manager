
/**
 * Format a date for display
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleString('pt-BR', options);
};
