"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { useControls, folder } from 'leva';
import * as THREE from 'three';

// Business process steps data - positioned much higher
const businessProcessSteps = [
  {
    id: 1,
    title: 'Research',
    description: 'Gather market data and identify customer needs for product development',
    icon: '🔍',
    color: new THREE.Color(0x3b82f6),
    position: [-4, 4, -2],
  },
  {
    id: 2,
    title: 'Planning',
    description: 'Define project scope, objectives, and timeline with key stakeholders',
    icon: '📋',
    color: new THREE.Color(0xa855f7),
    position: [0, 4, -2],
  },
  {
    id: 3,
    title: 'Design',
    description: 'Create prototypes and specifications based on requirements',
    icon: '✏️',
    color: new THREE.Color(0xec4899),
    position: [4, 4, -2],
  },
  {
    id: 4,
    title: 'Development',
    description: 'Build the product following best practices and quality standards',
    icon: '💻',
    color: new THREE.Color(0xf59e0b),
    position: [-4, 4, 2],
  },
  {
    id: 5,
    title: 'Testing',
    description: 'Validate functionality and performance through rigorous testing',
    icon: '🧪',
    color: new THREE.Color(0x10b981),
    position: [0, 4, 2],
  },
  {
    id: 6,
    title: 'Deployment',
    description: 'Launch the product to market and monitor initial performance',
    icon: '🚀',
    color: new THREE.Color(0xf43f5e),
    position: [4, 4, 2],
  },
];

// Card component with 3D effects
function ProcessCard({ data, index, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [elevationY, setElevationY] = useState(0);
  
  // Animation for floating effect - each card has a unique animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Different amplitude and frequency for each card
      const amplitude = 0.15 + (index * 0.02);
      const frequency = 0.5 + (index * 0.1);
      const phase = index * 0.5;
      
      // Base floating motion
      const baseY = data.position[1] + Math.sin(clock.getElapsedTime() * frequency + phase) * amplitude;
      
      // Add elevation when selected
      meshRef.current.position.y = baseY + elevationY;
      
      // Slight rotation for dynamic feel
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3 + index * 0.2) * 0.02;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2 + index * 0.1) * 0.01;
    }
  });

  // Handle card interaction
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  const handleClick = () => {
    setActive(!active);
    
    // Animate card up and down
    if (!isSelected) {
      // Card going up
      let startTime = Date.now();
      const animateUp = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 300, 1); // 300ms animation
        setElevationY(2 * progress); // Move up 2 units
        
        if (progress < 1) {
          requestAnimationFrame(animateUp);
        } else {
          onClick(data.id); // Only trigger selection after animation completes
        }
      };
      requestAnimationFrame(animateUp);
    } else {
      // Card going down
      let startTime = Date.now();
      const animateDown = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 300, 1); // 300ms animation
        setElevationY(2 * (1 - progress)); // Move down from 2 to 0
        
        if (progress < 1) {
          requestAnimationFrame(animateDown);
        } else {
          onClick(data.id); // Only trigger deselection after animation completes
        }
      };
      requestAnimationFrame(animateDown);
    }
  };
  
  return (
    <group
      ref={meshRef}
      position={[data.position[0], data.position[1], data.position[2]]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered || isSelected ? 1.1 : 1}
    >
      {/* Card base with beveled edges */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 2]} />
        <meshStandardMaterial 
          color={data.color} 
          metalness={0.3} 
          roughness={0.2}
          emissive={data.color}
          emissiveIntensity={hovered || isSelected ? 0.6 : 0.2}
        />
      </mesh>
      
      {/* Decorative edge highlight */}
      <mesh position={[0, 0.06, 0]} scale={[0.95, 1, 0.95]}>
        <boxGeometry args={[1.5, 0.02, 2]} />
        <meshStandardMaterial 
          color="white" 
          metalness={0.5} 
          roughness={0.1}
          opacity={0.3}
          transparent
        />
      </mesh>
      
      {/* Card content */}
      <group position={[0, 0.1, 0]}>
        {/* Title */}
        <Text
          position={[0, 0.2, 0.8]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.2}
        >
          {data.title}
        </Text>
        
        {/* Icon */}
        <Html
          position={[0, 0.2, 0.4]}
          transform
          distanceFactor={10}
          zIndexRange={[100, 0]}
        >
          <div className="text-2xl">{data.icon}</div>
        </Html>
        
        {/* Description */}
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
        >
          {data.description}
        </Text>
      </group>
    </group>
  );
}

// Grid for isometric effect
function IsometricGrid() {
  return (
    <group rotation={[Math.PI / 4, 0, Math.PI / 6]} position={[0, -1, 0]}>
      <gridHelper args={[30, 30, 0x888888, 0x444444]} />
    </group>
  );
}

// Particles for background effect
function Particles({ count = 100 }) {
  const mesh = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  // Generate random positions for particles
  const dummy = new THREE.Object3D();
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * 20;
      const y = (Math.random() * 2 - 1) * 20;
      const z = (Math.random() * 2 - 1) * 20;
      const scale = 0.1 + Math.random() * 0.2;
      temp.push({ position: [x, y, z], scale });
    }
    return temp;
  }, [count]);
  
  // Animate particles
  useFrame(() => {
    particles.forEach((particle, i) => {
      let { position, scale } = particle;
      dummy.position.set(position[0], position[1], position[2]);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.x = dummy.rotation.y += 0.01;
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
    </instancedMesh>
  );
}

// Main component
export default function ThreeJsIsometricScene() {
  const [selectedCard, setSelectedCard] = useState(null);
  
  const handleCardClick = (id) => {
    setSelectedCard(selectedCard === id ? null : id);
  };
  
  const { rotation, zoom } = useControls('Scene Controls', {
    rotation: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      label: 'Rotation',
    },
    zoom: {
      value: 1,
      min: 0.1,
      max: 10,
      step: 0.1,
      label: 'Zoom',
    },
  });
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <fog attach="fog" args={['#202030', 5, 30]} />
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <PerspectiveCamera 
          makeDefault 
          position={[0, 8, 12]} 
          fov={40} 
          rotation={[0, THREE.MathUtils.degToRad(rotation), 0]} 
          zoom={zoom} 
        />
        
        {/* Scene elements */}
        <IsometricGrid />
        <Particles count={50} />
        
        {/* Process cards */}
        {businessProcessSteps.map((step, index) => (
          <ProcessCard 
            key={step.id} 
            data={step} 
            index={index} 
            onClick={handleCardClick}
            isSelected={selectedCard === step.id}
          />
        ))}
        
        {/* Camera controls with limits */}
        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={8}
          maxDistance={20}
          target={[0, 4, 0]}
        />
      </Canvas>
      
      {/* Custom CSS for Leva controls */}
      <style jsx global>{`
        .leva-c-kWgxhW {
          background-color: rgba(30, 41, 59, 0.8) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .leva-c-iiGDeu {
          background-color: rgba(59, 130, 246, 0.6) !important;
        }
        .leva-c-dmsJDs {
          color: white !important;
        }
      `}</style>
      
      {/* Info panel */}
      <div className="absolute bottom-8 left-8 right-8 md:right-80 bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 text-white max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Business Process Cards</h2>
        <p className="mb-4">An interactive 3D visualization of our business processes. Each card represents a key business function or capability.</p>
        <div className="flex flex-wrap gap-2">
          {businessProcessSteps.map(step => (
            <button 
              key={step.id}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedCard === step.id ? 'bg-white text-gray-900 font-bold' : 'bg-white/20 hover:bg-white/30'
              }`}
              onClick={() => setSelectedCard(selectedCard === step.id ? null : step.id)}
            >
              {step.title}
            </button>
          ))}
        </div>
        
        {/* Selected step details */}
        {selectedCard && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{businessProcessSteps.find(s => s.id === selectedCard)?.icon}</span>
              <h3 className="text-lg font-bold">{businessProcessSteps.find(s => s.id === selectedCard)?.title}</h3>
            </div>
            <p className="text-sm text-white/80">{businessProcessSteps.find(s => s.id === selectedCard)?.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
