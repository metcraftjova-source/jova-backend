import React, { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import { PBRMaterials } from '../../utils/materials';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, Environment } from '@react-three/drei';
import * as THREE from 'three';
import facadeBg from '../../assets/facade_assembly.jpeg';

const W = 4.0;
const H = 4.8;
const rowsCount = 6;
const colsCount = 6;

const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 };

// Pre-build shapes once
const shapeUp = new THREE.Shape();
shapeUp.moveTo(-W / 2, -H / 2);
shapeUp.lineTo(W / 2, -H / 2);
shapeUp.lineTo(0, H / 2);
shapeUp.closePath();

const shapeDown = new THREE.Shape();
shapeDown.moveTo(-W / 2, H / 2);
shapeDown.lineTo(W / 2, H / 2);
shapeDown.lineTo(0, -H / 2);
shapeDown.closePath();

// Half shapes for flush building edges
const shapeUpHalfLeft = new THREE.Shape();
shapeUpHalfLeft.moveTo(0, -H / 2);
shapeUpHalfLeft.lineTo(W / 2, -H / 2);
shapeUpHalfLeft.lineTo(0, H / 2);
shapeUpHalfLeft.closePath();

const shapeDownHalfLeft = new THREE.Shape();
shapeDownHalfLeft.moveTo(0, H / 2);
shapeDownHalfLeft.lineTo(W / 2, H / 2);
shapeDownHalfLeft.lineTo(0, -H / 2);
shapeDownHalfLeft.closePath();

const shapeUpHalfRight = new THREE.Shape();
shapeUpHalfRight.moveTo(-W / 2, -H / 2);
shapeUpHalfRight.lineTo(0, -H / 2);
shapeUpHalfRight.lineTo(0, H / 2);
shapeUpHalfRight.closePath();

const shapeDownHalfRight = new THREE.Shape();
shapeDownHalfRight.moveTo(-W / 2, H / 2);
shapeDownHalfRight.lineTo(0, H / 2);
shapeDownHalfRight.lineTo(0, -H / 2);
shapeDownHalfRight.closePath();

const getShape = (type) => {
  switch (type) {
    case 'up': return shapeUp;
    case 'down': return shapeDown;
    case 'upHalfLeft': return shapeUpHalfLeft;
    case 'downHalfLeft': return shapeDownHalfLeft;
    case 'upHalfRight': return shapeUpHalfRight;
    case 'downHalfRight': return shapeDownHalfRight;
    default: return shapeUp;
  }
};

