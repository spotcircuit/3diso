"use client";

import React, { useState, useEffect, useRef } from 'react';
import IsometricCard from './IsometricCard';

const businessProcessSteps = [
  {
    id: 1,
    title: 'Research',
    description: 'Gather market data and identify customer needs for product development',
    icon: '🔍',
    color: 'bg-gradient-to-br from-blue-500 to-blue-700',
    position: { x: 0, y: 300, z: 0 },
  },
  {
    id: 2,
    title: 'Planning',
    description: 'Define project scope, objectives, and timeline with key stakeholders',
    icon: '📋',
    color: 'bg-gradient-to-br from-purple-500 to-purple-700',
    position: { x: 150, y: 250, z: 20 },
  },
  {
    id: 3,
    title: 'Design',
    description: 'Create prototypes and specifications based on requirements',
    icon: '✏️',
    color: 'bg-gradient-to-br from-pink-500 to-pink-700',
    position: { x: 300, y: 200, z: 40 },
  },
  {
    id: 4,
    title: 'Development',
    description: 'Build the product following best practices and quality standards',
    icon: '💻',
    color: 'bg-gradient-to-br from-amber-500 to-amber-700',
    position: { x: 450, y: 150, z: 60 },
  },
  {
    id: 5,
    title: 'Testing',
    description: 'Validate functionality and performance through rigorous testing',
    icon: '🧪',
    color: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    position: { x: 600, y: 100, z: 80 },
  },
  {
    id: 6,
    title: 'Deployment',
    description: 'Launch the product to market and monitor initial performance',
    icon: '🚀',
    color: 'bg-gradient-to-br from-rose-500 to-rose-700',
    position: { x: 750, y: 50, z: 100 },
  },
];

export default function IsometricScene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Animation on mount with slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Ambient animation
    const ambientInterval = setInterval(() => {
      const randomRotation = (Math.random() - 0.5) * 2;
      setRotationY(prev => prev + randomRotation);
    }, 5000);

    // Mouse move effect for parallax rotation
    const handleMouseMove = (e: MouseEvent) => {
      if (sceneRef.current) {
        const rect = sceneRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate distance from center (normalized)
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        // Apply rotation based on mouse position
        const rotateY = deltaX * 5; // Horizontal rotation
        
        setRotationY(rotateY);
        setMousePosition({ x: deltaX, y: deltaY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      clearInterval(ambientInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle step selection
  const handleStepClick = (id: number) => {
    setSelectedStep(id === selectedStep ? null : id);
  };

  // Get the description for the selected step
  const getSelectedStepInfo = () => {
    if (selectedStep === null) {
      return null;
    }
    return businessProcessSteps.find(step => step.id === selectedStep);
  };

  const selectedStepInfo = getSelectedStepInfo();

  return (
    <div className="w-full h-screen flex items-start justify-center relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Animated particle background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`particle-${i}`}
            className="absolute w-24 h-24 rounded-full bg-white/5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random() * 2})`,
            }}
          />
        ))}
      </div>

      {/* Scene container with perspective */}
      <div 
        ref={sceneRef}
        className="relative w-full max-w-7xl h-full flex items-center justify-center"
        style={{ 
          perspective: '1800px',
          transform: `rotateY(${rotationY}deg) rotateX(${-mousePosition.y * 2}deg)`,
          transition: 'transform 0.5s ease-out',
          marginTop: '400px', // Move the entire scene much further down
        }}
      >
        {/* Central isometric grid */}
        <div className="absolute w-[1200px] h-[1200px] opacity-10 border border-white/20"
          style={{ 
            transform: 'rotateX(60deg) rotateZ(45deg)',
          }}>
          {/* Grid lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute border-t border-white/20 w-full"
              style={{ top: `${i * 8.33}%` }} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute border-l border-white/20 h-full"
              style={{ left: `${i * 8.33}%` }} />
          ))}
        </div>
        
        {/* Connection lines between steps */}
        <svg 
          className="absolute w-[1200px] h-[1200px] opacity-40"
          style={{ 
            transform: 'rotateX(60deg) rotateZ(45deg)',
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {businessProcessSteps.map((step, index) => {
            if (index === businessProcessSteps.length - 1) return null;
            const nextStep = businessProcessSteps[index + 1];
            return (
              <line 
                key={`line-${index}`}
                x1={step.position.x + 32} 
                y1={step.position.y + 32}
                x2={nextStep.position.x + 32} 
                y2={nextStep.position.y + 32}
                stroke="white" 
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            );
          })}
        </svg>
        
        {/* Business process cards */}
        <div className="relative w-full h-full">
          {businessProcessSteps.map((step, index) => (
            <IsometricCard
              key={step.id}
              id={step.id}
              title={step.title}
              description={step.description}
              icon={step.icon}
              color={step.color}
              position={{
                x: isLoaded ? step.position.x : 0,
                y: isLoaded ? step.position.y : 0,
                z: isLoaded ? step.position.z : -300,
              }}
              delay={index * 150}
            />
          ))}
        </div>

        {/* 3D decorative elements */}
        <div 
          className="absolute w-24 h-24 bg-blue-500/20 rounded-lg"
          style={{ 
            transform: 'rotateX(60deg) rotateZ(45deg) translate3d(-200px, 100px, 50px)',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
          }}
        />
        <div 
          className="absolute w-16 h-16 bg-purple-500/20 rounded-lg"
          style={{ 
            transform: 'rotateX(60deg) rotateZ(45deg) translate3d(800px, -300px, 120px)',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
          }}
        />
        <div 
          className="absolute w-32 h-32 bg-pink-500/20 rounded-lg"
          style={{ 
            transform: 'rotateX(60deg) rotateZ(45deg) translate3d(300px, 300px, 80px)',
            boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)',
          }}
        />
      </div>

      {/* Process Step Information Panel */}
      <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 text-white max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Business Process Workflow</h2>
        <p className="mb-4">An interactive visualization of our agile product development pipeline. Each card represents a stage in our proven process.</p>
        <div className="flex flex-wrap gap-2">
          {businessProcessSteps.map(step => (
            <button 
              key={step.id}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedStep === step.id ? 'bg-white text-gray-900 font-bold' : 'bg-white/20 hover:bg-white/30'
              }`}
              onClick={() => handleStepClick(step.id)}
            >
              {step.title}
            </button>
          ))}
        </div>
        
        {/* Selected step details */}
        {selectedStepInfo && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{selectedStepInfo.icon}</span>
              <h3 className="text-lg font-bold">{selectedStepInfo.title}</h3>
            </div>
            <p className="text-sm text-white/80">{selectedStepInfo.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}