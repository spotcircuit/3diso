"use client";

import React, { useState, useEffect, useRef, useContext } from 'react';
import EnhancedCard from './EnhancedCard';
import { SceneContext, SceneProvider } from './SceneContext';
import AdvancedControls from './AdvancedControls';
import ParticleEffect from './ParticleEffect';
import MovableModule from './MovableModule';
import BusinessWorkflowModule from './BusinessWorkflowModule';

// Business process steps data - arranged in two rows
const businessProcessSteps = [
  // First row - 3 cards
  {
    id: 1,
    title: 'Research',
    description: 'Gather market data and identify customer needs for product development',
    icon: '🔍',
    color: 'bg-gradient-to-br from-blue-500 to-blue-700',
    position: { x: -200, y: -150, z: 0 },
  },
  {
    id: 2,
    title: 'Planning',
    description: 'Define project scope, objectives, and timeline with key stakeholders',
    icon: '📋',
    color: 'bg-gradient-to-br from-purple-500 to-purple-700',
    position: { x: 0, y: -150, z: 20 },
  },
  {
    id: 3,
    title: 'Design',
    description: 'Create wireframes, prototypes, and finalize the product design',
    icon: '✏️',
    color: 'bg-gradient-to-br from-pink-500 to-pink-700',
    position: { x: 200, y: -150, z: 40 },
  },
  // Second row - 3 cards
  {
    id: 4,
    title: 'Development',
    description: 'Build the product according to design specifications and requirements',
    icon: '💻',
    color: 'bg-gradient-to-br from-amber-500 to-amber-700',
    position: { x: -200, y: 150, z: 60 },
  },
  {
    id: 5,
    title: 'Testing',
    description: 'Validate functionality and performance through rigorous testing',
    icon: '🧪',
    color: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    position: { x: 0, y: 150, z: 80 },
  },
  {
    id: 6,
    title: 'Launch',
    description: 'Launch the product to market and monitor initial performance',
    icon: '🚀',
    color: 'bg-gradient-to-br from-rose-500 to-rose-700',
    position: { x: 200, y: 150, z: 100 },
  },
];

function Scene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { 
    viewSettings, 
    updateViewSettings, 
    isFocusMode, 
    isDetailMode,
    isCtrlPressed,
    setIsCtrlPressed,
    setDraggable
  } = useContext(SceneContext);
  
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  // Load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle key events for CTRL key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
        setDraggable(true);
        document.body.style.cursor = 'move';
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
        setDraggable(false);
        document.body.style.cursor = '';
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.style.cursor = '';
    };
  }, [setIsCtrlPressed, setDraggable]);

  // Mouse drag functionality for rotation (normal mode) or panning (when CTRL is pressed)
  const handleMouseDown = (e: React.MouseEvent) => {
    // If we're clicking on a module or other interactive element, don't start dragging
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains('scene-background')) {
      return;
    }
    
    if (isFocusMode && isDetailMode) return; // No interaction in detail mode
    
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    
    if (isCtrlPressed) {
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || (isFocusMode && isDetailMode)) return;
    
    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;
    
    if (isPanning) {
      // Panning mode when CTRL is pressed
      updateViewSettings({
        panX: viewSettings.panX + deltaX,
        panY: viewSettings.panY + deltaY
      });
    } else if (!isFocusMode) {
      // Rotation mode when not focused
      updateViewSettings({
        rotation: viewSettings.rotation + deltaX * 0.5,
        elevation: Math.max(-30, Math.min(30, viewSettings.elevation - deltaY * 0.5))
      });
    }
    
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (isFocusMode && isDetailMode) return;
    
    const delta = e.deltaY * -0.01;
    const newZoom = Math.max(0.5, Math.min(3, viewSettings.zoom + delta));
    
    updateViewSettings({
      zoom: newZoom
    });
    
    e.preventDefault(); // Prevent page scrolling
  };

  // Add mouse event listeners for global tracking
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsPanning(false);
    };
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || (isFocusMode && isDetailMode)) return;
      
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;
      
      if (isPanning) {
        // Panning mode
        updateViewSettings({
          panX: viewSettings.panX + deltaX,
          panY: viewSettings.panY + deltaY
        });
      } else if (!isFocusMode) {
        // Rotation mode
        updateViewSettings({
          rotation: viewSettings.rotation + deltaX * 0.5,
          elevation: Math.max(-30, Math.min(30, viewSettings.elevation - deltaY * 0.5))
        });
      }
      
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Add global event listeners to handle mouse movements outside the component
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, isPanning, lastMousePosition, updateViewSettings, viewSettings, isFocusMode, isDetailMode]);

  // Scene container style
  const sceneStyle = {
    transform: `
      perspective(${viewSettings.perspective}px)
      scale(${viewSettings.zoom})
      translateX(${viewSettings.panX}px)
      translateY(${viewSettings.panY}px)
      rotateX(${viewSettings.elevation}deg)
      rotateY(${viewSettings.rotation}deg)
    `,
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
    transitionProperty: 'transform',
    transitionDuration: isDragging ? '0s' : '0.5s',
    transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  // Get scene cursor style
  const getSceneCursor = () => {
    if (isFocusMode) return 'default';
    if (isCtrlPressed) return isDragging ? 'grabbing' : 'grab';
    return isDragging ? 'grabbing' : 'grab';
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
      {/* Information overlay during loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Loading 3D Scene</h2>
            <div className="w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      )}
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0 scene-background">
        {/* Animated gradient spots */}
        <div className="absolute top-[20%] left-[30%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-3xl animate-pulse-subtle scene-background" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-3xl animate-pulse-subtle scene-background" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 scene-background" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Particle effect */}
        <ParticleEffect count={80} />
      </div>
      
      {/* Usage hint */}
      <div className={`absolute top-8 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 text-white z-30 transition-opacity duration-500 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-sm">Drag cards freely | Click a card to focus</p>
      </div>
      
      {/* Main scene container */}
      <div 
        ref={sceneRef}
        className="relative w-full h-full mx-auto flex items-end justify-center select-none pb-20"
        style={{
          ...sceneStyle,
          cursor: getSceneCursor(),
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Reference grid - only visible when not in focus mode */}
        {!isFocusMode && (
          <div 
            className="absolute grid grid-cols-10 gap-4 opacity-20 pointer-events-none"
            style={{
              transform: 'rotateX(60deg) rotateZ(0deg)',
              width: '1000px',
              height: '1000px',
            }}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className="w-full h-full border border-blue-300/20"
                style={{
                  boxShadow: 'inset 0 0 5px rgba(59, 130, 246, 0.05)',
                }}
              />
            ))}
          </div>
        )}
        
        {/* Business Process Steps cards */}
        <div className="relative w-full h-full">
          {businessProcessSteps.map((step, index) => (
            <EnhancedCard
              key={step.id}
              id={step.id}
              title={step.title}
              description={step.description}
              icon={step.icon}
              color={step.color}
              position={step.position}
              delay={index * 100}
            />
          ))}
          
          {/* Connection lines between cards (only visible when not in detail mode) */}
          {!isDetailMode && businessProcessSteps.map((step, index) => {
            // Connect horizontally in each row
            if (index === 2 || index === 5) return null; // Skip the last card in each row
            
            const nextStep = businessProcessSteps[index + 1];
            const gradientId = `line-gradient-${index}`;
            
            // Get color from the step's gradient
            const getBaseColor = (colorClass: string) => {
              return colorClass.includes('from-') 
                ? colorClass.split('from-')[1].split(' ')[0]
                : 'blue-500';
            };
            
            const startColor = getBaseColor(step.color);
            const endColor = getBaseColor(nextStep.color);
            
            return (
              <div key={`connector-h-${index}`} className="absolute pointer-events-none">
                <svg
                  className="absolute transform-gpu"
                  style={{
                    width: '300px', // Fixed distance between cards
                    height: '50px',
                    transform: `translate3d(${step.position.x + 150}px, ${step.position.y}px, ${(step.position.z + nextStep.position.z) / 2}px) rotateX(60deg)`,
                    zIndex: -1,
                  }}
                  viewBox="0 0 300 50"
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={`#${startColor}`} stopOpacity="0.7" />
                      <stop offset="100%" stopColor={`#${endColor}`} stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,25 C 75,25 225,25 300,25"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
            );
          })}
          
          {/* Connect rows vertically - only if not in detail mode */}
          {!isDetailMode && [0, 1, 2].map(rowIndex => {
            const topCard = businessProcessSteps[rowIndex];
            const bottomCard = businessProcessSteps[rowIndex + 3];
            const gradientId = `line-gradient-v-${rowIndex}`;
            
            // Get color from the step's gradient
            const getBaseColor = (colorClass: string) => {
              return colorClass.includes('from-') 
                ? colorClass.split('from-')[1].split(' ')[0]
                : 'blue-500';
            };
            
            const topColor = getBaseColor(topCard.color);
            const bottomColor = getBaseColor(bottomCard.color);
            
            return (
              <div key={`connector-v-${rowIndex}`} className="absolute pointer-events-none">
                <svg
                  className="absolute transform-gpu"
                  style={{
                    width: '50px',
                    height: '200px', // Fixed vertical distance
                    transform: `translate3d(${topCard.position.x}px, ${topCard.position.y + 25}px, ${(topCard.position.z + bottomCard.position.z) / 2}px) rotateX(60deg)`,
                    zIndex: -1,
                  }}
                  viewBox="0 0 50 200"
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={`#${topColor}`} stopOpacity="0.7" />
                      <stop offset="100%" stopColor={`#${bottomColor}`} stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 25,0 C 25,50 25,150 25,200"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Header with logo/title */}
      <div className="absolute top-8 left-8 z-40">
        <h1 className="text-3xl font-bold tracking-tighter">
          <span className="text-blue-400">3D</span>
          <span className="text-white">Isometric</span>
          <span className="text-pink-400">Workflow</span>
        </h1>
        <p className="text-white/60 mt-1 text-sm">Interactive business process visualization</p>
      </div>
      
      {/* Controls and Workflow Modules in a separate stacking context with high z-index */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
        {/* Controls in Movable Module */}
        <div className="fixed pointer-events-auto" style={{ top: '20px', right: '20px', zIndex: 45 }}>
          <MovableModule 
            title="Scene Controls" 
            defaultPosition={{ x: 0, y: 0 }}
            zIndex={45}
          >
            <AdvancedControls inMovableModule={true} />
          </MovableModule>
        </div>
        
        {/* Business Workflow in Movable Module */}
        <div className="fixed pointer-events-auto" style={{ top: '100px', left: '20px', zIndex: 44 }}>
          <MovableModule 
            title="Business Workflow" 
            defaultPosition={{ x: 0, y: 0 }}
            width="w-96"
            zIndex={44}
          >
            <BusinessWorkflowModule steps={
              businessProcessSteps.map(step => ({
                title: step.title,
                description: step.description,
                icon: step.icon,
                status: step.id <= 2 ? 'completed' : step.id === 3 ? 'in-progress' : 'pending',
                progress: step.id === 1 ? 100 : step.id === 2 ? 100 : step.id === 3 ? 65 : step.id === 4 ? 20 : 0
              }))
            } />
          </MovableModule>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedScene() {
  return (
    <SceneProvider>
      <Scene />
    </SceneProvider>
  );
}