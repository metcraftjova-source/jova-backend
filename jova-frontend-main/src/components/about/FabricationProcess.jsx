import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, RoundedBox } from '@react-three/drei';

import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────
// Spark Particle System
// ─────────────────────────────────────────────────────────────────
export const Sparks = ({ count = 100, laserRef, isCuttingRef, disableAnimations = false }) => {
  const meshRef = useRef();

  // Initialize particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: Math.random() * 0.5 + 0.5,
        velocity: new THREE.Vector3(),
        position: new THREE.Vector3(),
        life: Math.random() * 0.2 // Random start life
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current || !laserRef.current || disableAnimations) return;

    // Use pure local coordinates relative to the CNCMachine group
    const toolPos = new THREE.Vector3();
    toolPos.copy(laserRef.current.position);
    toolPos.y -= 1.25; // Contact point offset

    particles.forEach((particle, i) => {
      particle.life -= delta;

      if (particle.life <= 0) {
        if (isCuttingRef && !isCuttingRef.current) {
          particle.life = 0;
          return;
        }

        particle.life = Math.random() * 0.2 + 0.15; // Natural short spark life
        particle.position.copy(toolPos);
        particle.position.y += 0.05;

        // Realistic outward spread
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 8 + 3;

        // Natural upward burst
        let upVel = Math.random() * 10 + 4;
        
        // Occasional downward sparks
        if (i % 6 === 0) {
          upVel = -(Math.random() * 3 + 1);
        }

        particle.velocity.set(Math.cos(angle) * spread, upVel, Math.sin(angle) * spread);
      }

      particle.velocity.y -= delta * 12.0; // Realistic gravity so they arc naturally
      particle.position.addScaledVector(particle.velocity, delta);

      dummy.position.copy(particle.position);

      // Align spark exactly to its velocity vector
      const target = particle.position.clone().add(particle.velocity);
      dummy.lookAt(target);
      dummy.rotateX(-Math.PI / 2);

      // Scale based on life - Natural streaks, distinctly visible
      const scale = Math.max(0, particle.life) * particle.factor;
      dummy.scale.set(scale * 2.0, scale * 6.0, scale * 2.0); // Thick, distinct visible streaks
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* Natural spark streaks */}
      <coneGeometry args={[0.015, 0.8, 4]} />
      {/* Bright warm yellow/orange core */}
      <meshBasicMaterial
        color="#ffcc55"
        toneMapped={false}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

// ─────────────────────────────────────────────────────────────────
// Procedural Metal Surface Texture (Roughness & Bump Map)
// ─────────────────────────────────────────────────────────────────
function createNoiseTexture() {
  if (typeof document === 'undefined') return null; // Safety for SSR
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Base mid-gray
  ctx.fillStyle = '#888888';
  ctx.fillRect(0, 0, 512, 512);

  // Add large organic smudges (varying roughness)
  for(let i=0; i<800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 50 + 10;
    const isDark = Math.random() > 0.5;
    const alpha = Math.random() * 0.15;
    ctx.fillStyle = isDark ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add fine metallic grain/noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 40;
    const val = Math.min(255, Math.max(0, data[i] + noise));
    data[i] = val;
    data[i+1] = val;
    data[i+2] = val;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4); // Scale the texture across the sheet
  return texture;
}

// ─────────────────────────────────────────────────────────────────
// CNC Machine Setup
// ─────────────────────────────────────────────────────────────────
export const CNCMachine = ({ disableAnimations = false, hideEnvironment = false }) => {
  const particleCount = 500;
  const laserGroupRef = useRef();
  const laserBeamRef = useRef();
  const bendingGroupRef = useRef();
  const contactPointRef = useRef();
  
  const noiseTexture = useMemo(() => createNoiseTexture(), []);

  const cutLine1Ref = useRef();
  const cutLine2Ref = useRef();
  const cutLine3Ref = useRef();
  const cutLine4Ref = useRef();
  const cutoutRef = useRef();
  const lBentCutoutRef = useRef();
  const uBentCutoutRef = useRef();
  const isCuttingRef = useRef(true);

  // Precompute geometries and paths for the dynamic cut
  const { cutLines, lineGeo, shapeGeo, cutoutGeo, lBentCutoutGeo, uBentCutoutGeo, punchGeo, sheetTopGeo, sheetBotGeo, sheetLeftGeo, sheetRightGeo } = useMemo(() => {
    // 1. Rectangle Points
    const w = 1.6;
    const h = 1.0;
    const pts = [
      new THREE.Vector3(-w/2, 0, -h/2),
      new THREE.Vector3(w/2, 0, -h/2),
      new THREE.Vector3(w/2, 0, h/2),
      new THREE.Vector3(-w/2, 0, h/2),
      new THREE.Vector3(-w/2, 0, -h/2) // Close loop
    ];
    
    // 2. Cut Lines Data
    const lines = [];
    for(let i=0; i<4; i++) {
      const start = pts[i];
      const end = pts[i+1];
      const vec = end.clone().sub(start);
      const len = vec.length();
      const angle = -Math.atan2(vec.z, vec.x); // Three.js Y-rotation correction
      lines.push({ start, len, angle });
    }

    const geo = new THREE.BoxGeometry(1, 0.052, 0.03); // Kerf thickness flush with sheet
    geo.translate(0.5, 0, 0); // Origin at start point

    // 3. Cutout Geometry (Replaced with a perfect box instead of ExtrudeGeometry to eliminate bugs)
    // We will define createSheetPiece first, so let's move it up!

    // 4. U-Bend Geometry (The finished folded piece)
    // Flat width is 1.6. If inner bottom is 0.8, then each wall is 0.4 tall to conserve material.
    const baseW = 0.8;
    const wallH = 0.4;

    const uShape = new THREE.Shape();
    uShape.moveTo(-baseW/2, wallH); // Left wall top
    uShape.lineTo(-baseW/2, 0);     // Left wall bottom
    uShape.lineTo(baseW/2, 0);      // Right wall bottom
    uShape.lineTo(baseW/2, wallH);  // Right wall top
    
    // Thickness offset (0.05)
    uShape.lineTo(baseW/2 + 0.05, wallH);
    uShape.lineTo(baseW/2 + 0.05, -0.05);
    uShape.lineTo(-baseW/2 - 0.05, -0.05);
    uShape.lineTo(-baseW/2 - 0.05, wallH);
    // ExtrudeGeometry auto-closes paths. Adding a duplicate vertex breaks Earcut triangulation!

    const uGeo = new THREE.ExtrudeGeometry(uShape, { depth: h, bevelEnabled: false });
    uGeo.translate(0, 0, -h/2); // Center on Z

    // 5. L-Bend Geometry (Intermediate step, right side bent up)
    const lShape = new THREE.Shape();
    lShape.moveTo(baseW/2 + 0.05, wallH); 
    lShape.lineTo(baseW/2 + 0.05, -0.05);
    lShape.lineTo(-0.8, -0.05);
    lShape.lineTo(-0.8, 0);
    lShape.lineTo(baseW/2, 0);
    lShape.lineTo(baseW/2, wallH);
    // Auto-closed

    const lGeo = new THREE.ExtrudeGeometry(lShape, { depth: h, bevelEnabled: false });
    lGeo.translate(0, 0, -h/2);

    // 6. Press Brake V-Punch Geometry (Gooseneck / Wedge shape)
    const punchShape = new THREE.Shape();
    punchShape.moveTo(0.15, 0.5);   // Top front
    punchShape.lineTo(-0.15, 0.5);  // Top back
    punchShape.lineTo(-0.02, 0);    // Bottom back tip (sharp)
    punchShape.lineTo(0.02, 0);     // Bottom front tip
    punchShape.lineTo(0.08, 0.2);   // Gooseneck curve
    // Auto-closed

    // Extrude along Z axis by 2.2 units (the width of the press block)
    const pGeo = new THREE.ExtrudeGeometry(punchShape, { depth: 2.2, bevelEnabled: false });
    // Rotate so depth goes along X axis to match the machine width
    pGeo.rotateY(Math.PI / 2);
    pGeo.translate(-1.1, 0, 0); // Center on X

    // 7. Base Metal Sheet (4 pieces for perfect UVs without ExtrudeGeometry triangulation bugs)
    const createSheetPiece = (w, h, d, cx, cz) => {
      const g = new THREE.BoxGeometry(w, h, d);
      const pos = g.attributes.position;
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) {
        // Map UVs perfectly to world space to eliminate all seams across the 4 pieces!
        // Scale by 0.4 to match the previous texture density (4 repeats over ~10 units)
        uv.setXY(i, (pos.getX(i) + cx) * 0.4, (pos.getZ(i) + cz) * 0.4);
      }
      return g;
    };

    const sTopGeo = createSheetPiece(9.6, 0.05, 3.0, -2.5, 3.0);
    const sBotGeo = createSheetPiece(9.6, 0.05, 5.0, -2.5, -2.0);
    const sLeftGeo = createSheetPiece(4.5, 0.05, 1.0, -5.05, 1.0);
    const sRightGeo = createSheetPiece(3.5, 0.05, 1.0, 0.55, 1.0);
    
    // 3. Cutout Geometry (Rebuilt as a box for perfect UVs and zero bugs)
    const cGeo = createSheetPiece(1.6, 0.05, 1.0, -2.0, 1.0);

    return { cutLines: lines, lineGeo: geo, cutoutGeo: cGeo, lBentCutoutGeo: lGeo, uBentCutoutGeo: uGeo, punchGeo: pGeo, sheetTopGeo: sTopGeo, sheetBotGeo: sBotGeo, sheetLeftGeo: sLeftGeo, sheetRightGeo: sRightGeo };
  }, []);

  const CYCLE_DURATION = 14.0;

  // Fully choreographed 14-second factory sequence
  useFrame((state) => {
    if (disableAnimations) return;
    const t = state.clock.elapsedTime;
    const cycleTime = t % CYCLE_DURATION;
    const cutLineRefs = [cutLine1Ref, cutLine2Ref, cutLine3Ref, cutLine4Ref];
    
    // Default visibility states
    if (cutoutRef.current) cutoutRef.current.visible = true;
    if (lBentCutoutRef.current) lBentCutoutRef.current.visible = false;
    if (uBentCutoutRef.current) uBentCutoutRef.current.visible = false;
    cutLineRefs.forEach(ref => { if(ref.current) ref.current.visible = false; });
    
    // --- PHASE 1: Laser Cutting (0s to 3s) ---
    if (cycleTime < 3.0) {
      isCuttingRef.current = true;
      if (contactPointRef.current) contactPointRef.current.visible = true;
      if (laserBeamRef.current) laserBeamRef.current.visible = true;

      // Map 3 seconds across 4 sides
      const segmentTime = 3.0 / 4.0;
      const segment = Math.floor(cycleTime / segmentTime);
      const progress = (cycleTime % segmentTime) / segmentTime;
      const lineData = cutLines[segment];
      
      if (laserGroupRef.current) {
        const currentX = lineData.start.x + Math.cos(-lineData.angle) * (lineData.len * progress);
        const currentZ = lineData.start.z + Math.sin(-lineData.angle) * (lineData.len * progress);
        laserGroupRef.current.position.set(-2.0 + currentX, 1.2, 1.0 + currentZ); 
      }

      // Grow the laser kerf lines
      for(let i=0; i<4; i++) {
        if (cutLineRefs[i].current) {
          if (i < segment) {
            cutLineRefs[i].current.visible = true;
            cutLineRefs[i].current.scale.set(cutLines[i].len, 1, 1);
          } else if (i === segment) {
            cutLineRefs[i].current.visible = progress > 0.01;
            cutLineRefs[i].current.scale.set(Math.max(0.001, cutLines[i].len * progress), 1, 1);
          } else {
            cutLineRefs[i].current.visible = false;
          }
        }
      }

      // Piece stays locked at cut position
      if (cutoutRef.current) {
        cutoutRef.current.position.set(-2.0, -0.075, 1.0);
        cutoutRef.current.rotation.set(0, 0, 0);
      }
      if (bendingGroupRef.current) bendingGroupRef.current.position.y = 1.7; // Press brake idle
    } 
    // --- PHASE 2: Transfer (3s to 5s) ---
    else if (cycleTime < 5.0) {
      isCuttingRef.current = false;
      if (contactPointRef.current) contactPointRef.current.visible = false;
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
      
      const slideProgress = (cycleTime - 3.0) / 2.0; // 0 to 1
      
      // Laser head lifts and moves away
      if (laserGroupRef.current) {
        laserGroupRef.current.position.y = 1.2 + Math.sin(slideProgress * Math.PI) * 1.0; 
        laserGroupRef.current.position.z = 1.0 - slideProgress * 1.0;
      }
      
      // Slide piece from cut position to press brake
      if (cutoutRef.current) {
        const ease = slideProgress < 0.5 ? 4 * Math.pow(slideProgress, 3) : 1 - Math.pow(-2 * slideProgress + 2, 3) / 2;
        // The machine is wide in X, so we rotate the piece 90 degrees to bend it correctly
        cutoutRef.current.position.x = -2.0 + (1.5 - (-2.0)) * ease; // Center on X under the press
        cutoutRef.current.position.y = -0.075 + Math.sin(slideProgress * Math.PI) * 0.4;
        cutoutRef.current.position.z = 1.0 + (-0.1 - 1.0) * ease; // Shift to Z=-0.1 for the first bend
        cutoutRef.current.rotation.y = -(Math.PI / 2) * ease; // Rotate 90 degrees gracefully
        
        if (lBentCutoutRef.current) {
          lBentCutoutRef.current.position.copy(cutoutRef.current.position);
          lBentCutoutRef.current.rotation.y = cutoutRef.current.rotation.y;
        }
      }
      if (bendingGroupRef.current) bendingGroupRef.current.position.y = 1.7;
    }
    // --- PHASE 3: First Press (L-Bend) (5s to 7s) ---
    else if (cycleTime < 7.0) {
      isCuttingRef.current = false;
      if (contactPointRef.current) contactPointRef.current.visible = false;
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
      
      const pressTime = cycleTime - 5.0; // 0 to 2s
      
      if (cutoutRef.current && lBentCutoutRef.current) {
        cutoutRef.current.position.set(1.5, -0.075, -0.1);
        cutoutRef.current.rotation.y = -Math.PI / 2;
        lBentCutoutRef.current.position.set(1.5, -0.075, -0.1);
        lBentCutoutRef.current.rotation.y = -Math.PI / 2;
        
        if (pressTime >= 0.5) {
          cutoutRef.current.visible = false;
          lBentCutoutRef.current.visible = true;
        } else {
          cutoutRef.current.visible = true;
          lBentCutoutRef.current.visible = false;
        }
      }
      
      if (bendingGroupRef.current) {
        let pressY = 1.7;
        if (pressTime < 0.5) pressY = 1.7 - (pressTime / 0.5) * 0.675; // Down
        else if (pressTime < 1.0) pressY = 1.025; // Hold
        else pressY = 1.025 + ((pressTime - 1.0) / 1.0) * 0.675; // Up
        bendingGroupRef.current.position.y = pressY;
      }
    }
    // --- PHASE 4: Shift Piece (7s to 9s) ---
    else if (cycleTime < 9.0) {
      isCuttingRef.current = false;
      if (contactPointRef.current) contactPointRef.current.visible = false;
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
      
      const shiftProgress = (cycleTime - 7.0) / 2.0;
      const ease = shiftProgress < 0.5 ? 4 * Math.pow(shiftProgress, 3) : 1 - Math.pow(-2 * shiftProgress + 2, 3) / 2;
      
      if (lBentCutoutRef.current) {
        lBentCutoutRef.current.visible = true;
        cutoutRef.current.visible = false;
        // Shift Z from -0.1 (first bend) to -0.9 (second bend)
        const currentZ = -0.1 + (-0.9 - (-0.1)) * ease;
        lBentCutoutRef.current.position.set(1.5, -0.075, currentZ);
        if (uBentCutoutRef.current) {
          uBentCutoutRef.current.position.copy(lBentCutoutRef.current.position);
          uBentCutoutRef.current.rotation.y = -Math.PI / 2;
        }
      }
      
      if (bendingGroupRef.current) bendingGroupRef.current.position.y = 1.7;
    }
    // --- PHASE 5: Second Press (U-Bend) (9s to 11s) ---
    else if (cycleTime < 11.0) {
      isCuttingRef.current = false;
      if (contactPointRef.current) contactPointRef.current.visible = false;
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
      
      const pressTime = cycleTime - 9.0; // 0 to 2s
      
      if (lBentCutoutRef.current && uBentCutoutRef.current) {
        lBentCutoutRef.current.position.set(1.5, -0.075, -0.9);
        uBentCutoutRef.current.position.set(1.5, -0.075, -0.9);
        
        if (pressTime >= 0.5) {
          lBentCutoutRef.current.visible = false;
          uBentCutoutRef.current.visible = true;
          cutoutRef.current.visible = false;
        } else {
          lBentCutoutRef.current.visible = true;
          uBentCutoutRef.current.visible = false;
          cutoutRef.current.visible = false;
        }
      }
      
      if (bendingGroupRef.current) {
        let pressY = 1.7;
        if (pressTime < 0.5) pressY = 1.7 - (pressTime / 0.5) * 0.675; // Down
        else if (pressTime < 1.0) pressY = 1.025; // Hold
        else pressY = 1.025 + ((pressTime - 1.0) / 1.0) * 0.675; // Up
        bendingGroupRef.current.position.y = pressY;
      }
    }
    // --- PHASE 6: Ejection & Display (11s to 14s) ---
    else {
      isCuttingRef.current = false;
      if (contactPointRef.current) contactPointRef.current.visible = false;
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
      
      const ejectProg = (cycleTime - 11.0) / 3.0; // 0 to 3s -> 0 to 1
      const ease = ejectProg < 0.5 ? 4 * Math.pow(ejectProg, 3) : 1 - Math.pow(-2 * ejectProg + 2, 3) / 2;
      
      if (cutoutRef.current) cutoutRef.current.visible = false;
      if (lBentCutoutRef.current) lBentCutoutRef.current.visible = false;
      
      if (uBentCutoutRef.current) {
        uBentCutoutRef.current.visible = true;
        // Slide out towards the camera along Z
        uBentCutoutRef.current.position.set(1.5, -0.075, -0.9 + ease * 4.0);
      }
      
      if (bendingGroupRef.current) bendingGroupRef.current.position.y = 1.7;
    }
  });

  // Unified Material Presets for consistent, realistic metallic look
  const machineSteelMat = { color: "#c8d0d8", metalness: 1.0, roughness: 0.25, envMapIntensity: 2.0 }; // Real steel, proper metalness
  const bentSteelMat = { color: "#ffffff", metalness: 1.0, roughness: 0.15, envMapIntensity: 2.5 }; // High-shine bright steel
  
  // Hyper-realistic hot-rolled steel using procedural physical maps
  const steelMat = { 
    color: "#4b5563", 
    metalness: 0.7, 
    roughness: 0.6,
    roughnessMap: noiseTexture,
    bumpMap: noiseTexture,
    bumpScale: 0.003,
    envMapIntensity: 1.0 
  }; 
  
  const darkMetalMat = { color: "#27272a", metalness: 0.6, roughness: 0.5, envMapIntensity: 1.0 }; // Very dark charcoal/slate
  const blackMat = { color: "#111827", metalness: 0.8, roughness: 0.3, envMapIntensity: 1.0 };

  return (
    <group>
      {/* ── Laser Bed (Machine Base) ── */}
      <group position={[-2.5, -0.3, 0]}>
        {/* Outer Red Industrial Frame */}
        <mesh position={[0, -0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[10.2, 0.3, 9.6]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.7} metalness={0.2} />
        </mesh>
        
        {/* Inner Dark Chassis */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[9.8, 0.1, 9.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.5} />
        </mesh>

        {/* Laser Bed Slats (The teeth that hold the metal) */}
        {Array.from({ length: 47 }).map((_, i) => (
          <mesh key={i} position={[-4.6 + i * 0.2, 0.15, 0]} receiveShadow>
            <boxGeometry args={[0.02, 0.05, 9.2]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.8} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Base Metal Sheet (4 separate meshes with perfect global UVs to prevent triangulation glitches) ── */}
      <group position={[0, -0.075, 0]}>
        <mesh position={[-2.5, 0, 3.0]} receiveShadow>
          <primitive object={sheetTopGeo} attach="geometry" />
          <meshStandardMaterial {...steelMat} />
        </mesh>
        <mesh position={[-2.5, 0, -2.0]} receiveShadow>
          <primitive object={sheetBotGeo} attach="geometry" />
          <meshStandardMaterial {...steelMat} />
        </mesh>
        <mesh position={[-5.05, 0, 1.0]} receiveShadow>
          <primitive object={sheetLeftGeo} attach="geometry" />
          <meshStandardMaterial {...steelMat} />
        </mesh>
        <mesh position={[0.55, 0, 1.0]} receiveShadow>
          <primitive object={sheetRightGeo} attach="geometry" />
          <meshStandardMaterial {...steelMat} />
        </mesh>
      </group>

      {/* ── Dynamic Cutout System ── */}

      {/* 2. The metallic cutout piece (Flat state) */}
      <mesh ref={cutoutRef} position={[-2.0, -0.075, 1.0]} castShadow receiveShadow>
        <primitive object={cutoutGeo} attach="geometry" />
        <meshStandardMaterial {...steelMat} />
      </mesh>

      {/* 2a. The metallic cutout piece (L-Bent state) */}
      <mesh ref={lBentCutoutRef} position={[-2.0, -0.075, 1.0]} castShadow receiveShadow>
        <primitive object={lBentCutoutGeo} attach="geometry" />
        <meshStandardMaterial {...steelMat} />
      </mesh>

      {/* 2b. The metallic cutout piece (U-Bent state) */}
      <mesh ref={uBentCutoutRef} position={[-2.0, -0.075, 1.0]} castShadow receiveShadow>
        <primitive object={uBentCutoutGeo} attach="geometry" />
        <meshStandardMaterial {...steelMat} />
      </mesh>

      {/* 3. The dark laser kerf lines (gaps) that grow as it cuts */}
      <group position={[-2.0, -0.075, 1.0]}>
        <mesh ref={cutLine1Ref} geometry={lineGeo} position={[cutLines[0].start.x, 0, cutLines[0].start.z]} rotation={[0, cutLines[0].angle, 0]}>
          <meshBasicMaterial color="#050505" polygonOffset={true} polygonOffsetFactor={-4} polygonOffsetUnits={-4} />
        </mesh>
        <mesh ref={cutLine2Ref} geometry={lineGeo} position={[cutLines[1].start.x, 0, cutLines[1].start.z]} rotation={[0, cutLines[1].angle, 0]}>
          <meshBasicMaterial color="#050505" polygonOffset={true} polygonOffsetFactor={-4} polygonOffsetUnits={-4} />
        </mesh>
        <mesh ref={cutLine3Ref} geometry={lineGeo} position={[cutLines[2].start.x, 0, cutLines[2].start.z]} rotation={[0, cutLines[2].angle, 0]}>
          <meshBasicMaterial color="#050505" polygonOffset={true} polygonOffsetFactor={-4} polygonOffsetUnits={-4} />
        </mesh>
        <mesh ref={cutLine4Ref} geometry={lineGeo} position={[cutLines[3].start.x, 0, cutLines[3].start.z]} rotation={[0, cutLines[3].angle, 0]}>
          <meshBasicMaterial color="#050505" polygonOffset={true} polygonOffsetFactor={-4} polygonOffsetUnits={-4} />
        </mesh>
      </group>


      {/* ── Animated Tool Assemblies ── */}

      {/* Laser Head Assembly (Left) - Dynamically traces the triangle cut */}
      <group ref={laserGroupRef} position={[-2.0, 1.2, 1.0]}>
        {/* Upper Tube (Tall, dark) */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 1.4, 32]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>

        {/* Collar Ring (Wider, dark) */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>

        {/* Lower Body (Below collar, dark) */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.4, 32]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>

        {/* Silver Cone Nozzle */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.05, 0.4, 32]} />
          <meshStandardMaterial {...bentSteelMat} />
        </mesh>

        {/* Hose Assembly (Smooth curved pipe from ceiling into barrel) */}
        <group>
          {/* Vertical drop */}
          <mesh position={[0.6, 6.0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 10.0, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {/* 90-degree curve */}
          <mesh position={[0.4, 1.0, 0]}>
            <torusGeometry args={[0.2, 0.08, 16, 32, Math.PI / 2]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {/* Horizontal connection into main tube */}
          <mesh position={[0.25, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
        </group>

        {/* Needle-thin Laser Beam */}
        <group ref={laserBeamRef}>
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 1.0, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.0, 16]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>

        {/* Contact Point Reference for Sparks & Lighting */}
        <group ref={contactPointRef} position={[0, -1.3, 0]}>
          <pointLight intensity={250} color="#ffaa00" distance={20} decay={2} />
          <pointLight intensity={300} color="#ffffff" distance={10} decay={2} />
        </group>
      </group>

      {/* Press Brake Assembly (Right) - Restored to previous code */}
      <group ref={bendingGroupRef} position={[1.5, 1.2, -0.5]}>
        {/* Vertical columns */}
        <RoundedBox args={[0.7, 2.5, 1.0]} position={[-0.7, 2, 0]} radius={0.04} smoothness={4} castShadow>
          <meshStandardMaterial {...machineSteelMat} />
        </RoundedBox>
        <RoundedBox args={[0.7, 2.5, 1.0]} position={[0.7, 2, 0]} radius={0.04} smoothness={4} castShadow>
          <meshStandardMaterial {...machineSteelMat} />
        </RoundedBox>

        {/* Main block */}
        <RoundedBox args={[2.6, 1.2, 1.4]} position={[0, 0.5, 0]} radius={0.04} smoothness={4} castShadow>
          <meshStandardMaterial {...machineSteelMat} />
        </RoundedBox>
        <mesh position={[-0.7, 0.5, 0.72]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial {...blackMat} />
        </mesh>
        <mesh position={[0.7, 0.5, 0.72]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial {...blackMat} />
        </mesh>

        {/* U-Bend Flat Press section */}
        <group position={[0, -0.6, 0]}>
          <RoundedBox args={[2.2, 0.8, 0.5]} position={[0, 0.2, 0]} radius={0.04} smoothness={4} castShadow>
            <meshStandardMaterial {...machineSteelMat} />
          </RoundedBox>
          {/* New Gooseneck Wedge Punch Needle */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <primitive object={punchGeo} attach="geometry" />
            <meshStandardMaterial {...bentSteelMat} />
          </mesh>
        </group>


      </group>

      {/* Background Grid */}
      <gridHelper args={[60, 60, '#475569', '#1e293b']} position={[0, -1, 0]} />

      {/* Sparks - Realistic shower matching the reference image */}
      <Sparks laserRef={laserGroupRef} isCuttingRef={isCuttingRef} count={100} />
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────
export default function FabricationProcess() {
  return (
    <section className="relative w-full h-[100dvh] min-h-[700px] bg-[#02050A] overflow-hidden border-b border-white/5">
      {/* ── UI Overlay Left ── */}
      <div className="absolute inset-y-0 left-0 z-10 pointer-events-none flex flex-col justify-center px-16 max-w-[700px]">
        {/* Top cyan bar */}
        <div className="w-16 h-[3px] bg-sky-400 mb-5 ml-1"></div>

        <h2 className="text-[4rem] font-black text-white leading-[0.95] tracking-tight mb-5 drop-shadow-xl font-sans">
          STANDARD <br />
          <span className="text-gray-200">FABRICATION</span>
        </h2>

        {/* Bottom cyan bar */}
        <div className="w-12 h-[2px] bg-sky-500 mb-6 ml-1 opacity-80"></div>

        <p className="text-[#a0aab5] text-[13px] leading-[1.8] mb-10 max-w-[420px] font-sans font-medium tracking-wide">
          Watert prenomalied diatech ane firratore foyee-nennalietes,
          derire alages actacler. Feation cam affectes. Razran an
          apieces, inclidider wites recrotinal and ourarer.
        </p>

        <button className="pointer-events-auto self-start bg-transparent border border-[#303f50] text-white font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-white/5 hover:border-sky-400 transition-colors flex items-center gap-3 group">
          READ MORE
          <span className="text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-sky-400">&gt;</span>
        </button>
      </div>

      {/* ── UI Overlay Right (HUD) ── */}
      <div className="absolute top-1/4 right-12 z-10 pointer-events-none flex flex-col items-end gap-2 font-mono opacity-80">
        <div className="flex items-center gap-3 border-b border-white/10 pb-2 mb-2 w-48 justify-end">
          <span className="text-[10px] text-sky-400 tracking-widest uppercase">Dimensions</span>
          <div className="w-2 h-2 rounded-full bg-sky-500/50"></div>
        </div>
        <div className="flex flex-col gap-1 text-[9px] text-gray-500 tracking-wider text-right w-full">
          <div className="flex justify-between border border-white/5 bg-white/5 p-1.5"><span className="text-gray-600">X_AXIS</span><span className="text-gray-300">12.04 MM</span></div>
          <div className="flex justify-between border border-white/5 bg-white/5 p-1.5"><span className="text-gray-600">Y_AXIS</span><span className="text-gray-300">4.11 MM</span></div>
          <div className="flex justify-between border border-white/5 bg-white/5 p-1.5"><span className="text-gray-600">Z_AXIS</span><span className="text-gray-300">0.05 MM</span></div>
        </div>
      </div>

      {/* ── 3D Scene ── */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          style={{ backgroundColor: '#0f172a' }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
          camera={{ position: [2, 4, 11], fov: 35 }}
          shadows>
          <color attach="background" args={['#0f172a']} />

          {/* Ambient light for subtle fill */}
          <ambientLight intensity={0.2} color="#cbd5e1" />

          {/* Main key light */}
          <directionalLight
            position={[8, 12, 4]}
            intensity={1.2}
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />

          {/* Front-left targeted light to catch bevels and bounce directly to the camera */}
          <directionalLight position={[-2, 6, 8]} intensity={2.0} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />

          {/* Top white rim light for cinematic feel (changed from blue to prevent tinting) */}
          <spotLight
            position={[0, 15, 0]}
            intensity={1.0}
            color="#ffffff"
            angle={0.8}
            penumbra={0.5}
          />

          {/* Side fill light */}
          <directionalLight position={[-6, 8, -4]} intensity={0.5} color="#cbd5e1" />

          <React.Suspense fallback={null}>
            {/* 'studio' environment provides sharp, realistic studio lighting reflections for metal */}
            {!hideEnvironment && <Environment preset="studio" intensity={1.5} />}
            <CNCMachine />
          </React.Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.1}
            minPolarAngle={Math.PI / 4}
          // autoRotate={false}
          />
        </Canvas>
      </div>
      {/* ── UI Overlay Bottom (Pagination & Crosshair) ── */}
      <div className="absolute bottom-8 left-0 right-0 z-10 pointer-events-none flex justify-center items-center">
        {/* Pagination Dots */}
        <div className="flex gap-2.5 opacity-60">
          <div className="w-2 h-2 rounded-full border border-white bg-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full border border-white bg-transparent"></div>
          <div className="w-2 h-2 rounded-full border border-white bg-transparent"></div>
        </div>
      </div>

      {/* Star Crosshair Marker (Bottom Right) */}
      <div className="absolute bottom-12 right-16 z-10 pointer-events-none opacity-40">
        <div className="w-6 h-6 border-[1px] border-white/40 transform rotate-45 flex items-center justify-center">
          <div className="w-full h-[1px] bg-white/40"></div>
          <div className="h-full w-[1px] bg-white/40 absolute"></div>
        </div>
      </div>

    </section>
  );
}
