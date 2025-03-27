import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Star, 
  Sparkle, 
  CalendarDays, 
  FileText, 
  Tag, 
  RefreshCcw, 
  Layers, 
  Search, 
  FileCheck, 
  LucideIcon 
} from 'lucide-react';

type TaskIconName = 
  | 'complete' 
  | 'pending' 
  | 'important' 
  | 'urgent' 
  | 'calendar' 
  | 'notes' 
  | 'tag' 
  | 'recurring' 
  | 'project' 
  | 'search' 
  | 'verified'
  | 'sparkle';

interface TaskIconProps {
  name: TaskIconName;
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

const icons: Record<TaskIconName, LucideIcon> = {
  complete: CheckCircle2,
  pending: Clock,
  important: Star,
  urgent: AlertTriangle,
  calendar: CalendarDays,
  notes: FileText,
  tag: Tag,
  recurring: RefreshCcw,
  project: Layers,
  search: Search,
  verified: FileCheck,
  sparkle: Sparkle
};

const getAnimationProps = (name: TaskIconName) => {
  switch (name) {
    case 'complete':
      return {
        initial: { scale: 0, rotate: -45 },
        animate: { scale: 1, rotate: 0 },
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      };
    case 'important':
      return {
        initial: { scale: 0.6 },
        animate: { scale: [0.6, 1.2, 1] },
        transition: { duration: 0.6 }
      };
    case 'urgent':
      return {
        initial: { y: -10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { type: 'spring', stiffness: 500, damping: 15 }
      };
    case 'sparkle':
      return {
        initial: { opacity: 0, rotate: -30, scale: 0.5 },
        animate: { opacity: 1, rotate: 0, scale: 1 },
        transition: { duration: 0.4, ease: 'easeOut' }
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      };
  }
};

export function TaskIcon({ name, size = 20, color, className = '', animated = true }: TaskIconProps) {
  const Icon = icons[name];
  
  if (!Icon) {
    return null;
  }

  const animationProps = animated ? getAnimationProps(name) : {};

  return (
    <motion.div 
      className="inline-block" 
      {...animationProps}
    >
      <Icon 
        size={size} 
        className={className} 
        color={color}
      />
    </motion.div>
  );
} 