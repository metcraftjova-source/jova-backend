import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';

import * as THREE from 'three';
import {
  Layers, Cpu, Maximize2, Play, Pause, Sliders,
  Activity, Database, Terminal, Compass
} from 'lucide-react';

// Procedural brushed metal texture generator for realistic steel sheen reflections
let brushedMetalTexture = null;
if (typeof window !== 'undefined') {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Base steel gray
  ctx.fillStyle = "#888888";
  ctx.fillRect(0, 0, 512, 512);

  // Draw fine brushed scratches
  for (let i = 0; i < 1500; i++) {
    ctx.strokeStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.09)" : "rgba(0,0,0,0.09)";
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    const x = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  brushedMetalTexture = new THREE.CanvasTexture(canvas);
  brushedMetalTexture.wrapS = THREE.RepeatWrapping;
  brushedMetalTexture.wrapT = THREE.RepeatWrapping;
  brushedMetalTexture.repeat.set(1.5, 1.5);
  brushedMetalTexture.anisotropy = 8;
}

// ─────────────────────────────────────────────────────────────────
// WireBox – pure blueprint skeleton (no panels)
// ─────────────────────────────────────────────────────────────────
const WireBox = ({ position, args, wireRef }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={args} />
      <meshBasicMaterial transparent opacity={0.015} color="#061018" depthWrite={false} />
      <Edges ref={wireRef} linewidth={0.7} threshold={15}>
        <lineBasicMaterial color="#4a5568" toneMapped={false} transparent opacity={0.8} />
      </Edges>
    </mesh>
  </group>
);

// ─────────────────────────────────────────────────────────────────
// SteelPanel – single large opaque metallic panel with bright edges
// ─────────────────────────────────────────────────────────────────
const SteelPanel = ({ position, w, h, d = 0.22, face = 'front', sheetRef }) => {
  const GAP = 0.06;
  return (
    <mesh
      position={position}
      ref={sheetRef}
      onUpdate={(self) => { self.userData.face = face; }}
    >
      <boxGeometry args={[w * (1 - GAP), h * (1 - GAP), d]} />
      <meshStandardMaterial
        color="#e2e8f0"
        metalness={1.0}
        roughness={0.15}
        bumpMap={brushedMetalTexture}
        bumpScale={0.008}
        envMapIntensity={2.8}
        transparent
        opacity={0}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

// FrontFaceGrid – cols x rows panels on the front (z+) face
const FrontFaceGrid = ({ cx, cy, cz, width, height, depth, cols, rows, sheetRef, wireRef, omittedPanels = [] }) => {
  const cellW = width / cols;
  const cellH = height / rows;
  const panels = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const px = cx - width / 2 + cellW / 2 + c * cellW;
      const py = cy - height / 2 + cellH / 2 + r * cellH;
      const pz = cz + depth / 2 + 0.06;

      const isOmitted = omittedPanels.includes(`${c}-${r}`);

      panels.push(
        <group key={`f-${c}-${r}`} position={[px, py, pz]}>
          <WireBox position={[0, 0, 0]} args={[cellW * 0.94, cellH * 0.94, 0.22]} wireRef={wireRef} />
          {!isOmitted && (
            <SteelPanel position={[0, 0, 0]} w={cellW} h={cellH} d={0.22} face="front" sheetRef={sheetRef} />
          )}
        </group>
      );
    }
  }
  return <>{panels}</>;
};

// RightFaceGrid – cols x rows panels on the right (x+) face
const RightFaceGrid = ({ cx, cy, cz, width, height, depth, cols, rows, sheetRef, wireRef, omittedPanels = [] }) => {
  const cellD = depth / cols;
  const cellH = height / rows;
  const panels = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const px = cx + width / 2 + 0.06;
      const py = cy - height / 2 + cellH / 2 + r * cellH;
      const pz = cz - depth / 2 + cellD / 2 + c * cellD;

      const isOmitted = omittedPanels.includes(`${c}-${r}`);

      panels.push(
        <group key={`r-${c}-${r}`} position={[px, py, pz]}>
          <WireBox position={[0, 0, 0]} args={[0.22, cellH * 0.94, cellD * 0.94]} wireRef={wireRef} />
          {!isOmitted && (
            <mesh
              position={[0, 0, 0]}
              ref={sheetRef}
              onUpdate={(self) => { self.userData.face = 'right'; }}
            >
              <boxGeometry args={[0.22, cellH * 0.94, cellD * 0.94]} />
              <meshStandardMaterial
                color="#e2e8f0"
                metalness={1.0}
                roughness={0.15}
                bumpMap={brushedMetalTexture}
                bumpScale={0.008}
                envMapIntensity={2.8}
                transparent
                opacity={0}
                side={THREE.FrontSide}
              />
            </mesh>
          )}
        </group>
      );
    }
  }
  return <>{panels}</>;
};

