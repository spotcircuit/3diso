"use client";

import React, { useState, useRef, useEffect } from 'react';

interface MovableModuleProps {
  children: React.ReactNode;
  title?: string;
  defaultPosition?: { x: number, y: number };
  className?: string;
  style?: React.CSSProperties;
  width?: string;
  zIndex?: number;
}

export default function MovableModule({
  children,
  title,
  defaultPosition = { x: 0, y: 0 },
  className = "",
  style = {},
  width = "w-72",
  zIndex = 40
}: MovableModuleProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Initialize position after mount
  useEffect(() => {
    setPosition(defaultPosition);
  }, [defaultPosition]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const moduleRef = useRef<HTMLDivElement>(null);

  // Handle start of drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Stop event propagation to prevent any other components from being affected
    e.stopPropagation();
    e.preventDefault();
    
    if (moduleRef.current) {
      const rect = moduleRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      
      // Set a high z-index to ensure this appears above everything else while dragging
      if (moduleRef.current) {
        moduleRef.current.style.zIndex = '9999';
      }
    }
  };

  // Handle mouse move while dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Calculate new position
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        
        // Update position
        setPosition(newPosition);
        
        // Prevent other elements from being affected
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={moduleRef}
      className={`bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl overflow-hidden pointer-events-auto ${width} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging ? 9999 : zIndex,
        ...style,
      }}
      onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to elements below
    >
      {/* Header/drag handle */}
      <div 
        className="bg-gray-800/70 py-2 px-3 flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="text-white font-medium text-sm">{title || 'Module'}</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500/70"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}