
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-10 text-center"
    >
      <Link to="/demo">
        <Button size="lg" className="group">
          Ver demonstração
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
      <p className="text-muted-foreground mt-4 text-sm">
        Ou <Link to="/login" className="text-primary hover:underline">faça login</Link> para começar a usar agora mesmo.
      </p>
    </motion.div>
  );
};

export default CallToAction;
