
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BenefitItemProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  delay: number;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-primary/5 p-4 rounded-lg"
    >
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        {React.cloneElement(icon, { className: "h-5 w-5 mr-2 text-primary" })}
        {title}
      </h3>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </motion.div>
  );
};

export default BenefitItem;
