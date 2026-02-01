import React from 'react';
import { Matrix } from '../components/Matrix';
import { Clock, CheckCircle2, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8 md:mb-12 text-center pt-4 md:pt-8"
        >
          <div className="inline-flex items-center justify-center -space-x-4 mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#18181b] border border-[#27272a] hover:border-[#ccff00] transition-colors z-20 shadow-lg">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-[#ccff00]" />
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#18181b] border border-[#27272a] hover:border-[#ccff00] transition-colors z-10 transform -rotate-6 shadow-lg">
              <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 text-[#ccff00]" />
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#18181b] border border-[#27272a] hover:border-[#ccff00] transition-colors z-0 transform rotate-6 shadow-lg">
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-[#ccff00]" />
            </div>
          </div>


          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase font-display mb-2"
            initial={{ letterSpacing: "-0.05em" }}
            animate={{ letterSpacing: "0" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            Matriz Tática <span className="text-[#ccff00]">Eisenhower</span>
          </motion.h1>

          <motion.p
            className="text-[#a1a1aa] font-mono text-xs md:text-sm max-w-lg mx-auto mt-4 px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            &gt; Inicializando protocolo de produtividade. <br />
            &gt; Classifique operações por urgência e importância.
          </motion.p>
        </motion.div>

        <Matrix />
      </div>
    </div>
  );
};

export default Index;
