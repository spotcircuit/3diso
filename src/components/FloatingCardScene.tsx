"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  OrbitControls, 
  PerspectiveCamera, 
  Html,
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';

// TypeScript interfaces
interface CardDataType {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: THREE.Color;
  position: [number, number, number];
}

interface DraggableCardProps {
  data: CardDataType;
  index: number;
  onCardClick: (id: number, action?: string) => void;
  isSelected: boolean;
  isStanding: boolean;
}

interface ParticlesProps {
  count?: number;
}

// Card data
const cardData: CardDataType[] = [
  {
    id: 1,
    title: 'Research',
    description: 'Gather market data and identify customer needs for product development',
    icon: '🔍',
    color: new THREE.Color(0x3b82f6),
    position: [-4, 0, -2],
  },
  {
    id: 2,
    title: 'Planning',
    description: 'Define project scope, objectives, and timeline with key stakeholders',
    icon: '📋',
    color: new THREE.Color(0xa855f7),
    position: [0, 0, -2],
  },
  {
    id: 3,
    title: 'Design',
    description: 'Create prototypes and specifications based on requirements',
    icon: '✏️',
    color: new THREE.Color(0xec4899),
    position: [4, 0, -2],
  },
  {
    id: 4,
    title: 'Development',
    description: 'Build the product following best practices and quality standards',
    icon: '💻',
    color: new THREE.Color(0xf59e0b),
    position: [-4, 0, 2],
  },
  {
    id: 5,
    title: 'Testing',
    description: 'Validate functionality and performance through rigorous testing',
    icon: '🧪',
    color: new THREE.Color(0x10b981),
    position: [0, 0, 2],
  },
  {
    id: 6,
    title: 'Deployment',
    description: 'Launch the product to market and monitor initial performance',
    icon: '🚀',
    color: new THREE.Color(0xf43f5e),
    position: [4, 0, 2],
  },
];

