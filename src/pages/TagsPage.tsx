import React from 'react';
import TagManager from '../components/TagManager';
import { ArrowLeft, Terminal, Tag, Folder, MapPin, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTags } from '@/contexts/TagContext';
import { motion } from 'framer-motion';

const TagsPage = () => {
  const { tags } = useTags();

  // Contagem por categoria
  const projectCount = tags.filter(t => t.type === 'project').length;
  const contextCount = tags.filter(t => t.type === 'context').length;
  const lifeareaCount = tags.filter(t => t.type === 'lifearea').length;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-800 pb-6 relative"
        >
          {/* Scanline accent no header */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(204, 255, 0, 0.15) 2px, rgba(204, 255, 0, 0.15) 3px)',
            }}
          />

          <div className="flex items-center gap-4 relative z-10">
            <Link to="/" className="p-2 hover:bg-zinc-800 transition-colors group border border-transparent hover:border-zinc-700">
              <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-[#ccff00] transition-colors" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-4 h-4 text-[#ccff00]" style={{ filter: 'drop-shadow(0 0 4px rgba(204, 255, 0, 0.4))' }} />
                <span className="text-xs font-mono text-[#ccff00] tracking-widest uppercase">System.Config</span>
              </div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-white">
                Gerenciador de Tags
              </h1>
              <p className="text-zinc-500 text-xs font-mono mt-1.5 max-w-md">
                Organize suas tarefas com tags de projeto, contexto e áreas de vida. Crie, edite e categorize livremente.
              </p>
            </div>
          </div>

          {/* Stats por categoria + total */}
          <div className="mt-4 md:mt-0 flex gap-2 items-center flex-wrap relative z-10">
            {/* Mini-badges por tipo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border text-[10px] font-mono uppercase tracking-wider"
              style={{
                backgroundColor: 'rgba(204, 255, 0, 0.05)',
                borderColor: 'rgba(204, 255, 0, 0.15)',
                color: '#ccff00',
              }}
            >
              <Folder className="w-3 h-3" />
              <span>{projectCount}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border text-[10px] font-mono uppercase tracking-wider"
              style={{
                backgroundColor: 'rgba(34, 211, 238, 0.05)',
                borderColor: 'rgba(34, 211, 238, 0.15)',
                color: '#22d3ee',
              }}
            >
              <MapPin className="w-3 h-3" />
              <span>{contextCount}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border text-[10px] font-mono uppercase tracking-wider"
              style={{
                backgroundColor: 'rgba(251, 191, 36, 0.05)',
                borderColor: 'rgba(251, 191, 36, 0.15)',
                color: '#fbbf24',
              }}
            >
              <Target className="w-3 h-3" />
              <span>{lifeareaCount}</span>
            </motion.div>

            {/* Separador vertical */}
            <div className="w-px h-6 bg-zinc-800 mx-1 hidden md:block" />

            {/* Total */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Tag className="w-3 h-3" style={{ filter: 'drop-shadow(0 0 3px rgba(204, 255, 0, 0.3))' }} />
              {tags.length} tag{tags.length !== 1 ? 's' : ''}
            </motion.div>

            {/* Status indicator */}
            <div
              className="px-3 py-1.5 border text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5"
              style={{
                backgroundColor: 'rgba(204, 255, 0, 0.06)',
                borderColor: 'rgba(204, 255, 0, 0.15)',
                color: '#ccff00',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#ccff00] inline-block"
                style={{
                  boxShadow: '0 0 6px rgba(204, 255, 0, 0.6)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}
              />
              Online
            </div>
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <TagManager />
        </div>
      </div>

      {/* Keyframes para pulse suave */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(204, 255, 0, 0.6); }
          50% { opacity: 0.5; box-shadow: 0 0 2px rgba(204, 255, 0, 0.3); }
        }
      `}</style>
    </div>
  );
};

export default TagsPage;