"use client";

import React, { useState, useContext, useRef, useEffect } from 'react';
import { SceneContext } from './SceneContext';
import CardDetail from './CardDetail';
import CardParticleEffect from './CardParticleEffect';

interface EnhancedCardProps {
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

export default function EnhancedCard({
  title,
  description,
  icon,
  color,
  position,
  delay = 0,
  id,
}: EnhancedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { 
    focusedCard, 
    setFocusedCard, 
    isFocusMode, 
    isDetailMode, 
    setIsDetailMode,
    isCtrlPressed,
    cardRotation,
    setCardRotation
  } = useContext(SceneContext);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [floatOffset, setFloatOffset] = useState(0);
  const [spinRotation, setSpinRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDirection, setSpinDirection] = useState(1);
  
  // Card dragging state
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [clickStartTime, setClickStartTime] = useState(0);
  
  const isFocused = focusedCard === id;
  const isUnfocused = focusedCard !== null && focusedCard !== id;
  
  // Generate mock details based on the card's id
  const cardDetails = [
    { label: "Duration", value: `${id * 2} weeks` },
    { label: "Team Size", value: `${id + 2} people` },
    { label: "Priority", value: id % 3 === 0 ? "High" : id % 3 === 1 ? "Medium" : "Low" },
    { label: "Status", value: id % 4 === 0 ? "Completed" : id % 4 === 1 ? "In Progress" : id % 4 === 2 ? "Pending" : "Not Started" },
    { label: "Progress", value: `${(id * 15) % 100}%` },
    { label: "Milestone", value: id % 2 === 0 ? "Yes" : "No" },
  ];

  // Floating animation effect
  useEffect(() => {
    if (isDetailMode || isDraggingCard) return; // No floating in detail mode or while dragging
    
    let animationFrameId: number;
    const startTime = Date.now();
    
    const animateFloat = () => {
      const elapsed = Date.now() - startTime;
      // Different amplitude and frequency for each card
      const amplitude = 5 + (id * 0.3);
      const frequency = 0.0008 + (id * 0.0001);
      const phase = id * 0.5;
      
      // Calculate floating offset
      const newOffset = amplitude * Math.sin(elapsed * frequency + phase);
      setFloatOffset(newOffset);
      
      // Continue animation
      animationFrameId = requestAnimationFrame(animateFloat);
    };
    
    animationFrameId = requestAnimationFrame(animateFloat);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [id, isDetailMode, isDraggingCard]);

  // Spinning animation for focused card
  useEffect(() => {
    if (!isSpinning) return;
    
    let animationFrameId: number;
    const startTime = Date.now();
    
    const animateSpin = () => {
      const elapsed = Date.now() - startTime;
      const rotationSpeed = 0.05; // Adjust for slower/faster rotation
      
      // Calculate new rotation based on time elapsed, direction and speed
      const newRotation = (elapsed * rotationSpeed * spinDirection) % 360;
      setSpinRotation(newRotation);
      
      animationFrameId = requestAnimationFrame(animateSpin);
    };
    
    animationFrameId = requestAnimationFrame(animateSpin);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpinning, spinDirection]);

  // 3D card tilt effect when focused and hovered
  useEffect(() => {
    if (!isFocused || !cardRef.current || isDetailMode) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || isDetailMode) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center (normalized -1 to 1)
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 15;
      
      setCardRotation({ x: rotateX, y: rotateY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFocused, setCardRotation, isDetailMode]);

  // Handle card mouse down for dragging or focusing
  const handleCardMouseDown = (e: React.MouseEvent) => {
    // Stop propagation to ensure the click doesn't affect other elements
    e.stopPropagation();
    
    if (isDetailMode) return; // No interaction in detail mode
    
    // Always start dragging the card on mouse down
    setIsDraggingCard(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault(); // Prevent text selection during drag
    
    // Store the current timestamp to detect if this was a click or drag later
    setClickStartTime(Date.now());
  };
  
  // Handle mouse move for card dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingCard) return;
      
      // Calculate the distance moved
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Update card position with easing
      setCardPosition(prev => ({
        x: prev.x + deltaX * 0.5, // Add easing multiplier for smoother movement
        y: prev.y + deltaY * 0.5,
        z: prev.z
      }));
      
      // Update drag start for next move
      setDragStart({ x: e.clientX, y: e.clientY });
      
      // If mouse moved significantly, this is definitely a drag, not a click
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setIsDragging(true);
      }
    };
    
    const handleMouseUp = () => {
      if (isDraggingCard) {
        // Check if this was a short tap/click or an actual drag
        const dragDuration = Date.now() - clickStartTime;
        const wasClick = dragDuration < 200 && !isDragging;
        
        setIsDraggingCard(false);
        setIsDragging(false);
        
        // If it was just a click (not a drag), trigger click handler
        if (wasClick && !isSpinning) {
          // handle as a click
          if (!isFocused) {
            setFocusedCard(id);
            
            // Start spinning after a delay
            setTimeout(() => {
              setIsSpinning(true);
              setSpinDirection(1); // Start spinning clockwise
            }, 600);
          }
        }
      }
    };
    
    if (isDraggingCard) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCard, dragStart, clickStartTime, id, isDragging, isFocused, isSpinning, setFocusedCard]);