// Card component with 3D effects and dragging
function DraggableCard({ data, index, onCardClick, isSelected, isStanding }: DraggableCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [position, setPosition] = useState<[number, number, number]>(data.position);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [spinSpeed, setSpinSpeed] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const { camera, raycaster, gl, size } = useThree();

  // Mouse position tracking
  type MousePosition = { x: number; y: number };
  const mouse = useRef<MousePosition>({ x: 0, y: 0 }).current;
  const prevMouse = useRef<MousePosition>({ x: 0, y: 0 }).current;
  
  // Floating animation effect
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Different amplitude and frequency for each card
    const amplitude = 0.2 + (index * 0.02);
    const frequency = 0.5 + (index * 0.1);
    const phase = index * 0.5;
    
    if (!isDragging) {
      if (isStanding) {
        // Higher elevated position when standing upright
        meshRef.current.position.y = 2.0; // Increased from 0.5 to 2.0 to make it go up more
      } else {
        // Apply floating animation only when not dragging and not in standing mode
        meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * frequency + phase) * amplitude;
      }
    }
    
    // Handle card spinning when selected
    if (isSelected && !isStanding) {
      setRotation((prev) => prev + spinSpeed);
      meshRef.current.rotation.y = rotation;
    } else if (isStanding) {
      // Allow spinning even when standing upright
      if (spinSpeed !== 0) {
        setRotation((prev) => prev + spinSpeed);
        meshRef.current.rotation.y = rotation;
      } else {
        // Reset other rotations when not spinning in standing mode
        meshRef.current.rotation.x = 0;
        meshRef.current.rotation.z = 0;
      }
    } else {
      // Add subtle rotation for dynamic feel
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3 + index * 0.2) * 0.02;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2 + index * 0.1) * 0.01;
    }
  });

  // Time tracking for double-click detection
  const lastClickRef = useRef(0);

  // Handle pointer interactions
  const handlePointerDown = (e: React.PointerEvent<THREE.Mesh>): void => {
    e.stopPropagation();
    
    // If ctrl is pressed, don't allow card interaction (allow camera panning instead)
    if (e.ctrlKey) return;
    
    // Convert mouse coordinates to normalized device coordinates
    mouse.x = (e.clientX / size.width) * 2 - 1;
    mouse.y = -(e.clientY / size.height) * 2 + 1;
    prevMouse.x = mouse.x;
    prevMouse.y = mouse.y;
    
    // Set dragging flag
    setIsDragging(true);
    // Set capture to ensure we get all events even when pointer leaves the canvas
    gl.domElement.setPointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e: React.PointerEvent<THREE.Mesh>): void => {
    if (!isDragging || e.ctrlKey) return;
    
    // Update mouse coordinates
    mouse.x = (e.clientX / size.width) * 2 - 1;
    mouse.y = -(e.clientY / size.height) * 2 + 1;
    
    // Calculate movement in world space
    const movementX = mouse.x - prevMouse.x;
    const movementY = mouse.y - prevMouse.y;
    
    // Update position with direct 3D movement 
    const newPos: [number, number, number] = [...position] as [number, number, number];
    newPos[0] += movementX * 20; // Increased from 15 to 20 for faster drag movement
    newPos[2] += movementY * 20;
    
    // Remove any position constraints - allow dragging anywhere
    // No bounds checking - let the user drag it outside the group
    
    setPosition(newPos);
    
    // Directly update mesh position for immediate feedback
    if (meshRef.current) {
      meshRef.current.position.x = newPos[0];
      meshRef.current.position.z = newPos[2];
    }
    
    // Store mouse position for next frame
    prevMouse.x = mouse.x;
    prevMouse.y = mouse.y;
  };
  
  const handlePointerUp = (e: React.PointerEvent<THREE.Mesh>): void => {
    if (!isDragging) return;
    
    // End dragging
    setIsDragging(false);
    gl.domElement.releasePointerCapture(e.pointerId);
    
    // Check if this was a short tap (click) rather than a drag
    const dragDistance = Math.sqrt(
      Math.pow(mouse.x - prevMouse.x, 2) + 
      Math.pow(mouse.y - prevMouse.y, 2)
    );
    
    if (dragDistance < 0.01) {
      // Check for double click
      const now = Date.now();
      const timeDiff = now - lastClickRef.current;
      
      if (timeDiff < 300) {
        // Double click detected - toggle between normal and standing
        onCardClick(data.id, 'stand');
      } else {
        // Single click - start/modify spinning
        onCardClick(data.id);
      }
      
      lastClickRef.current = now;
    }
  };
  
  const handlePointerCancel = (e: React.PointerEvent<THREE.Mesh>): void => {
    if (isDragging) {
      setIsDragging(false);
      gl.domElement.releasePointerCapture(e.pointerId);
    }
  };
  
  return (
    <group
      ref={meshRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 2.5]} />
        <meshStandardMaterial 
          color={data.color} 
          metalness={0.3} 
          roughness={0.2}
          emissive={data.color}
          emissiveIntensity={hovered || isSelected ? 0.6 : 0.2}
        />
      </mesh>
      
      {/* Card edge highlight */}
      <mesh position={[0, 0.06, 0]} scale={[0.95, 1, 0.95]}>
        <boxGeometry args={[1.8, 0.02, 2.5]} />
        <meshStandardMaterial 
          color="white" 
          metalness={0.5} 
          roughness={0.1}
          opacity={0.3}
          transparent
        />
      </mesh>
      
      {/* Card content - conditionally rendered based on card state */}
      <group 
        position={[0, 0.1, 0]}
        visible={!isSelected || isStanding} // Hide content when spinning, show when standing or not selected
      >
        {/* Title */}
        <Text
          position={[0, 0.2, 0.8]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
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
          fontSize={0.09}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
        >
          {data.description}
        </Text>
      </group>
      
      {/* Control buttons for selected card */}
      {isSelected && (
        <Html position={[0, isStanding ? 2.7 : 0.7, 0]} transform>
          <div className="flex space-x-2">
            <button 
              className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle standing mode
                onCardClick(data.id, 'stand');
              }}
            >
              {isStanding ? 'Close' : 'View'}
            </button>
            {/* Always show spin buttons */}
            <button 
              className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSpinSpeed(-0.02); // Spin left
              }}
            >
              ⟲
            </button>
            <button 
              className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSpinSpeed(0.02); // Spin right
              }}
            >
              ⟳
            </button>
            <button 
              className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSpinSpeed(0); // Stop spinning
              }}
            >
              ⏹
            </button>
          </div>
        </Html>
      )}
      
      {/* Card details when standing upright */}
      {isSelected && isStanding && (
        <group position={[0, 1.5, 0]}>
          {/* Upright card background */}
          <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
            <boxGeometry args={[1.8, 2.5, 0.1]} />
            <meshStandardMaterial 
              color={data.color} 
              metalness={0.3} 
              roughness={0.2}
              emissive={data.color}
              emissiveIntensity={0.4}
            />
          </mesh>
          
          {/* Decorative border */}
          <mesh position={[0, 0, 0.11]} scale={[0.95, 0.95, 1]}>
            <boxGeometry args={[1.8, 2.5, 0.02]} />
            <meshStandardMaterial 
              color="white" 
              metalness={0.5} 
              roughness={0.1}
              opacity={0.3}
              transparent
            />
          </mesh>
          
          {/* Title */}
          <Text
            position={[0, 0.9, 0.2]}
            fontSize={0.18}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.6}
            font={undefined} // Use default font
          >
            {data.title}
          </Text>
          
          {/* Icon */}
          <Html
            position={[0, 0.5, 0.2]}
            transform
            distanceFactor={10}
            zIndexRange={[100, 0]}
          >
            <div className="text-4xl">{data.icon}</div>
          </Html>
          
          {/* Description */}
          <Text
            position={[0, 0.1, 0.2]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.6}
          >
            {data.description}
          </Text>
          
          {/* Additional details */}
          <Text
            position={[0, -0.4, 0.2]}
            fontSize={0.09}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.6}
          >
            {`Status: ${data.id <= 3 ? 'In Progress' : 'Planned'}\nPriority: ${data.id % 2 === 0 ? 'High' : 'Medium'}\nTeam: ${data.id % 3 === 0 ? 'Alpha' : data.id % 3 === 1 ? 'Beta' : 'Gamma'}`}
          </Text>
          
          {/* Glow effect */}
          <pointLight position={[0, 0, 1]} intensity={0.6} color="white" distance={3} />
        </group>
      )}
    </group>
  );
}

