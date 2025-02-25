"use client";

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for the EnhancedScene component
const EnhancedScene = dynamic(() => import('./EnhancedScene'), {
  ssr: false,
});

export default function ThreeDIsometricScene() {
  return <EnhancedScene />;
}