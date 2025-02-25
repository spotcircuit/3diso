"use client";

import React, { useState } from 'react';

interface IsometricControlsProps {
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
  onElevationChange: (elevation: number) => void;
  onReset: () => void;
}

export default function IsometricControls({
  onZoomChange,
  onRotationChange,
  onElevationChange,
  onReset
}: IsometricControlsProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [elevation, setElevation] = useState(0);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    onZoomChange(newZoom);
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRotation = parseInt(e.target.value);
    setRotation(newRotation);
    onRotationChange(newRotation);
  };

  const handleElevationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newElevation = parseInt(e.target.value);
    setElevation(newElevation);
    onElevationChange(newElevation);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setElevation(0);
    onReset();
  };

  return (
    <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 text-white w-64">
      <h3 className="text-lg font-bold mb-3">View Controls</h3>
      
      <div className="mb-3">
        <label className="block text-sm mb-1">Zoom: {zoom.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={zoom}
          onChange={handleZoomChange}
          className="w-full accent-blue-500"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm mb-1">Rotation: {rotation}°</label>
        <input
          type="range"
          min="-30"
          max="30"
          step="1"
          value={rotation}
          onChange={handleRotationChange}
          className="w-full accent-purple-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Elevation: {elevation}°</label>
        <input
          type="range"
          min="-15"
          max="15"
          step="1"
          value={elevation}
          onChange={handleElevationChange}
          className="w-full accent-pink-500"
        />
      </div>
      
      <button
        onClick={handleReset}
        className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
      >
        Reset View
      </button>
    </div>
  );
}