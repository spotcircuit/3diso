"use client";

import React, { useState, useEffect } from 'react';
import CardDetail from './CardDetail';

interface IsometricCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  delay?: number;
  id: number;
}

export default function IsometricCard({
  title,
  description,
  icon,
  color,
  position,
  delay = 0,
  id,
}: IsometricCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate mock details based on the card's id
  const cardDetails = [
    { label: "Duration", value: `${id * 2} weeks` },
    { label: "Team Size", value: `${id + 2} people` },
    { label: "Priority", value: id % 3 === 0 ? "High" : id % 3 === 1 ? "Medium" : "Low" },
    { label: "Status", value: id % 4 === 0 ? "Completed" : id % 4 === 1 ? "In Progress" : id % 4 === 2 ? "Pending" : "Not Started" },
  ];

  // Add subtle floating animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000 + (id * 500)); // Different timing for each card
    
    return () => clearInterval(interval);
  }, [id]);

  return (
    <>
      <div 
        className={`absolute transform-gpu cursor-pointer group ${isHovered ? 'z-10' : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y + (isAnimating ? 5 : 0)}px, ${position.z}px) 
                     rotateX(60deg) rotateZ(45deg) ${isHovered ? 'scale(1.1)' : ''}`,
          transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
          transitionDelay: `${delay}ms`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDetail(true)}
      >
        <div 
          className={`w-64 h-64 rounded-2xl shadow-xl ${color} p-6 flex flex-col justify-between
                      transform-gpu transition-all duration-300 ${isHovered ? 'shadow-2xl' : ''}`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xl">{icon}</span>
            </div>
          </div>
          <p className="text-white/80 mt-2 text-sm">{description}</p>
          
          {/* Action button - appears on hover */}
          <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            <button className="bg-white/30 hover:bg-white/40 text-white py-1 px-3 rounded-full text-xs font-medium transition-colors">
              View Details →
            </button>
          </div>
        </div>
        
        {/* Shadow element */}
        <div 
          className={`absolute -bottom-4 -left-4 w-64 h-64 rounded-2xl bg-black/30 blur-md z-[-1]
                     transform-gpu transition-all duration-300 ${isHovered ? 'translate-y-2 blur-xl bg-black/40' : ''}`}
          style={{
            transform: `translateZ(-10px)`,
          }}
        />
      </div>

      {/* Detail modal */}
      {showDetail && (
        <CardDetail
          title={title}
          description={description}
          icon={icon}
          details={cardDetails}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}