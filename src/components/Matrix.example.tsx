// Exemplo de como atualizar o Matrix.tsx para usar classes CSS ao invés de classes inline
// Este arquivo serve como referência para a refatoração

// CLASSES INLINE ATUAIS (a serem substituídas):
// className={`quadrant-card q${quadrantIndex + 1} h-full flex flex-col border border-[#27272a] bg-[#18181b] ${isDragOver ? 'ring-1 ring-[#ccff00] border-[#ccff00]' : ''}`}

// CLASSES CSS SUBSTITUTAS:
// className={`quadrant-card q${quadrantIndex + 1} h-full flex flex-col border bg-industrial-surface border-industrial-border ${isDragOver ? 'ring-industrial-accent border-industrial-accent' : ''}`}

// EXEMPLO DE IMPLEMENTAÇÃO:

/*
const QuadrantCard = ({ 
  title, 
  description, 
  children, 
  urgentLabel, 
  importantLabel, 
  colorClass, 
  quadrantIndex 
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `quadrant-${quadrantIndex}`,
  });

  const isDragOver = isOver || overQuadrant === quadrantIndex;
  
  // Mapeamento de classes de cor para os indicadores
  const indicatorColorClass = {
    'red': 'bg-[#ff5555]',
    'blue': 'bg-[#8be9fd]', 
    'yellow': 'bg-[#f1fa8c]',
    'purple': 'bg-[#bd93f9]'
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={`quadrant-card q${quadrantIndex + 1} h-full flex flex-col border bg-industrial-surface border-industrial-border ${isDragOver ? 'ring-industrial-accent border-industrial-accent' : ''}`}
      animate={isDragOver ? {
        scale: 1.01,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
      } : {
        scale: 1,
        boxShadow: "none"
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className={`p-4 border-b bg-industrial-surface border-industrial-border flex justify-between items-center`}>
        <div>
          <h2 className="text-lg font-display font-bold uppercase tracking-wider text-industrial-text mb-1">{title}</h2>
          <p className="text-xs text-industrial-text-muted font-mono">{description}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-none ${indicatorColorClass[colorClass] || 'bg-industrial-accent'}`}></span>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-y-auto custom-scrollbar bg-industrial-bg relative">
        // ... resto do conteúdo
      </div>
    </motion.div>
  );
};
*/

// BENEFÍCIOS DA MUDANÇA:
// 1. Consistência: Todas as cores seguem o design system
// 2. Manutenibilidade: Mudanças de cores em um único lugar
// 3. Performance: Menos classes inline para processar
// 4. Legibilidade: Código mais limpo e semântico