// ─────────────────────────────────────────────────────────────────
// ReferenceBuilding – 3-floor stepped building + glow on mouse move
// ─────────────────────────────────────────────────────────────────
export const ReferenceBuilding = ({ sheetsRef, wiresRef, glowRef, buildingGroupRef, isRotating, disableAnimations = false }) => {
  const addToSheets = (el) => {
    if (el && sheetsRef && !sheetsRef.current.includes(el)) sheetsRef.current.push(el);
  };
  const addToWires = (el) => {
    if (el && wiresRef && !wiresRef.current.includes(el)) wiresRef.current.push(el);
  };

  useFrame(({ clock }, delta) => {
    if (disableAnimations) return;
    // 1. Mouse hover glow logic
    glowRef.current = THREE.MathUtils.lerp(glowRef.current, 0, delta * 0.35);
    const dim = new THREE.Color('#2d3748');
    const glow = new THREE.Color('#3BA7FF').multiplyScalar(1.7);
    const cur = dim.clone().lerp(glow, glowRef.current);

    buildingGroupRef.current?.traverse((child) => {
      if (!child.material) return;
      const t = child.material.type;
      if (t === 'MeshStandardMaterial' || t === 'MeshBasicMaterial') return;
      if (child.material.color) child.material.color.copy(cur);
      if (child.material.uniforms?.color) child.material.uniforms.color.value.copy(cur);
      if (child.material.uniforms?.diffuse) child.material.uniforms.diffuse.value.copy(cur);
    });

    // 2. 90-degree oscillation (left to front)
    if (isRotating && buildingGroupRef.current) {
      const time = clock.getElapsedTime();
      // Base rotation 45 degrees. Oscillates +/- 45 degrees (90 total).
      buildingGroupRef.current.rotation.y = -Math.PI / 4 + Math.sin(time * 0.35) * (Math.PI / 4);
    }
  });

  const FH = 3;
  const F1 = { cx: 0, cy: FH / 2, cz: 0, w: 14, h: FH, d: 8 };
  const F2 = { cx: 0, cy: FH + FH / 2, cz: 0, w: 14, h: FH, d: 8 };
  const F3 = { cx: 2, cy: FH * 2 + FH / 2, cz: 0, w: 10, h: FH, d: 6 };

  return (
    <group ref={buildingGroupRef} position={[0, -4.8, 0]} rotation={[0, -Math.PI / 4, 0]} scale={[1.15, 1.15, 1.15]}>

      {/* Floor 1 */}
      <WireBox position={[F1.cx, F1.cy, F1.cz]} args={[F1.w, F1.h, F1.d]} wireRef={addToWires} />
      <FrontFaceGrid cx={F1.cx} cy={F1.cy} cz={F1.cz} width={F1.w} height={F1.h} depth={F1.d} cols={4} rows={2} sheetRef={addToSheets} wireRef={addToWires} omittedPanels={['1-0', '2-0']} />
      <RightFaceGrid cx={F1.cx} cy={F1.cy} cz={F1.cz} width={F1.w} height={F1.h} depth={F1.d} cols={3} rows={2} sheetRef={addToSheets} wireRef={addToWires} omittedPanels={['1-0']} />

      {/* Floor 2 */}
      <WireBox position={[F2.cx, F2.cy, F2.cz]} args={[F2.w, F2.h, F2.d]} wireRef={addToWires} />
      <FrontFaceGrid cx={F2.cx} cy={F2.cy} cz={F2.cz} width={F2.w} height={F2.h} depth={F2.d} cols={4} rows={2} sheetRef={addToSheets} wireRef={addToWires} omittedPanels={['1-0', '2-0']} />
      <RightFaceGrid cx={F2.cx} cy={F2.cy} cz={F2.cz} width={F2.w} height={F2.h} depth={F2.d} cols={3} rows={2} sheetRef={addToSheets} wireRef={addToWires} omittedPanels={['1-0']} />

      {/* Floor 3 (top setback) */}
      <WireBox position={[F3.cx, F3.cy, F3.cz]} args={[F3.w, F3.h, F3.d]} wireRef={addToWires} />
      <FrontFaceGrid cx={F3.cx} cy={F3.cy} cz={F3.cz} width={F3.w} height={F3.h} depth={F3.d} cols={3} rows={2} sheetRef={addToSheets} wireRef={addToWires} omittedPanels={['1-0']} />
      <RightFaceGrid cx={F3.cx} cy={F3.cy} cz={F3.cz} width={F3.w} height={F3.h} depth={F3.d} cols={2} rows={2} sheetRef={addToSheets} wireRef={addToWires} />

      {/* Filler Panels around Center Door (Floor 1) */}
      <group position={[-2.45, 0.75, 4.06]}>
        <WireBox position={[0, 0, 0]} args={[2.1 * 0.94, 1.5 * 0.94, 0.22]} wireRef={addToWires} />
        <SteelPanel position={[0, 0, 0]} w={2.1} h={1.5} d={0.22} face="front" sheetRef={addToSheets} />
      </group>
      <group position={[2.45, 0.75, 4.06]}>
        <WireBox position={[0, 0, 0]} args={[2.1 * 0.94, 1.5 * 0.94, 0.22]} wireRef={addToWires} />
        <SteelPanel position={[0, 0, 0]} w={2.1} h={1.5} d={0.22} face="front" sheetRef={addToSheets} />
      </group>

      {/* Filler Panels around Center Window (Floor 2) */}
      <group position={[-3.375, 3.75, 4.56]}>
        <SteelPanel position={[0, 0, 0]} w={0.25} h={1.5} d={0.22} face="front" sheetRef={addToSheets} />
      </group>
      <group position={[3.375, 3.75, 4.56]}>
        <SteelPanel position={[0, 0, 0]} w={0.25} h={1.5} d={0.22} face="front" sheetRef={addToSheets} />
      </group>

      {/* Structural details */}
      <WireBox position={[0, 0.07, 0]} args={[15, 0.14, 9]} wireRef={addToWires} />
      <WireBox position={[F1.cx, FH, F1.cz]} args={[F1.w, 0.14, F1.d]} wireRef={addToWires} />
      <WireBox position={[F2.cx, FH * 2, F2.cz]} args={[F2.w, 0.14, F2.d]} wireRef={addToWires} />
      <WireBox position={[F3.cx, FH * 3, F3.cz]} args={[F3.w, 0.14, F3.d]} wireRef={addToWires} />
      {[[-7, -4], [-7, 4], [7, -4], [7, 4]].map(([x, z], i) => (
        <WireBox key={i} position={[x, FH, z]} args={[0.24, FH * 2, 0.24]} wireRef={addToWires} />
      ))}

      {/* Steps & Doors - Floor 1 Center */}
      <WireBox position={[0, 0.15, 4.3]} args={[2.5, 0.1, 0.6]} wireRef={addToWires} />
      <WireBox position={[0, 0.05, 4.6]} args={[3.0, 0.1, 0.6]} wireRef={addToWires} />
      <WireBox position={[0, 1.45, 4.05]} args={[2.8, 0.1, 0.1]} wireRef={addToWires} />
      <WireBox position={[-1.4, 0.75, 4.05]} args={[0.05, 1.5, 0.15]} wireRef={addToWires} />
      <WireBox position={[1.4, 0.75, 4.05]} args={[0.05, 1.5, 0.15]} wireRef={addToWires} />
      <WireBox position={[0, 0.75, 4.05]} args={[0.05, 1.5, 0.15]} wireRef={addToWires} />

      {/* Steps & Doors - Floor 1 RIGHT FACE Center (c=1) */}
      <WireBox position={[7.3, 0.15, 0]} args={[0.6, 0.1, 2.0]} wireRef={addToWires} />
      <WireBox position={[7.6, 0.05, 0]} args={[0.6, 0.1, 2.5]} wireRef={addToWires} />
      <WireBox position={[7.06, 1.45, 0]} args={[0.1, 0.1, 2.2]} wireRef={addToWires} />
      <WireBox position={[7.06, 0.75, -1.1]} args={[0.15, 1.5, 0.05]} wireRef={addToWires} />
      <WireBox position={[7.06, 0.75, 1.1]} args={[0.15, 1.5, 0.05]} wireRef={addToWires} />
      <WireBox position={[7.06, 0.75, 0]} args={[0.15, 1.5, 0.05]} wireRef={addToWires} />

      {/* Filler Panels around Right Face Door (Floor 1) */}
      <group position={[7.06, 0.75, -1.3]}>
        <WireBox position={[0, 0, 0]} args={[0.22, 1.5 * 0.94, 0.4 * 0.94]} wireRef={addToWires} />
        <SteelPanel position={[0, 0, 0]} w={0.22} h={1.5} d={0.4} face="right" sheetRef={addToSheets} />
      </group>
      <group position={[7.06, 0.75, 1.3]}>
        <WireBox position={[0, 0, 0]} args={[0.22, 1.5 * 0.94, 0.4 * 0.94]} wireRef={addToWires} />
        <SteelPanel position={[0, 0, 0]} w={0.22} h={1.5} d={0.4} face="right" sheetRef={addToSheets} />
      </group>

      {/* Windows - Floor 2 Center */}
      <WireBox position={[0, 3.75, 4.05]} args={[6.5, 1.5, 0.1]} wireRef={addToWires} />
      <WireBox position={[-3.25, 3.75, 4.05]} args={[0.05, 1.5, 0.15]} wireRef={addToWires} />
      <WireBox position={[3.25, 3.75, 4.05]} args={[0.05, 1.5, 0.15]} wireRef={addToWires} />

      {/* Windows - Floor 2 RIGHT FACE Center (c=1) */}
      <WireBox position={[7.06, 3.75, 0]} args={[0.1, 1.5, 2.2]} wireRef={addToWires} />
      <WireBox position={[7.06, 3.75, -1.1]} args={[0.15, 1.5, 0.05]} wireRef={addToWires} />
      <WireBox position={[7.06, 3.75, 1.1]} args={[0.15, 1.5, 0.05]} wireRef={addToWires} />
      <WireBox position={[7.06, 3.75, 0]} args={[0.15, 1.5, 0.05]} wireRef={addToWires} />

      {/* Filler Panels around Right Face Window (Floor 2) */}
      <group position={[7.06, 3.75, -1.3]}>
        <WireBox position={[0, 0, 0]} args={[0.22, 1.5 * 0.94, 0.4 * 0.94]} wireRef={addToWires} />
        <SteelPanel position={[0, 0, 0]} w={0.22} h={1.5} d={0.4} face="right" sheetRef={addToSheets} />
      </group>
      <group position={[7.06, 3.75, 1.3]}>
        <WireBox position={[0, 0, 0]} args={[0.22, 1.5 * 0.94, 0.4 * 0.94]} wireRef={addToWires} />
        <SteelPanel position={[0, 0, 0]} w={0.22} h={1.5} d={0.4} face="right" sheetRef={addToSheets} />
      </group>

      {/* Floor 3 Center Window Frame (omitted 1-0) */}
      <WireBox position={[0, 6.75, 2.56]} args={[3.0, 1.5, 0.1]} wireRef={addToWires} />
      <WireBox position={[-1.5, 6.75, 2.56]} args={[0.05, 1.5, 0.15]} wireRef={addToWires} />
      <WireBox position={[1.5, 6.75, 2.56]} args={[0.05, 1.5, 0.15]} wireRef={addToWires} />
    </group>
  );
};