  // Allow user to change spin direction by clicking on a spinning card
  const handleSpinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSpinning) {
      // Toggle spin direction when clicking a spinning card
      setSpinDirection(prev => prev * -1);
    }
  };

  // Handle detail view button click
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailMode(true);
    setIsSpinning(false);
  };

  // Handle card rotation change
  const handleRotateLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpinDirection(-1);
    if (!isSpinning) setIsSpinning(true);
  };

  const handleRotateRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpinDirection(1);
    if (!isSpinning) setIsSpinning(true);
  };

  const handleStopSpin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSpinning(false);
  };

  // Spinning setup
  useEffect(() => {
    if (isSpinning && !isDetailMode) {
      // Start spinning automatically
      setSpinDirection(1);
    }
  }, [isSpinning, isDetailMode]);

  // Get card transform based on state
  const getCardTransform = () => {
    const backTilt = -30; // How far the card is tilted back in isometric view
    const rotZ = 45; // Default rotateZ value for isometric view
    
    // Use current card position (which can be dragged) instead of fixed position
    const currentPos = cardPosition;
    
    // Base transform for isometric view - reclined/laying back
    let transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, ${currentPos.z}px) 
                     rotateX(${backTilt}deg) rotateZ(${rotZ}deg)`;
    
    // When card is focused in focus mode
    if (isFocusMode && isFocused) {
      // Upright position at center
      if (isDetailMode) {
        // Detail mode - upright with no special effects
        transform = `translate3d(0px, 0px, 200px) scale(1.2)`;
      } else if (isSpinning) {
        // Spinning mode - apply an upward translation for vertical effect
        transform = `translate3d(0px, -50px, 200px) rotateY(${spinRotation}deg) 
                     rotateX(${cardRotation.x * 0.5}deg) rotateZ(0deg) scale(1.2)`;
      } else {
        // Focused but not spinning - responsive to mouse movement
        transform = `translate3d(0px, -30px, 200px) 
                     rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg) rotateZ(0deg) scale(1.2)`;
      }
    } 
    // When another card is focused (push this to background)
    else if (isFocusMode && isUnfocused) {
      transform = `translate3d(${currentPos.x * 1.5}px, ${currentPos.y * 1.5}px, ${currentPos.z - 100}px) 
                  rotateX(${backTilt}deg) rotateZ(${rotZ}deg) scale(0.7)`;
    }
    // Regular hover state
    else if (isHovered && !isFocusMode) {
      transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, ${currentPos.z + 30}px) 
                  rotateX(${backTilt - 5}deg) rotateZ(${rotZ}deg) scale(1.1)`;
    }
    
    // Add float effect when not in detail mode and not being dragged
    if (!isDetailMode && !isDraggingCard) {
      transform += ` translateY(${floatOffset}px)`;
    }
    
    return transform;
  };

  // Generate gradient with contrast coloring
  const getCardGradient = () => {
    // Default is the provided color
    if (!isFocused) return color;
    
    // For focused card, create a more vibrant gradient
    const colorClass = color.split(' ')[1]; // Get the main color class (e.g., from-blue-500)
    const colorBase = colorClass.split('-')[0]; // Get just the color name (e.g., blue)
    
    return isDetailMode
      ? `bg-gradient-to-br from-${colorBase}-400 via-${colorBase}-500 to-${colorBase}-800 shadow-3d shadow-${colorBase}-500/20`
      : `bg-gradient-to-br from-${colorBase}-400 via-${colorBase}-500 to-${colorBase}-700`;
  };

  // Calculate transition timing - returns { duration, timingFunction } object
  const getTransitionTiming = () => {
    // Different timing based on animation state
    if (isDetailMode) return '0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    if (isFocusMode && isFocused) {
      return isSpinning ? '0.01s linear' : '0.3s cubic-bezier(0.23, 1, 0.32, 1)';
    }
    return '0.6s cubic-bezier(0.23, 1, 0.32, 1)';
  };

  return (
    <>
      <div 
        ref={cardRef}
        className={`absolute transform-gpu cursor-pointer ${isCtrlPressed && !isDetailMode ? 'pointer-events-none' : ''} ${isDetailMode ? '' : 'card-3d'}`}
        style={{
          transform: getCardTransform(),
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          transitionProperty: 'transform, opacity',
          transitionDuration: `${getTransitionTiming().split(' ')[0]}, 0.3s`,
          transitionTimingFunction: `${getTransitionTiming().split(' ')[1] || 'ease'}, ease`,
          transitionDelay: isFocusMode || isHovered ? '0ms, 0ms' : `${delay}ms, ${delay}ms`,
          zIndex: isFocused ? 50 : isHovered ? 10 : 1,
          opacity: isUnfocused ? 0.3 : 1,
          cursor: isDraggingCard 
            ? 'grabbing' 
            : 'grab', // Always show grab cursor to indicate draggability
        }}
        onMouseEnter={() => !isFocusMode && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleCardMouseDown}
        onClick={isSpinning ? handleSpinClick : undefined} // Only use click for spin direction toggle
      >
        {/* Main Card */}
        <div 
          className={`relative w-72 h-48 rounded-xl overflow-hidden ${getCardGradient()} p-5 flex flex-col justify-between
                      transition-shadow duration-300 border border-white/10`}
          style={{
            boxShadow: isFocused 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 255, 255, 0.1)' 
              : isHovered 
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-white/80 text-sm mt-1 line-clamp-2">{description}</p>
            </div>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-2xl
                          ${isSpinning ? 'animate-pulse-subtle' : ''}`}>
              {icon}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full h-1.5 bg-black/20 rounded-full mt-4">
            <div
              className="h-full bg-white/50 rounded-full"
              style={{ width: `${(id * 15) % 100}%` }}
            />
          </div>
          
          {/* Card Footer */}
          <div className="mt-auto">
            <div className="flex justify-between items-center text-white">
              <span className="text-xs opacity-60">Step {id} of 6</span>
              
              {/* Action buttons for focused card */}
              {isFocused && !isDetailMode && (
                <div className="flex space-x-1">
                  <button 
                    className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
                    onClick={handleDetailClick}
                  >
                    Details
                  </button>
                  
                  {/* Rotation controls */}
                  <div className="flex rounded overflow-hidden">
                    <button 
                      className={`px-1.5 py-0.5 text-xs ${isSpinning && spinDirection === -1 ? 'bg-white/40' : 'bg-white/20 hover:bg-white/30'} transition-colors`}
                      onClick={handleRotateLeft}
                    >
                      ⟲
                    </button>
                    {isSpinning && (
                      <button 
                        className="px-1.5 py-0.5 text-xs bg-white/20 hover:bg-white/30 transition-colors"
                        onClick={handleStopSpin}
                      >
                        ∥
                      </button>
                    )}
                    <button 
                      className={`px-1.5 py-0.5 text-xs ${isSpinning && spinDirection === 1 ? 'bg-white/40' : 'bg-white/20 hover:bg-white/30'} transition-colors`}
                      onClick={handleRotateRight}
                    >
                      ⟳
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reflection effect */}
        <div className="absolute inset-0 reflection rounded-xl"></div>
        
        {/* 3D elements - only visible in focused mode */}
        {isFocused && !isDetailMode && (
          <>
            {/* Decorative lighting effect */}
            <div className="absolute -inset-3 bg-white/5 rounded-[30px] -z-10 blur-xl opacity-50" />
            
            {/* Floating particles */}
            <CardParticleEffect count={8} />
          </>
        )}
        
        {/* Shadow element */}
        <div 
          className="absolute -bottom-4 -left-4 w-72 h-48 rounded-2xl bg-black/30 blur-md -z-10 transform-gpu transition-all duration-300"
          style={{
            transform: `translateZ(-10px) ${isFocused ? 'scale(1.2)' : isHovered ? 'scale(1.1)' : ''}`,
            opacity: isFocused ? 0.6 : isHovered ? 0.5 : 0.3,
            filter: `blur(${isFocused ? '15px' : isHovered ? '10px' : '5px'})`,
          }}
        />
      </div>

      {/* Detail modal - shown in detail mode */}
      {isFocused && isDetailMode && (
        <CardDetail
          title={title}
          description={description}
          icon={icon}
          details={cardDetails}
          onClose={() => {
            setIsDetailMode(false);
            // Resume spinning after closing details
            setTimeout(() => {
              setIsSpinning(true);
            }, 300);
          }}
        />
      )}
    </>
  );
}