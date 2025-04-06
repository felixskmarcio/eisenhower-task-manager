
import React from 'react';
import { motion } from 'framer-motion';

interface HeaderSectionProps {
  title: string;
  description: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-10">
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-muted-foreground text-lg max-w-2xl mx-auto"
      >
        {description}
      </motion.p>
    </div>
  );
};

export default HeaderSection;
