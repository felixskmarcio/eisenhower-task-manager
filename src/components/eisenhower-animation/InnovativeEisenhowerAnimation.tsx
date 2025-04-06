
import React, { useState, useEffect } from 'react';
import AnimationCanvas from './AnimationCanvas';
import LoadingProgress from './LoadingProgress';
import AnimationIcons from './AnimationIcons';
import StatusText from './StatusText';

const InnovativeEisenhowerAnimation = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);
  const [iconRotation, setIconRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIconRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (Math.random() * 1.5);
        if (newProgress >= 100) {
          clearInterval(interval);
          setLoadingComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 40);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="flex flex-col items-center justify-center h-64 w-64 overflow-hidden relative rounded-xl shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 100%)',
        perspective: '1000px',
        boxShadow: hoverEffect 
          ? '0 20px 25px -5px rgba(79, 70, 229, 0.25), 0 10px 10px -5px rgba(79, 70, 229, 0.1)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setHoverEffect(true)}
      onMouseLeave={() => setHoverEffect(false)}
    >
      <AnimationCanvas hoverEffect={hoverEffect} />
      
      <div 
        className="relative z-10 flex flex-col items-center"
        style={{
          transform: hoverEffect ? 'translateZ(20px)' : 'translateZ(0)',
          transition: 'transform 0.5s ease-out'
        }}
      >
        <h1 
          className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))'
          }}
        >
          Eisenhower Matrix
        </h1>
        
        <LoadingProgress 
          loadingProgress={loadingProgress} 
          iconRotation={iconRotation} 
          hoverEffect={hoverEffect} 
        />
        
        <StatusText loadingComplete={loadingComplete} />
      </div>
      
      <style>
        {`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
        
        .animate-dots::after {
          content: '';
          animation: dots 1.5s infinite;
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.5s forwards;
        }
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>
    </div>
  );
};

export default InnovativeEisenhowerAnimation;
