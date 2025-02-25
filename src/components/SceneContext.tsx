"use client";

import React, { createContext, useState, ReactNode, useRef, useEffect } from 'react';

interface SceneContextType {
  focusedCard: number | null;
  setFocusedCard: (id: number | null) => void;
  isFocusMode: boolean;
  setIsFocusMode: (mode: boolean) => void;
  isDetailMode: boolean;
  setIsDetailMode: (mode: boolean) => void;
  viewSettings: {
    zoom: number;
    rotation: number;
    elevation: number;
    perspective: number;
    panX: number;
    panY: number;
  };
  updateViewSettings: (settings: Partial<SceneContextType['viewSettings']>) => void;
  resetViewSettings: () => void;
  isCtrlPressed: boolean;
  setIsCtrlPressed: (pressed: boolean) => void;
  cardRotation: {
    x: number;
    y: number;
  };
  setCardRotation: (rotation: { x: number, y: number }) => void;
  draggable: boolean;
  setDraggable: (draggable: boolean) => void;
}

const defaultViewSettings = {
  zoom: 0.85,
  rotation: 0,
  elevation: 20,
  perspective: 1500,
  panX: 0,
  panY: 0,
};

export const SceneContext = createContext<SceneContextType>({
  focusedCard: null,
  setFocusedCard: () => {},
  isFocusMode: false,
  setIsFocusMode: () => {},
  isDetailMode: false,
  setIsDetailMode: () => {},
  viewSettings: defaultViewSettings,
  updateViewSettings: () => {},
  resetViewSettings: () => {},
  isCtrlPressed: false,
  setIsCtrlPressed: () => {},
  cardRotation: { x: 0, y: 0 },
  setCardRotation: () => {},
  draggable: false,
  setDraggable: () => {},
});

export const SceneProvider = ({ children }: { children: ReactNode }) => {
  const [focusedCard, setFocusedCard] = useState<number | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [viewSettings, setViewSettings] = useState(defaultViewSettings);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const [draggable, setDraggable] = useState(false);

  // Handle card focus state
  const handleSetFocusedCard = (id: number | null) => {
    if (id === null) {
      setFocusedCard(null);
      setIsFocusMode(false);
      setIsDetailMode(false);
    } else {
      setFocusedCard(id);
      setIsFocusMode(true);
    }
  };

  // Update view settings
  const updateViewSettings = (settings: Partial<typeof defaultViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...settings }));
  };

  // Reset view settings to defaults
  const resetViewSettings = () => {
    setViewSettings(defaultViewSettings);
    setCardRotation({ x: 0, y: 0 });
  };

  // Handle keyboard events for CTRL key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Handle case where user switches tabs/windows while pressing CTRL
    window.addEventListener('blur', () => setIsCtrlPressed(false));
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', () => setIsCtrlPressed(false));
    };
  }, []);

  return (
    <SceneContext.Provider
      value={{
        focusedCard,
        setFocusedCard: handleSetFocusedCard,
        isFocusMode,
        setIsFocusMode,
        isDetailMode,
        setIsDetailMode,
        viewSettings,
        updateViewSettings,
        resetViewSettings,
        isCtrlPressed,
        setIsCtrlPressed,
        cardRotation,
        setCardRotation,
        draggable,
        setDraggable,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};