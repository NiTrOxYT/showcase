"use client";

import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/animations/utils/reducedMotion";

function Sculpture() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scrollY = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Slow floating & breathing motion (disabled on reduced motion)
    if (!reducedMotion) {
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.12;
      }
      if (outerRef.current) {
        outerRef.current.rotation.y = time * 0.1;
        outerRef.current.rotation.x = time * 0.06;
      }
      if (innerRef.current) {
        innerRef.current.rotation.y = -time * 0.12;
        innerRef.current.rotation.z = -time * 0.08;
      }

      // 2. Mouse interactions (max 5-8 degrees = ~0.12 radians)
      if (groupRef.current) {
        const targetX = state.pointer.y * -0.1;
        const targetY = state.pointer.x * 0.1;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
      }
    }

    // 3. Scroll zoom & scale transition
    if (groupRef.current) {
      const maxScroll = 600;
      const scrollRatio = Math.min(scrollY.current / maxScroll, 1);
      
      // Scale down and push back as you scroll
      const scale = 1 - scrollRatio * 0.25;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.08));
      
      const targetZ = -scrollRatio * 1.5;
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        {/* Outer glass capsule */}
        <mesh ref={outerRef} castShadow receiveShadow>
          <torusKnotGeometry args={[1, 0.32, 160, 20, 3, 4]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.08}
            metalness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            transmission={0.9}
            thickness={1.6}
            ior={1.52}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner black chrome ribbon */}
        <mesh ref={innerRef}>
          <torusKnotGeometry args={[0.9, 0.12, 120, 16, 3, 4]} />
          <meshPhysicalMaterial
            color="#141414"
            roughness={0.05}
            metalness={0.95}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>
      </Center>
    </group>
  );
}

// Ambient floating particles
function DustParticles({ count = 80 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  });

  useFrame((state) => {
    if (reducedMotion || !pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = time * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#a3a3a3"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

interface Hero3DSceneProps {
  fallback: React.ReactNode;
}

export default function Hero3DScene({ fallback }: Hero3DSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      {/* Background ambient lighting vignettes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,240,240,0.6)_0%,rgba(255,255,255,1)_80%)] z-0 pointer-events-none" />
      
      {/* Film grain layer overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <Suspense fallback={fallback}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          className="w-full h-full relative z-20 pointer-events-auto"
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          
          {/* Key lights */}
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, -3, 3]} intensity={0.8} color="#e5e7eb" />
          
          <Sculpture />
          <DustParticles count={50} />

          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.3}
            scale={5}
            blur={2.4}
            far={3}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
