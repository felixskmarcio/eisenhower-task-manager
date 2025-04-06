
import React from 'react';
import AnimationIcons from './AnimationIcons';

interface LoadingProgressProps {
  loadingProgress: number;
  iconRotation: number;
  hoverEffect: boolean;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ loadingProgress, iconRotation, hoverEffect }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (loadingProgress / 100) * circumference;
  
  return (
    <div className="relative w-28 h-28 mb-2">
      <div 
        className="absolute w-full h-full rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(10px)',
          transform: hoverEffect ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.5s ease-out'
        }}
      />
      
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(79, 70, 229, 0.15)"
          strokeWidth="4"
        />
        
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{
            transition: 'stroke-dashoffset 0.3s ease-out',
            filter: 'drop-shadow(0 0 3px rgba(139, 92, 246, 0.7))'
          }}
        />
        
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g 
            key={i} 
            transform={`rotate(${angle + iconRotation} 50 50)`}
            style={{ transition: 'transform 0.5s ease-out' }}
          >
            <circle 
              cx="50" 
              cy={12 + Math.sin(Date.now() * 0.001 + i) * 3} 
              r="2.5"
              fill={i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#8b5cf6" : "#ec4899"}
              opacity="0.8"
            >
              <animate 
                attributeName="r" 
                values="2;3;2" 
                dur="3s" 
                repeatCount="indefinite" 
                begin={`${i * 0.5}s`} 
              />
            </circle>
          </g>
        ))}
      </svg>
      
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          animation: hoverEffect ? 'pulse 1.5s infinite' : 'none'
        }}
      >
        <span 
          className="text-xl font-bold"
          style={{
            color: '#4c1d95',
            textShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
          }}
        >
          {Math.floor(loadingProgress)}%
        </span>
      </div>
      
      <AnimationIcons iconRotation={iconRotation} />
    </div>
  );
};

export default LoadingProgress;