// Background particles
function Particles({ count = 100 }: ParticlesProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  // Generate random positions for particles
  const dummy = new THREE.Object3D();
  const particles = React.useMemo(() => {
    const temp: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * 20;
      const y = (Math.random() * 2 - 1) * 10;
      const z = (Math.random() * 2 - 1) * 20;
      const scale = 0.1 + Math.random() * 0.2;
      temp.push({ position: [x, y, z], scale });
    }
    return temp;
  }, [count]);
  
  // Animate particles
  useFrame(() => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      const { position, scale } = particle;
      dummy.position.set(position[0], position[1], position[2]);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.x = dummy.rotation.y += 0.002;
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current.instanceMatrix) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });
  
  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
    </instancedMesh>
  );
}

interface ParticleData {
  position: [number, number, number];
  scale: number;
}

// Main scene component
function FloatingCardScene(): JSX.Element {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cardState, setCardState] = useState<'normal' | 'spinning' | 'standing'>('normal');
  const controlsRef = useRef<any>(null); // Using any because OrbitControls doesn't export its type
  const isCtrlPressed = useRef<boolean>(false);
  
  // Handle keyboard controls for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Control' && !isCtrlPressed.current) {
        isCtrlPressed.current = true;
        
        // Enable panning when ctrl is pressed, disable rotation
        if (controlsRef.current) {
          controlsRef.current.enablePan = true;
          controlsRef.current.enableRotate = false;
          document.body.style.cursor = 'move';
          
          // Increase pan speed for better control
          const prevPanSpeed = controlsRef.current.panSpeed;
          controlsRef.current.panSpeed = 2.0;
          
          // Store original values for restoration
          controlsRef.current._prevPanSpeed = prevPanSpeed;
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent): void => {
      if (e.key === 'Control') {
        isCtrlPressed.current = false;
        
        // Disable panning when ctrl is released, re-enable rotation
        if (controlsRef.current) {
          controlsRef.current.enablePan = false;
          controlsRef.current.enableRotate = true;
          document.body.style.cursor = 'auto';
          
          // Restore original panSpeed
          if (controlsRef.current._prevPanSpeed !== undefined) {
            controlsRef.current.panSpeed = controlsRef.current._prevPanSpeed;
          }
        }
      }
    };
    
    // Handle blur event (if user tabs out while holding CTRL)
    const handleBlur = (): void => {
      if (isCtrlPressed.current) {
        isCtrlPressed.current = false;
        
        if (controlsRef.current) {
          controlsRef.current.enablePan = false;
          controlsRef.current.enableRotate = true;
          document.body.style.cursor = 'auto';
          
          // Restore original panSpeed
          if (controlsRef.current._prevPanSpeed !== undefined) {
            controlsRef.current.panSpeed = controlsRef.current._prevPanSpeed;
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.body.style.cursor = 'auto';
    };
  }, []);
  
  // Handle card click
  const handleCardClick = (id: number, action: string = 'toggle'): void => {
    if (action === 'stand') {
      // Toggle between standing and normal for this specific card
      if (selectedCard === id && cardState === 'standing') {
        setCardState('normal');
      } else {
        setSelectedCard(id);
        setCardState('standing');
      }
    } else {
      // Toggle between spinning and normal
      if (selectedCard === id) {
        setSelectedCard(null);
        setCardState('normal');
      } else {
        setSelectedCard(id);
        setCardState('spinning');
      }
    }
  };
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-indigo-950">
      {/* Main 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={['#070b15']} />
        <fog attach="fog" args={['#070b15', 5, 40]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <pointLight position={[-5, 5, -5]} color="#5583ff" intensity={0.5} />
        <pointLight position={[5, 5, 5]} color="#ff5583" intensity={0.5} />
        
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={40} />
        
        {/* Background elements */}
        <Particles count={80} />
        
        {/* Grid floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#0a0a18" metalness={0.8} roughness={0.5} />
        </mesh>
        
        {/* Grid lines */}
        <gridHelper args={[50, 50, '#1a1a2e', '#101020']} position={[0, -1.9, 0]} />
        
        {/* Cards */}
        {cardData.map((card, index) => (
          <DraggableCard 
            key={card.id} 
            data={card} 
            index={index} 
            onCardClick={handleCardClick}
            isSelected={selectedCard === card.id}
            isStanding={selectedCard === card.id && cardState === 'standing'}
          />
        ))}
        
        {/* Camera controls */}
        <OrbitControls 
          ref={controlsRef}
          enableDamping 
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below the ground
          target={[0, 0, 0]}
          enablePan={false} // We'll enable this programmatically with CTRL key
          rotateSpeed={0.7}
          zoomSpeed={1.2}
          panSpeed={1.5}
        />
      </Canvas>
      
      {/* UI Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Title and instructions */}
        <div className="absolute top-4 left-8 text-white">
          <h1 className="text-3xl font-bold tracking-tighter mb-1">
            <span className="text-blue-400">3D</span>
            <span className="text-white">Isometric</span>
            <span className="text-pink-400">Cards</span>
          </h1>
          <p className="text-white/70 text-sm">Interactive business process visualization</p>
        </div>
        
        {/* Instructions overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          <p>Drag cards freely • Click to spin • Mouse wheel to zoom • Hold CTRL to pan</p>
        </div>
        
        {/* Business Workflow Panel */}
        <div className="absolute top-4 right-4 w-80 bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden pointer-events-auto">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-white font-bold">Business Workflow</h2>
            <button className="text-white/60 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {cardData.map(card => (
              <div key={card.id} className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    card.id === 1 ? 'bg-blue-500' :
                    card.id === 2 ? 'bg-purple-500' :
                    card.id === 3 ? 'bg-pink-500' :
                    card.id === 4 ? 'bg-amber-500' :
                    card.id === 5 ? 'bg-emerald-500' :
                    'bg-rose-500'
                  }`}>
                    <span>{card.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{card.title}</h3>
                    <p className="text-white/60 text-xs">{
                      card.id <= 2 ? 'Completed' :
                      card.id === 3 ? 'In Progress' :
                      'Pending'
                    }</p>
                  </div>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1">
                  <div className={`h-full rounded-full ${
                    card.id === 1 ? 'bg-blue-500 w-full' :
                    card.id === 2 ? 'bg-purple-500 w-full' :
                    card.id === 3 ? 'bg-pink-500 w-2/3' :
                    card.id === 4 ? 'bg-amber-500 w-1/4' :
                    card.id === 5 ? 'bg-emerald-500 w-0' :
                    'bg-rose-500 w-0'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scene Controls Panel */}
        <div className="absolute bottom-4 left-4 w-80 bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden pointer-events-auto">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white font-bold">Scene Controls</h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className="text-white/90 text-sm block mb-2">Zoom</label>
              <input
                type="range"
                min="5"
                max="20"
                defaultValue="12"
                className="w-full h-2 bg-white/20 rounded-full appearance-none"
                onChange={(e) => {
                  if (controlsRef.current) {
                    const zoomValue = parseInt(e.target.value);
                    controlsRef.current.minDistance = 5;
                    controlsRef.current.maxDistance = 20;
                    controlsRef.current.object.position.z = zoomValue;
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <label className="text-white/90 text-sm block mb-2">Reset View</label>
              <button 
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-sm"
                onClick={() => {
                  if (controlsRef.current) {
                    controlsRef.current.reset();
                  }
                }}
              >
                Reset Camera
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingCardScene;