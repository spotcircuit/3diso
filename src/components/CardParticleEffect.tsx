"use client";

import React, { useEffect, useState } from 'react';

interface CardParticle {
  left: string;
  top: string;
  duration: string;
  delay: string;
  opacity: number;
}

export default function CardParticleEffect({ count = 8 }: { count?: number }) {
  const [particles, setParticles] = useState<CardParticle[]>([]);
  
  useEffect(() => {
    // Generate particles only on the client side
    const newParticles = Array.from({ length: count }).map(() => ({
      left: `${20 + Math.random() * 240}px`,
      top: `${20 + Math.random() * 240}px`,
      duration: `${3 + Math.random() * 4}s`,
      delay: `${Math.random() * 2}s`,
      opacity: 0.1 + Math.random() * 0.3
    }));
    
    setParticles(newParticles);
    
    // Regenerate particles periodically for a more dynamic effect
    const intervalId = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          left: `${20 + Math.random() * 240}px`,
          top: `${20 + Math.random() * 240}px`,
          duration: `${3 + Math.random() * 4}s`,
          delay: `${Math.random() * 0.5}s`,
        }))
      );
    }, 8000);
    
    return () => clearInterval(intervalId);
  }, [count]);
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden rounded-xl opacity-80"
      style={{ pointerEvents: 'none' }}
    >
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white animate-pulse"
          style={{
            left: particle.left,
            top: particle.top,
            opacity: particle.opacity,
            animation: `float ${particle.duration} ease-in-out infinite alternate`,
            animationDelay: particle.delay,
            boxShadow: '0 0 5px 2px rgba(255, 255, 255, 0.2)'
          }}
        />
      ))}
    </div>
  );
}