
import React from 'react';
import { Clock, ListChecks, Lightbulb } from 'lucide-react';

interface AnimationIconsProps {
  iconRotation: number;
}

const AnimationIcons: React.FC<AnimationIconsProps> = ({ iconRotation }) => {
  const icons = [
    <Clock key="clock" className="w-4 h-4 text-indigo-500" />,
    <ListChecks key="list" className="w-4 h-4 text-purple-500" />,
    <Lightbulb key="lightbulb" className="w-4 h-4 text-pink-500" />
  ];
  
  return (
    <>
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-md"
          style={{
            top: `${50 + 42 * Math.sin(2 * Math.PI * i / icons.length + iconRotation / 180)}%`,
            left: `${50 + 42 * Math.cos(2 * Math.PI * i / icons.length + iconRotation / 180)}%`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.9,
            transition: 'all 0.5s ease-out'
          }}
        >
          {icon}
        </div>
      ))}
    </>
  );
};

export default AnimationIcons;
