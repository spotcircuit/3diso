"use client";

import React, { useEffect, useState } from 'react';

interface Particle {
  width: number;
  height: number;
  left: string;
  top: string;
  opacity: number;
  duration: string;
  delay: string;
}

export default function ParticleEffect({ count = 80 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    // Generate particles only on the client side
    const newParticles = Array.from({ length: count }).map(() => ({
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 5}s`,
    }));
    
    setParticles(newParticles);
  }, [count]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: particle.left,
            top: particle.top,
            opacity: particle.opacity,
            animation: `float ${particle.duration} ease-in-out infinite`,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}