// ─── Animated Panel ───
const Panel = ({ x, y, z, rotY, shapeType, isUp, delay, isOpenable, openAngle, disableAnimations = false }) => {
  const groupRef = useRef();
  const hingeRef = useRef();

  useFrame((state) => {
    if (!groupRef.current || !hingeRef.current || disableAnimations) return;

    const t = state.clock.getElapsedTime();
    const flyDuration = 1.5;
    const totalCycle = 8;
    const currentPhase = t % totalCycle;

    let progress = 1;

    // Fly in during first half, fly out during second half
    if (currentPhase < 4) {
      // Fly IN phase
      progress = Math.max(0, Math.min(1, (currentPhase - delay) / flyDuration));
    } else {
      // Fly OUT phase
      progress = 1 - Math.max(0, Math.min(1, (currentPhase - 4 - delay) / flyDuration));
    }

    const ease = 1 - Math.pow(1 - progress, 5);

    const startOffset = 60 * (1 - ease);
    // Remove the sideways drift to prevent panels from crossing building edges during flight
    if (rotY === 0) { // Front Face
      groupRef.current.position.z = z + startOffset;
      groupRef.current.position.x = x;
    } else { // Side Face
      groupRef.current.position.x = x - startOffset;
      groupRef.current.position.z = z;
    }
    groupRef.current.position.y = y + 30 * (1 - ease); // Fly slightly higher up instead

    groupRef.current.rotation.y = rotY + (1 - ease) * Math.PI;
    groupRef.current.rotation.x = (1 - ease) * Math.PI * 0.5;
    groupRef.current.rotation.z = (1 - ease) * Math.PI * 0.2;

    const scale = 0.94 * Math.max(0.01, ease);
    hingeRef.current.scale.set(scale, scale, scale);

    if (isOpenable && progress >= 1) {
      // Just a small idle breathing animation if it's openable
      const idle = Math.sin(t * 2) * 0.05;
      hingeRef.current.rotation.x = idle;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={hingeRef} position={[0, isUp ? -H / 2 : H / 2, 0]}>
        <mesh position={[0, isUp ? H / 2 : -H / 2, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[getShape(shapeType), extrudeSettings]} />
          <meshPhysicalMaterial {...PBRMaterials.architecturalGlass} />
          <Edges linewidth={2} threshold={15} color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
};

// ─── Building Structure (frame + panels + inner glass) ───
export const BuildingStructure = ({ disableAnimations = false }) => {
  // Use a seeded approach so panels are stable across re-renders
  const panels = useMemo(() => {
    const arr = [];

    // Front Face
    for (let r = 0; r < rowsCount; r++) {
      const y = r * H;
      const isEven = r % 2 === 0;

      // Add Left Edge Half-Panel (X = 0)
      arr.push({
        id: `fhl-${r}`, x: 0, y, z: 0, rotY: 0,
        shapeType: isEven ? 'downHalfLeft' : 'upHalfLeft',
        isUp: !isEven, delay: r * 0.15 + 0.1, isOpenable: false, openAngle: 0,
      });

      for (let c = 0; c < colsCount; c++) {
        const x1 = c * W + W / 2;

        arr.push({
          id: `fu-${r}-${c}`, x: x1, y, z: 0, rotY: 0,
          shapeType: isEven ? 'up' : 'down',
          isUp: isEven, delay: r * 0.15 + c * 0.1 + 0.2, isOpenable: false, openAngle: 0,
        });

        if (c < colsCount - 1) {
          const x2 = x1 + W / 2;
          arr.push({
            id: `fd-${r}-${c}`, x: x2, y, z: 0, rotY: 0,
            shapeType: isEven ? 'down' : 'up',
            isUp: !isEven, delay: r * 0.15 + c * 0.1 + 0.3, isOpenable: false, openAngle: 0,
          });
        }
      }

      // Add Right Edge Half-Panel (X = colsCount * W)
      arr.push({
        id: `fhr-${r}`, x: colsCount * W, y, z: 0, rotY: 0,
        shapeType: isEven ? 'downHalfRight' : 'upHalfRight',
        isUp: !isEven, delay: r * 0.15 + colsCount * 0.1 + 0.4, isOpenable: false, openAngle: 0,
      });
    }

    // Side Face
    for (let r = 0; r < rowsCount; r++) {
      const y = r * H;
      const isEven = r % 2 === 0;

      // Add Front Corner Half-Panel (local right is global Z = 0)
      arr.push({
        id: `shl-${r}`, x: 0, y, z: 0, rotY: -Math.PI / 2,
        shapeType: isEven ? 'downHalfRight' : 'upHalfRight',
        isUp: !isEven, delay: r * 0.15 + 0.5, isOpenable: false, openAngle: 0,
      });

      for (let c = 0; c < colsCount; c++) {
        const z1 = -(c * W + W / 2);

        arr.push({
          id: `su-${r}-${c}`, x: 0, y, z: z1, rotY: -Math.PI / 2,
          shapeType: isEven ? 'up' : 'down',
          isUp: isEven, delay: r * 0.15 + c * 0.1 + 0.6, isOpenable: false, openAngle: 0,
        });

        if (c < colsCount - 1) {
          const z2 = z1 - W / 2;
          arr.push({
            id: `sd-${r}-${c}`, x: 0, y, z: z2, rotY: -Math.PI / 2,
            shapeType: isEven ? 'down' : 'up',
            isUp: !isEven, delay: r * 0.15 + c * 0.1 + 0.7, isOpenable: false, openAngle: 0,
          });
        }
      }

      // Add Back Corner Half-Panel (local left is global Z = -colsCount * W)
      arr.push({
        id: `shr-${r}`, x: 0, y, z: -colsCount * W, rotY: -Math.PI / 2,
        shapeType: isEven ? 'downHalfLeft' : 'upHalfLeft',
        isUp: !isEven, delay: r * 0.15 + colsCount * 0.1 + 0.8, isOpenable: false, openAngle: 0,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {panels.map((p) => (
        <Panel key={p.id} {...p} disableAnimations={disableAnimations} />
      ))}

      <group>
        {/* Corner Column */}
        <mesh position={[0, (rowsCount * H) / 2 - H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, rowsCount * H, 1.2]} />
          <meshPhysicalMaterial {...PBRMaterials.darkIndustrialSteel} />
        </mesh>

        {/* Front horizontal beams */}
        {Array.from({ length: rowsCount + 1 }).map((_, i) => (
          <mesh key={`hf-${i}`} position={[(colsCount * W) / 2, i * H - H / 2, -0.8]} castShadow>
            <boxGeometry args={[colsCount * W, 0.8, 0.6]} />
            <meshPhysicalMaterial {...PBRMaterials.darkIndustrialSteel} />
          </mesh>
        ))}

        {/* Front vertical columns */}
        {Array.from({ length: colsCount }).map((_, i) => (
          <mesh key={`vf-${i}`} position={[(i + 1) * W, (rowsCount * H) / 2 - H / 2, -0.8]} castShadow>
            <boxGeometry args={[0.6, rowsCount * H, 0.8]} />
            <meshPhysicalMaterial {...PBRMaterials.darkIndustrialSteel} />
          </mesh>
        ))}

        {/* Side horizontal beams */}
        {Array.from({ length: rowsCount + 1 }).map((_, i) => (
          <mesh key={`hs-${i}`} position={[0.8, i * H - H / 2, -(colsCount * W) / 2]} castShadow>
            <boxGeometry args={[0.6, 0.8, colsCount * W]} />
            <meshPhysicalMaterial {...PBRMaterials.darkIndustrialSteel} />
          </mesh>
        ))}

        {/* Side vertical columns */}
        {Array.from({ length: colsCount }).map((_, i) => (
          <mesh key={`vs-${i}`} position={[0.8, (rowsCount * H) / 2 - H / 2, -(i + 1) * W]} castShadow>
            <boxGeometry args={[0.8, rowsCount * H, 0.6]} />
            <meshPhysicalMaterial {...PBRMaterials.darkIndustrialSteel} />
          </mesh>
        ))}

        {/* Front mullions (structural framing behind diagrid) */}
        <mesh position={[(colsCount * W) / 2, (rowsCount * H) / 2 - H / 2, -1.55]}>
          {Array.from({ length: colsCount * 2 }).map((_, i) => (
            <mesh key={`mf-${i}`} position={[(i - colsCount + 0.5) * (W / 2), 0, 0]}>
              <boxGeometry args={[0.1, rowsCount * H, 0.1]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </mesh>

        {/* Side mullions */}
        <mesh position={[1.55, (rowsCount * H) / 2 - H / 2, -(colsCount * W) / 2]}>
          {Array.from({ length: colsCount * 2 }).map((_, i) => (
            <mesh key={`ms-${i}`} position={[0, 0, (i - colsCount + 0.5) * (W / 2)]}>
              <boxGeometry args={[0.1, rowsCount * H, 0.1]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </mesh>

        {/* Interior box with lights to make the interior rooms visible */}
        <mesh position={[(colsCount * W) / 2, (rowsCount * H) / 2 - H / 2, -(colsCount * W) / 2]}>
          <boxGeometry args={[colsCount * W, rowsCount * H, colsCount * W]} />
          <meshStandardMaterial color="#1a202c" side={THREE.BackSide} />
        </mesh>

        {/* Warm interior lighting */}
        <pointLight position={[12, 10, -12]} intensity={1.5} color="#ffedd5" />
        <pointLight position={[12, 22, -12]} intensity={1.5} color="#ffedd5" />
        <pointLight position={[12, 5, -12]} intensity={1.0} color="#e0f2fe" />

        {/* Floor plates with desks */}
        {Array.from({ length: rowsCount }).map((_, r) => (
          <group key={`floor-${r}`} position={[(colsCount * W) / 2, r * H - H / 2 + 0.1, -(colsCount * W) / 2]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[colsCount * W, colsCount * W]} />
              <meshStandardMaterial color="#2d3748" roughness={0.9} />
            </mesh>
            {/* Populate interior with minimalist desks/tables */}
            {Array.from({ length: 4 }).map((_, f) => {
              const dx = ((f * 37 + r * 13) % 20 - 10) * 0.8;
              const dz = ((f * 53 + r * 7) % 20 - 10) * 0.8;
              return (
                <group key={`desk-${f}`} position={[dx, 0, dz]}>
                  <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[2.0, 0.8, 1.0]} />
                    <meshStandardMaterial color="#4a5568" roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.6, 0.8]}>
                    <boxGeometry args={[0.6, 1.2, 0.5]} />
                    <meshStandardMaterial color="#718096" roughness={0.8} />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
};

// ─── Camera ───
const CameraRig = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const radius = 34;
    const angle = -Math.PI / 5 + Math.sin(t * 0.1) * 0.1;
    state.camera.position.x = Math.sin(angle) * radius;
    state.camera.position.z = Math.cos(angle) * radius;
    state.camera.position.y = (rowsCount * H) / 2 + 4 + Math.cos(t * 0.15) * 2;
    state.camera.lookAt(0, (rowsCount * H) / 2 + 2, 0);
  });
  return null;
};

// ─── Error Boundary ───
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050608' }}>
          <p style={{ color: '#666', fontSize: 14 }}>3D scene could not load.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main Export ───
export default function BuildingFacade() {
  return (
    <section className="relative w-full h-[100dvh] min-h-[900px] overflow-hidden border-b border-white/5 flex items-center">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${facadeBg})` }}
      />
      
      {/* UI Overlay Left */}
      <div className="absolute inset-y-0 left-0 z-10 pointer-events-none flex flex-col justify-center px-16 max-w-[700px]">
        <div className="w-16 h-[3px] bg-[#dca876] mb-5 ml-1 shadow-[0_0_10px_rgba(220,168,118,0.5)]"></div>
        <h2 className="text-[4.5rem] font-black text-white leading-[0.95] tracking-tight mb-5 drop-shadow-2xl font-sans">
          FACADE <br />
          <span className="text-[#a8abb3]">ASSEMBLY</span>
        </h2>
        <div className="w-12 h-[2px] bg-[#dca876] mb-6 ml-1 opacity-80"></div>
        <p className="text-[#a0aab5] text-[14px] leading-[1.8] mb-10 max-w-[420px] font-sans font-medium tracking-wide drop-shadow-md">
          Our advanced diagrid facade panels interlock with micron-level precision.
          Dynamic glass modules are installed seamlessly into the structural framework,
          providing both thermal efficiency and stunning architectural aesthetics.
        </p>
        <button className="pointer-events-auto self-start bg-transparent border border-[#dca876]/30 text-white font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#dca876]/10 hover:border-[#dca876] transition-all flex items-center gap-3 group backdrop-blur-sm">
          EXPLORE TECH
          <span className="text-[#dca876] group-hover:translate-x-1 transition-transform">&gt;</span>
        </button>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 w-full h-full">
        <CanvasErrorBoundary>
          <Canvas
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            camera={{ position: [0, 0, 30], fov: 42 }}
            shadows
          >
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[-50, 15, 30]}
              intensity={2.5}
              color="#ffc388"
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0001}
            />
            <directionalLight position={[30, 20, -20]} intensity={1.5} color="#77aaff" />

            <React.Suspense fallback={null}>
              <Environment preset="sunset" />
              <BuildingStructure />
              <CameraRig />
            </React.Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#020508]/80 via-transparent to-transparent"></div>
    </section>
  );
}