export default function AboutHero() {
  const [scanMode, setScanMode] = useState('auto'); // 'auto', 'wireframe', 'realistic'
  const [manualProgress, setManualProgress] = useState(0); // 0 to 100
  const [isRotating, setIsRotating] = useState(true);
  const [coordinates, setCoordinates] = useState([]);

  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const sheetsRef = useRef([]);
  const buildingGroupRef = useRef(null);

  // Glow factor for mouse highlights (shared via a ref to be read in useFrame at 60fps)
  const glowRef = useRef(0.0);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Mouse tilt variables
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [panelsLoaded, setPanelsLoaded] = useState(false);

  // Generate scrolling mock coordinates for CAD vibe
  useEffect(() => {
    const interval = setInterval(() => {
      const x = (Math.random() * 20 - 10).toFixed(4);
      const y = (Math.random() * 10 - 5).toFixed(4);
      const z = (Math.random() * 20 - 10).toFixed(4);
      const ver = Math.floor(Math.random() * 1000 + 12000);
      setCoordinates((prev) => [
        `[CAD_SYS]: V_${ver} | X: ${x} Y: ${y} Z: ${z}`,
        ...prev.slice(0, 4)
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Robust polling: wait until R3F meshes actually mount in sheetsRef, then trigger GSAP
  useEffect(() => {
    let rafId;
    let attempts = 0;
    const MAX_ATTEMPTS = 300; // ~5 seconds at 60fps

    const poll = () => {
      attempts++;
      if (sheetsRef.current.length > 0) {
        setPanelsLoaded(true);
      } else if (attempts < MAX_ATTEMPTS) {
        rafId = requestAnimationFrame(poll);
      }
    };

    rafId = requestAnimationFrame(poll);

    return () => {
      cancelAnimationFrame(rafId);
      sheetsRef.current = [];
    };
  }, []);

  // Global mousemove listener to trigger glow Ref when mouse is active anywhere in container
  useEffect(() => {
    const handleGlobalMove = () => {
      glowRef.current = 1.0;
    };
    window.addEventListener('mousemove', handleGlobalMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
    };
  }, []);

  // Sequential Steel Panel Attachment Animation using GSAP
  useGSAP(() => {
    if (!panelsLoaded || !sheetsRef.current.length) return;

    // Reset and kill active panel animations
    gsap.killTweensOf(sheetsRef.current);
    sheetsRef.current.forEach(mesh => {
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.material);
    });

    if (scanMode === 'auto') {
      // Cache original positions and set face-aware fly vectors
      const panels = sheetsRef.current;
      panels.forEach((mesh) => {
        if (!mesh.userData.origPos) mesh.userData.origPos = mesh.position.clone();
        const o = mesh.userData.origPos;
        // Use tagged face direction (set via onUpdate at mount)
        const isRight = mesh.userData.face === 'right';
        mesh.userData.flyVec = isRight
          ? new THREE.Vector3(9, 0.6, 0)   // right panels fly from right side
          : new THREE.Vector3(0, 0.6, 9);  // front panels fly from viewer side
        // Initialize to displaced + invisible
        mesh.position.copy(o).add(mesh.userData.flyVec);
        mesh.material.opacity = 0;
      });

      const PANEL_DUR = 0.3;
      const STAGGER = 0.03;
      const HOLD = 1.5;
      const DET_DUR = 0.2;
      const DET_STAG = 0.02;
      const totalIn = panels.length * STAGGER + PANEL_DUR;

      const tl = gsap.timeline({ repeat: -1, delay: 0.5 });

      // Phase 1: Attach — each panel flies in to its locked position
      panels.forEach((mesh, i) => {
        const o = mesh.userData.origPos;
        tl.to(mesh.position, { x: o.x, y: o.y, z: o.z, duration: PANEL_DUR, ease: 'power3.out' }, i * STAGGER);
        tl.to(mesh.material, { opacity: 1, duration: PANEL_DUR * 0.65, ease: 'power2.inOut' }, i * STAGGER);
      });

      // Phase 2: Hold fully assembled
      tl.to({}, { duration: HOLD }, totalIn);

      // Phase 3: Detach — panels fly back off in reverse
      const detStart = totalIn + HOLD;
      [...panels].reverse().forEach((mesh, i) => {
        const o = mesh.userData.origPos;
        const fv = mesh.userData.flyVec;
        const t = detStart + i * DET_STAG;
        tl.to(mesh.position, { x: o.x + fv.x, y: o.y + fv.y, z: o.z + fv.z, duration: DET_DUR, ease: 'power2.in' }, t);
        tl.to(mesh.material, { opacity: 0, duration: DET_DUR * 0.8, ease: 'power1.in' }, t);
      });

      // Phase 4: Hold wireframe before looping
      const detEnd = detStart + panels.length * DET_STAG + DET_DUR;
      tl.to({}, { duration: 1.0 }, detEnd);

    } else if (scanMode === 'wireframe') {
      // Explode all panels back out
      sheetsRef.current.forEach((mesh) => {
        if (!mesh.userData.origPos) mesh.userData.origPos = mesh.position.clone();
        const o = mesh.userData.origPos;
        const fv = mesh.userData.flyVec || new THREE.Vector3(0, 0, 6);
        gsap.to(mesh.position, { x: o.x + fv.x, y: o.y + fv.y, z: o.z + fv.z, duration: 0.6, ease: 'power2.in' });
        gsap.to(mesh.material, { opacity: 0, duration: 0.5, ease: 'power2.in' });
      });

    } else if (scanMode === 'realistic') {
      // All panels snap into place immediately (staggered for effect)
      sheetsRef.current.forEach((mesh, i) => {
        if (!mesh.userData.origPos) mesh.userData.origPos = mesh.position.clone();
        const o = mesh.userData.origPos;
        gsap.to(mesh.position, { x: o.x, y: o.y, z: o.z, duration: 0.6, ease: 'power3.out', delay: i * 0.015 });
        gsap.to(mesh.material, { opacity: 1, duration: 0.5, ease: 'power2.out', delay: i * 0.015 });
      });
    }
  }, { dependencies: [scanMode, panelsLoaded] });

  // Handle Manual range slider changes to control panel attachment progress
  useEffect(() => {
    if (!panelsLoaded || scanMode !== 'manual' || !sheetsRef.current.length) return;

    const count = sheetsRef.current.length;
    const activeCount = Math.floor((manualProgress / 100) * count);

    sheetsRef.current.forEach((mesh, index) => {
      if (!mesh.userData.origPos) mesh.userData.origPos = mesh.position.clone();
      const o = mesh.userData.origPos;
      const fv = mesh.userData.flyVec || new THREE.Vector3(0, 0, 7);

      if (index < activeCount) {
        gsap.to(mesh.position, { x: o.x, y: o.y, z: o.z, duration: 0.35, ease: 'power2.out' });
        gsap.to(mesh.material, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(mesh.position, { x: o.x + fv.x, y: o.y + fv.y, z: o.z + fv.z, duration: 0.25, ease: 'power2.in' });
        gsap.to(mesh.material, { opacity: 0, duration: 0.25, ease: 'power2.in' });
      }
    });
  }, [manualProgress, scanMode]);

  // Combined mouse interaction: 3D browser tilt AND wireframe glow highlight
  const handleMouseMove = (e) => {
    // 1. Mouse Tilt Calculations
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x: x * 6, y: -y * 6 }); // tilt max 6 degrees

    // 2. Local glow update
    glowRef.current = 1.0;
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Animate copy writing on page load
  useGSAP(() => {
    gsap.fromTo(".hero-animate",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power4.out" }
    );
    gsap.fromTo(".panel-animate",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.5, stagger: 0.1, ease: "power3.out", delay: 0.4 }
    );
  }, { scope: containerRef });

  // Calculate live slider percentage based on scan mode
  const sliderPercentage = useMemo(() => {
    if (scanMode === 'wireframe') return 0;
    if (scanMode === 'realistic') return 100;
    if (scanMode === 'manual') return manualProgress;

    // In Auto scanning, approximate based on animation (this is simulated for panel loop)
    return 50;
  }, [scanMode, manualProgress]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-dvh bg-[#050B16] text-white flex items-center justify-center overflow-hidden py-24 px-4 sm:px-6 md:px-12 lg:px-24"
    >
      {/* Background Subtle Tech Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 167, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 167, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Radial Blue Neon glows */}
      <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#3BA7FF] opacity-[0.08] blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#3BA7FF] opacity-[0.05] blur-[120px] pointer-events-none z-0"></div>

      <div className="relative w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">

        {/* LEFT COLUMN: Typography & Taglines */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">

          <div className="hero-animate inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/20 bg-sky-950/20 text-[#3BA7FF] text-xs font-mono font-medium tracking-wider mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(59,167,255,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            FACADE.ENGINE_v1.02
          </div>

          <h1 className="hero-animate text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight font-sans">
            Precision <br />
            Sheet Metal & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-[#3BA7FF] drop-shadow-[0_2px_10px_rgba(59,167,255,0.25)]">
              Facades.
            </span>
          </h1>

          <p className="hero-animate text-gray-400 text-base md:text-lg mb-8 max-w-lg leading-relaxed font-light font-sans">
            Hover over the screen to trigger the holographic scanner. Witness blueprint wireframe vectors dynamically integrate into rigid, structural sheet metal facades.
          </p>

          {/* Call to Actions */}
          <div className="hero-animate flex flex-wrap gap-4 items-center mb-10 w-full sm:w-auto">
            <button className="px-8 py-3.5 bg-[#3BA7FF] hover:bg-[#208ae0] text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(59,167,255,0.3)] hover:shadow-[0_0_30px_rgba(59,167,255,0.5)] transform hover:-translate-y-0.5 cursor-pointer">
              Launch Compiler
              <Cpu className="w-4 h-4" />
            </button>
            <button className="px-8 py-3.5 bg-[#050B16]/60 hover:bg-sky-950/20 border border-gray-800 hover:border-sky-500/30 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-md cursor-pointer">
              Documentation
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* System Metrics Widget */}
          <div className="panel-animate w-full max-w-md p-4 rounded-xl border border-gray-800 bg-[#050B16]/50 backdrop-blur-xl flex flex-col font-mono text-left select-none relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent"></div>
            <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-sky-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>SYSTEM_METRICS</span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> SYSTEM ONLINE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col p-2 bg-[#0a1122]/40 rounded border border-gray-900">
                <span className="text-[10px] text-gray-500 uppercase">MESH_BLOCKS</span>
                <span className="text-gray-300 font-bold mt-0.5">22 BLOCKS</span>
              </div>
              <div className="flex flex-col p-2 bg-[#0a1122]/40 rounded border border-gray-900">
                <span className="text-[10px] text-gray-500 uppercase">FACADE_SHEETS</span>
                <span className="text-gray-300 font-bold mt-0.5">144 SEGMENTS</span>
              </div>
              <div className="flex flex-col p-2 bg-[#0a1122]/40 rounded border border-gray-900">
                <span className="text-[10px] text-gray-500 uppercase">GRID_RESOLUTION</span>
                <span className="text-gray-300 font-bold mt-0.5">1.2M SEGMENTATION</span>
              </div>
              <div className="flex flex-col p-2 bg-[#0a1122]/40 rounded border border-gray-900">
                <span className="text-[10px] text-gray-500 uppercase">ACTIVE_GLOW_STATE</span>
                <span className="text-sky-400 font-bold mt-0.5 flex items-center gap-1">
                  DYNAMIC_INTERACTIVE
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Giant Glass Browser Window containing the R3F Canvas */}
        <div className="lg:col-span-7 relative flex justify-center items-center h-[520px] sm:h-[600px] w-full">

          {/* Glass Browser Container with hover-tilt transform */}
          <div
            style={{
              transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: 'transform 0.15s ease-out'
            }}
            className="relative w-full max-w-[640px] h-[400px] sm:h-[450px] rounded-2xl border border-white/10 bg-[#050B16]/40 backdrop-blur-[16px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_40px_rgba(59,167,255,0.08)] flex flex-col overflow-hidden z-10"
          >
            {/* Browser Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a1122]/60 border-b border-white/5 select-none shrink-0">
              {/* Top-left window buttons */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 border border-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 border border-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70 border border-green-500/20"></div>
              </div>

              {/* Address URL */}
              <div className="flex items-center justify-center bg-[#050B16]/80 border border-white/5 rounded px-4 py-0.5 max-w-[340px] w-full mx-4 text-center">
                <span className="text-[10px] text-gray-500 font-mono tracking-wide truncate">
                  https://cad.jova.io/blueprint-facades-v2
                </span>
              </div>

              <Maximize2 className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
            </div>

            {/* Viewport for Canvas */}
            <div
              onMouseMove={() => { glowRef.current = 1.0; }}
              className="relative w-full h-full bg-[#050B16]/20"
            >
              <Canvas
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3, preserveDrawingBuffer: true }}
                camera={{ position: [16, 12, 20], fov: 42 }}
                className="absolute inset-0 w-full h-full"
              >
                <color attach="background" args={['#050B16']} />

                {/* Subdued premium lighting for silver steel without blown-out glare */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[8, 14, 16]} intensity={0.8} color="#dce8f5" />
                <directionalLight position={[-14, 8, 8]} intensity={0.5} color="#b8d4ee" />
                <directionalLight position={[0, 20, 8]} intensity={0.5} color="#ffffff" />
                <directionalLight position={[6, -6, 14]} intensity={0.3} color="#9ab8d6" />
                {/* Removed spotlight to eliminate artificial hot spots */}

                {/* Grid floor */}
                <gridHelper args={[40, 40, '#2e3d4f', '#0c1826']} position={[0, -4.82, 0]} />

                <Suspense fallback={null}>

                  <ReferenceBuilding
                    sheetsRef={sheetsRef}
                    glowRef={glowRef}
                    buildingGroupRef={buildingGroupRef}
                    isRotating={isRotating}
                  />
                </Suspense>


                {/* Bloom parameters tuned for outlines and emissive accents */}


                {/* Camera OrbitControls */}
                <OrbitControls
                  ref={orbitRef}
                  enableZoom={false}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2 - 0.05}
                  minPolarAngle={Math.PI / 4}
                />
              </Canvas>
            </div>
          </div>

          {/* FLOATING CAD PANEL A: Drafting Controls (Top Right) */}
          <div className="panel-animate absolute top-[-30px] right-[-10px] w-[220px] p-3 rounded-xl border border-sky-500/20 bg-[#050B16]/80 backdrop-blur-xl flex flex-col font-mono text-left select-none z-20 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-bold border-b border-white/5 pb-1.5 mb-2">
              <Sliders className="w-3 h-3" />
              <span>DRAFTING_CONTROLS</span>
            </div>

            {/* Selection modes */}
            <div className="flex flex-col gap-1.5 mb-3.5">
              <button
                onClick={() => setScanMode('auto')}
                className={`w-full py-1.5 px-2.5 text-[10px] font-bold rounded flex items-center justify-between border transition-all cursor-pointer ${scanMode === 'auto'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                  }`}
              >
                <span>AUTO ATTACH</span>
                <span className="text-[8px] px-1 bg-sky-500/30 text-sky-300 rounded font-normal uppercase">LOOP</span>
              </button>

              <button
                onClick={() => setScanMode('wireframe')}
                className={`w-full py-1.5 px-2.5 text-[10px] font-bold rounded flex items-center justify-between border transition-all cursor-pointer ${scanMode === 'wireframe'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                  }`}
              >
                <span>BLUEPRINT ONLY</span>
                <span className="text-[8px] px-1 bg-white/10 text-gray-400 rounded font-normal uppercase">WIRE</span>
              </button>

              <button
                onClick={() => setScanMode('realistic')}
                className={`w-full py-1.5 px-2.5 text-[10px] font-bold rounded flex items-center justify-between border transition-all cursor-pointer ${scanMode === 'realistic'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                  }`}
              >
                <span>FACADE LOADED</span>
                <span className="text-[8px] px-1 bg-white/10 text-gray-400 rounded font-normal uppercase">SOLID</span>
              </button>
            </div>

            {/* Manual Slider adjustment */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[8px] text-gray-500 font-bold uppercase">
                <span>Manual Build</span>
                <span className="text-sky-400">{sliderPercentage.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={manualProgress}
                onChange={(e) => {
                  setScanMode('manual');
                  setManualProgress(parseInt(e.target.value));
                }}
                className="w-full accent-sky-500 bg-gray-800 rounded-lg cursor-pointer h-1"
              />
            </div>
          </div>

          {/* FLOATING CAD PANEL B: Spectrometer & Integrity (Bottom Right) */}
          <div className="panel-animate absolute bottom-[10px] right-[-20px] w-[240px] p-3 rounded-xl border border-sky-500/20 bg-[#050B16]/80 backdrop-blur-xl flex flex-col font-mono text-left select-none z-20 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-bold border-b border-white/5 pb-1.5 mb-2.5">
              <Activity className="w-3 h-3" />
              <span>STRESS_INTEGRITY_CHECK</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between text-[8px] text-gray-500">
                  <span>FACADE_STEEL_TENSION</span>
                  <span className="text-sky-400 font-bold">98.2%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#3BA7FF] h-full rounded-full w-[98.2%] shadow-[0_0_10px_#3BA7FF]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between text-[8px] text-gray-500">
                  <span>PANEL_ALIGNMENT_TOLERANCE</span>
                  <span className="text-sky-400 font-bold">99.8%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#3BA7FF] h-full rounded-full w-[99.8%] shadow-[0_0_10px_#3BA7FF]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between text-[8px] text-gray-500">
                  <span>SEGMENT_JOINT_RIGIDITY</span>
                  <span className="text-sky-400 font-bold">89.1%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#3BA7FF] h-full rounded-full w-[89.1%] shadow-[0_0_10px_#3BA7FF]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between text-[8px] text-gray-500">
                  <span>THERMAL_INTEGRITY</span>
                  <span className="text-emerald-400 font-bold">PASS</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full w-[100%] shadow-[0_0_10px_#10b981]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CAD PANEL C: Coordinate Analyzer (Bottom Left) */}
          <div className="panel-animate absolute bottom-[10px] left-[-30px] w-[210px] p-3 rounded-xl border border-sky-500/20 bg-[#050B16]/80 backdrop-blur-xl flex flex-col font-mono text-left select-none z-20 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-bold">
                <Database className="w-3.5 h-3.5" />
                <span>COORDINATES_LOG</span>
              </div>
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors cursor-pointer`}
                title={isRotating ? "Pause Auto-Orbit" : "Resume Auto-Orbit"}
              >
                {isRotating ? <Pause className="w-3 h-3 text-sky-400" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* Coordinate log strings */}
            <div className="flex flex-col gap-1 min-h-[70px] justify-end">
              {coordinates.length === 0 ? (
                <span className="text-[9px] text-gray-600">WAITING FOR COMPUTE COORDINATES...</span>
              ) : (
                coordinates.map((coord, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] font-medium truncate"
                    style={{ opacity: 1 - idx * 0.2 }}
                  >
                    {coord}
                  </span>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 pt-2 mt-2 justify-between">
              <div className="flex items-center gap-1 text-[8px] text-gray-500">
                <Compass className="w-3 h-3 text-sky-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>XYZ_COMPASS: AUTO</span>
              </div>
              <span className="text-[8px] text-[#3BA7FF]">UNIT: METERS</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom fade transition to black background */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10"></div>

    </section>
  );
}
