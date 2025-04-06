
import React, { useRef, useEffect, useState } from 'react';

interface AnimationCanvasProps {
  hoverEffect: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  color: string;
}

const AnimationCanvas: React.FC<AnimationCanvasProps> = ({ hoverEffect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  
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
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    let animationId: number;
    const animate = () => {
      if (!ctx) return;
      
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
  
  return (
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
  );
};

export default AnimationCanvas;
