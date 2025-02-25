"use client";

import React, { useState, useContext } from 'react';
import { SceneContext } from './SceneContext';

interface AdvancedControlsProps {
  inMovableModule?: boolean;
}

export default function AdvancedControls({ inMovableModule = false }: AdvancedControlsProps) {
  const { 
    viewSettings, 
    updateViewSettings, 
    resetViewSettings,
    focusedCard,
    setFocusedCard,
    isFocusMode,
    isDetailMode,
    setCardRotation
  } = useContext(SceneContext);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePreset, setActivePreset] = useState('default');

  // Handle changes to controls
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateViewSettings({ zoom: parseFloat(e.target.value) });
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateViewSettings({ rotation: parseInt(e.target.value) });
  };

  const handleElevationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateViewSettings({ elevation: parseInt(e.target.value) });
  };

  const handlePerspectiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateViewSettings({ perspective: parseInt(e.target.value) });
  };

  const handlePanXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateViewSettings({ panX: parseInt(e.target.value) });
  };

  const handlePanYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateViewSettings({ panY: parseInt(e.target.value) });
  };

  // Focused card rotation controls
  const handleCardRotateX = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardRotation(prev => ({ ...prev, x: parseInt(e.target.value) }));
  };

  const handleCardRotateY = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardRotation(prev => ({ ...prev, y: parseInt(e.target.value) }));
  };

  const resetCardRotation = () => {
    setCardRotation({ x: 0, y: 0 });
  };

  // Preset views
  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    
    switch(preset) {
      case 'default':
        resetViewSettings();
        break;
      case 'top-down':
        updateViewSettings({
          rotation: 0,
          elevation: -25,
          perspective: 2000,
          zoom: 0.9,
          panX: 0,
          panY: 0
        });
        break;
      case 'side-view':
        updateViewSettings({
          rotation: 45,
          elevation: 0,
          perspective: 1800,
          zoom: 0.95,
          panX: 0,
          panY: 0
        });
        break;
      case 'close-up':
        updateViewSettings({
          rotation: 15,
          elevation: 5,
          perspective: 1200,
          zoom: 1.5,
          panX: 0,
          panY: 0
        });
        break;
      case 'bird-eye':
        updateViewSettings({
          rotation: 0,
          elevation: -40,
          perspective: 2200,
          zoom: 0.8,
          panX: 0,
          panY: 100
        });
        break;
      case 'explore':
        updateViewSettings({
          rotation: -30,
          elevation: 10,
          perspective: 1500,
          zoom: 1.2,
          panX: -100,
          panY: 0
        });
        break;
    }
  };

  // Reset focus and view
  const handleReset = () => {
    resetViewSettings();
    setFocusedCard(null);
    setActivePreset('default');
  };

  // UI state for expanded/compact view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Render different control panels based on state
  const renderControlPanel = () => {
    // In detail mode, show minimal controls
    if (isDetailMode) {
      return (
        <div className="bg-black/40 backdrop-blur-lg p-5 rounded-xl border border-white/10 text-white shadow-xl w-auto">
          <button
            onClick={() => setFocusedCard(null)}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-sm"
          >
            ← Exit Detail View
          </button>
        </div>
      );
    }
    
    // In focus mode (but not detail), show card rotation controls
    if (isFocusMode && !isDetailMode) {
      return (
        <div className="bg-black/40 backdrop-blur-lg p-5 rounded-xl border border-white/10 text-white shadow-xl w-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Card Controls</h3>
            <button
              onClick={() => setFocusedCard(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Card rotation controls */}
          <div className="space-y-4 mb-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Tilt X</label>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value="0"
                onChange={handleCardRotateX}
                className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-blue-900 to-blue-500 cursor-pointer"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Tilt Y</label>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value="0"
                onChange={handleCardRotateY}
                className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-pink-900 to-pink-500 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={resetCardRotation}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
            >
              Reset
            </button>
            <button
              onClick={() => setFocusedCard(null)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-sm"
            >
              Exit Focus
            </button>
          </div>
        </div>
      );
    }
    
    // Default scene controls
    return (
      <div className={`${!inMovableModule ? 'bg-gray-900/90 backdrop-blur-xl p-5 rounded-xl border border-white/20 shadow-xl' : ''} text-white
                      ${isExpanded ? 'w-96' : 'w-72'} transition-all duration-300`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Scene Controls</h3>
          <button 
            onClick={toggleExpanded}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
        
        {/* Presets section */}
        <div className="mb-5">
          <div className="flex gap-2 flex-wrap">
            {['default', 'top-down', 'side-view', 'close-up', 'bird-eye', 'explore'].map(preset => (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1 rounded-md text-xs capitalize transition-colors ${
                  activePreset === preset 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                {preset.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
  
        {/* Main controls */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Zoom</label>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{viewSettings.zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.05"
              value={viewSettings.zoom}
              onChange={handleZoomChange}
              className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-blue-900 to-blue-500 cursor-pointer"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Rotation</label>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{viewSettings.rotation}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="1"
              value={viewSettings.rotation}
              onChange={handleRotationChange}
              className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-purple-900 to-purple-500 cursor-pointer"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Elevation</label>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{viewSettings.elevation}°</span>
            </div>
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={viewSettings.elevation}
              onChange={handleElevationChange}
              className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-pink-900 to-pink-500 cursor-pointer"
            />
          </div>
          
          {isExpanded && (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">Perspective</label>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{viewSettings.perspective}px</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="3000"
                  step="50"
                  value={viewSettings.perspective}
                  onChange={handlePerspectiveChange}
                  className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-amber-900 to-amber-500 cursor-pointer"
                />
              </div>
              
              {/* Pan controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium">Pan X</label>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{viewSettings.panX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-500"
                    max="500"
                    step="10"
                    value={viewSettings.panX}
                    onChange={handlePanXChange}
                    className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-emerald-900 to-emerald-500 cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium">Pan Y</label>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{viewSettings.panY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-500"
                    max="500"
                    step="10"
                    value={viewSettings.panY}
                    onChange={handlePanYChange}
                    className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-rose-900 to-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-5">
          <button
            onClick={handleReset}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-colors font-medium"
          >
            Reset View
          </button>
        </div>
        
        {/* Navigation tip */}
        {isExpanded && (
          <div className="mt-5 p-3 bg-white/5 rounded-lg text-xs text-white/70 border border-white/5">
            <p className="mb-2 font-semibold">Pro Navigation Tips:</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Mouse wheel</kbd>
                <span>Zoom in/out</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Drag</kbd>
                <span>Rotate view</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">CTRL+Drag</kbd>
                <span>Pan scene or move cards</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Click card</kbd>
                <span>Focus & rotate card</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">CTRL+Drag card</kbd>
                <span>Move individual cards</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (inMovableModule) {
    return (
      <div 
        className="pointer-events-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {renderControlPanel()}
      </div>
    );
  }
  
  // When used standalone
  return (
    <div className="absolute top-8 right-8 z-40">
      {renderControlPanel()}
    </div>
  );
}