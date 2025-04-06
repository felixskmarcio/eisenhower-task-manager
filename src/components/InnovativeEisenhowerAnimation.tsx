
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Lightbulb, Clock, ListChecks } from 'lucide-react';

const InnovativeEisenhowerAnimation = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [particles, setParticles] = useState([]);
  const [hoverEffect, setHoverEffect] = useState(false);
  const [iconRotation, setIconRotation] = useState(0);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIconRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 10 - 5,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      color: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(79, 70, 229, 0.8)',
        'rgba(167, 139, 250, 0.7)'
      ][Math.floor(Math.random() * 5)]
    }));
    
    setParticles(newParticles);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const time = Date.now() * 0.001;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < Math.PI * 2; i += 0.1) {
        const radius = 30 + Math.sin(time + i * 3) * 5;
        const x = width/2 + Math.cos(i) * radius;
        const y = height/2 + Math.sin(i) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      for (let i = 0; i < Math.PI * 2; i += 0.1) {
        const radius = 40 + Math.cos(time * 0.8 + i * 2) * 7;
        const x = width/2 + Math.cos(i) * radius;
        const y = height/2 + Math.sin(i) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      setParticles(prev => prev.map(particle => {
        const updatedParticle = {...particle};
        
        const angle = time * particle.speed;
        const radius = 30 + updatedParticle.z * 2 + Math.sin(time * 0.5) * 5;
        updatedParticle.x = 50 + Math.cos(angle) * radius;
        updatedParticle.y = 50 + Math.sin(angle) * radius;
        
        const x = (updatedParticle.x / 100) * width;
        const y = (updatedParticle.y / 100) * height;
        const size = updatedParticle.size * (hoverEffect ? 1.8 : 1);
        
        ctx.fillStyle = updatedParticle.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        if (size > 2) {
          ctx.shadowColor = updatedParticle.color;
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        
        return updatedParticle;
      }));
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [hoverEffect]);
  
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
  
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (loadingProgress / 100) * circumference;
  
  const icons = [
    <Clock key="clock" className="w-4 h-4 text-indigo-500" />,
    <ListChecks key="list" className="w-4 h-4 text-purple-500" />,
    <Lightbulb key="lightbulb" className="w-4 h-4 text-pink-500" />
  ];
  
  return (
    <div 
      ref={containerRef}
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
      <canvas 
        ref={canvasRef} 
        width="200" 
        height="200" 
        className="absolute top-0 left-0 w-full h-full"
        style={{
          transform: hoverEffect ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.5s ease-out'
        }}
      />
      
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
        </div>
        
        <div 
          className="h-6 mt-2 overflow-hidden" 
          style={{ 
            width: '120px',
            perspective: '100px' 
          }}
        >
          {loadingComplete ? (
            <div className="flex items-center justify-center text-sm text-green-600 animate-fade-slide-up">
              <span>Inicializado</span>
              <CheckCircle2 className="ml-1 w-4 h-4" />
            </div>
          ) : (
            <div className="text-sm text-indigo-600 text-center relative">
              <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                {["Carregando", "Preparando", "Inicializando"].map((text, i) => (
                  <span 
                    key={i} 
                    className="absolute whitespace-nowrap"
                    style={{
                      opacity: ((Math.floor(Date.now() / 1000) % 3) === i) ? 1 : 0,
                      transition: 'opacity 0.5s ease-out',
                      transform: 'translateZ(20px)'
                    }}
                  >
                    {text}<span className="animate-dots">...</span>
                  </span>
                ))}
              </div>
              <span className="invisible">Placeholder</span>
            </div>
          )}
        </div>
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
