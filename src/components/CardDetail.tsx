"use client";

import React, { useEffect, useRef } from 'react';

interface CardDetailProps {
  title: string;
  description: string;
  icon: string;
  details: {
    label: string;
    value: string;
  }[];
  onClose: () => void;
}

export default function CardDetail({
  title,
  description,
  icon,
  details,
  onClose
}: CardDetailProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Animation entrance
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'translateY(20px) scale(0.95)';
      
      // Trigger animation after a small delay
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.opacity = '1';
          cardRef.current.style.transform = 'translateY(0) scale(1)';
        }
      }, 50);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle background click
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Animate out before closing
      if (cardRef.current) {
        cardRef.current.style.opacity = '0';
        cardRef.current.style.transform = 'translateY(10px) scale(0.95)';
        
        setTimeout(onClose, 200);
      } else {
        onClose();
      }
    }
  };

  // Get color based on card index
  const getColorClass = () => {
    // This is a simple hash based on the title to get consistent colors
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorOptions = ['blue', 'purple', 'pink', 'amber', 'emerald', 'rose'];
    const selectedColor = colorOptions[hash % colorOptions.length];
    
    return `from-${selectedColor}-500 to-${selectedColor}-700`;
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[100] p-4"
      style={{
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={handleBackgroundClick}
    >
      <div 
        ref={cardRef}
        className="relative w-full max-w-lg bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        style={{
          transitionProperty: 'opacity, transform',
          transitionDuration: '0.3s, 0.3s',
          transitionTimingFunction: 'ease, ease',
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* Animated background gradient */}
        <div 
          className="absolute inset-0 -z-10 opacity-30 overflow-hidden"
          style={{ filter: 'blur(30px)' }}
        >
          <div 
            className={`w-full h-full bg-gradient-to-br ${getColorClass()} animate-pulse-subtle`}
            style={{ transformOrigin: 'center', transform: 'scale(1.2)' }}
          />
        </div>
        
        {/* Header */}
        <div className={`p-6 pb-2 flex items-center gap-4`}>
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getColorClass()} shadow-lg flex items-center justify-center`}>
            <span className="text-white text-3xl">{icon}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-white/80 to-white/20 rounded-full mt-1" />
          </div>
        </div>
        
        {/* Description */}
        <div className="px-6 py-3">
          <p className="text-white/90 text-base">{description}</p>
        </div>
        
        {/* Details */}
        <div className="p-6 pt-2">
          <div className="bg-black/20 rounded-xl p-4 mb-6 backdrop-blur-sm border border-white/5">
            {details.map((detail, index) => (
              <div 
                key={index} 
                className={`flex justify-between py-2 ${index !== details.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <span className="text-white/60">{detail.label}</span>
                <span className="text-white font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
          
          {/* Controls */}
          <div className="flex justify-between gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>×</span>
              <span>Close</span>
            </button>
            
            <button 
              className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}