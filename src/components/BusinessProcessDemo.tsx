"use client";

import React, { useState } from 'react';
import IsometricScene from './IsometricScene';
import IsometricControls from './IsometricControls';

export default function BusinessProcessDemo() {
  const [sceneProps, setSceneProps] = useState({
    zoom: 1,
    rotation: 0,
    elevation: 0,
  });

  const handleZoomChange = (zoom: number) => {
    setSceneProps(prev => ({ ...prev, zoom }));
  };

  const handleRotationChange = (rotation: number) => {
    setSceneProps(prev => ({ ...prev, rotation }));
  };

  const handleElevationChange = (elevation: number) => {
    setSceneProps(prev => ({ ...prev, elevation }));
  };

  const handleReset = () => {
    setSceneProps({
      zoom: 1,
      rotation: 0,
      elevation: 0,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Logo & Header */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          <span className="text-blue-400">3D</span>
          <span className="text-white">Isometric</span>
          <span className="text-pink-400">Workflow</span>
        </h1>
        <p className="text-white/70 mt-1">Interactive business process visualization</p>
      </div>

      {/* Main 3D Scene */}
      <div
        className="w-full h-full transform-gpu"
        style={{
          transform: `scale(${sceneProps.zoom}) rotateY(${sceneProps.rotation}deg) rotateX(${sceneProps.elevation}deg)`,
          transition: 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
        }}
      >
        <IsometricScene />
      </div>

      {/* Interactive Controls */}
      <IsometricControls
        onZoomChange={handleZoomChange}
        onRotationChange={handleRotationChange}
        onElevationChange={handleElevationChange}
        onReset={handleReset}
      />

      {/* Brief explanation */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 text-white">
        <p className="text-sm">
          <span className="font-medium">Hover</span> over cards to interact • 
          <span className="font-medium"> Use controls</span> to change perspective
        </p>
      </div>
    </div>
  );
}