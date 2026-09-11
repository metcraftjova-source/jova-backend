import React, { useRef, useState, Suspense, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';

import { ReferenceBuilding } from './AboutHero';
import { CNCMachine } from './FabricationProcess';
import { BuildingStructure } from './BuildingFacade';
import { PremiumCoatingScene } from './PremiumCoating';
import facadeBg from '../../assets/facade_assembly.jpeg';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────
// Inner Scene & Animation Orchestrator
// ─────────────────────────────────────────────────────────────────
const ExperienceScene = ({ containerRef }) => {
  const { camera } = useThree();
  const [panelsLoaded, setPanelsLoaded] = useState(false);

  // Model Refs
  const blueprintRef = useRef();
  const cncRef = useRef();
  const facadeRef = useRef();
  const coatingRef = useRef();

  // Polling to ensure meshes are populated before animating
  React.useEffect(() => {
    let rafId;
    let attempts = 0;
    const MAX_ATTEMPTS = 300;

    const poll = () => {
      attempts++;
      if (dummySheetsRef.current.length > 0) {
        setPanelsLoaded(true);
      } else if (attempts < MAX_ATTEMPTS) {
        rafId = requestAnimationFrame(poll);
      }
    };

    rafId = requestAnimationFrame(poll);

    return () => {
      cancelAnimationFrame(rafId);
      dummySheetsRef.current = []; // StrictMode fix
    };
  }, []);

  const sweepLineRef = useRef();
  const dummyWiresRef = useRef([]);

  // Standalone infinite loop animation for the Blueprint's steel panels
  useGSAP(() => {
    if (!panelsLoaded || !dummySheetsRef.current.length) return;

    const panels = dummySheetsRef.current;
    const wires = dummyWiresRef.current;

    console.log("Re-triggering GSAP animation for", panels.length, "panels");

    gsap.killTweensOf(panels);
    panels.forEach(mesh => {
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.material);
    });


    const grayColor = new THREE.Color('#4a5568');
    const neonBlue = new THREE.Color('#3BA7FF');

    // Initialize wires to gray
    wires.forEach(w => {
      if (w.material && w.material.color) w.material.color.copy(grayColor);
    });

    // Initialize positions and opacity
    panels.forEach((mesh) => {
      if (!mesh.userData.origPos) mesh.userData.origPos = mesh.position.clone();
      mesh.position.copy(mesh.userData.origPos);

      mesh.material.opacity = 0;
      mesh.frustumCulled = false;
      mesh.renderOrder = 999;
    });

    // Sort panels from left to right in world space for the sweep effect
    panels.forEach(p => p.updateMatrixWorld());
    const sortedPanels = [...panels].sort((a, b) => {
      const vA = new THREE.Vector3();
      const vB = new THREE.Vector3();
      a.getWorldPosition(vA);
      b.getWorldPosition(vB);
      return vA.x - vB.x;
    });

    const COLOR_SWEEP_DUR = 1.5;
    const SWEEP_DUR = 2.8;
    const HOLD = 1.0; // Reduced from 3.8 to make animation much faster
    const tl3d = gsap.timeline({ repeat: -1, delay: 0.5 });

    // Safely filter wires to avoid crashes
    const validWires = wires.filter(w => w && typeof w.updateMatrixWorld === 'function' && w.material && w.material.color);

    // Sort wires from left to right in world space
    validWires.forEach(w => w.updateMatrixWorld());
    const sortedWires = [...validWires].sort((a, b) => {
      const vA = new THREE.Vector3();
      const vB = new THREE.Vector3();
      a.getWorldPosition(vA);
      b.getWorldPosition(vB);
      return vA.x - vB.x;
    });

    // 0. Sweep wires from gray to neon HDR blue
    if (sortedWires.length > 0) {
      sortedWires.forEach((w, i) => {
        const progress = i / sortedWires.length;
        const startTime = progress * COLOR_SWEEP_DUR;

        tl3d.to(w.material.color, {
          r: 0.23 * 2.5, // 0.575
          g: 0.65 * 2.5, // 1.625
          b: 1.0 * 2.5,  // 2.5
          duration: 0.4,
          ease: 'power2.inOut'
        }, startTime);
      });
    }

    // 2. Snap panels to opacity 1 as the line passes
    const sweepStartTime = COLOR_SWEEP_DUR + 0.3; // Start sweep shortly
    sortedPanels.forEach((mesh, i) => {
      const progress = i / sortedPanels.length;
      const startTime = sweepStartTime + (progress * SWEEP_DUR);

      tl3d.fromTo(mesh.material,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.15,
          ease: 'none',
          onUpdate: function () {
            const currentOpacity = mesh.material.opacity;
            mesh.traverse((child) => {
              if (child.material && child !== mesh) {
                child.material.opacity = currentOpacity;
              }
            });
          }
        },
        startTime
      );
    });

    // 4. Hold solid building
    tl3d.to({}, { duration: HOLD });

    // 5. Sweep out!
    const sweepBackStart = tl3d.duration();

    // Fade panels back to wireframe (opacity 0) right behind the line
    [...sortedPanels].reverse().forEach((mesh, i) => {
      const progress = i / sortedPanels.length;
      const startTime = sweepBackStart + 0.3 + (progress * SWEEP_DUR);
      tl3d.to(mesh.material, {
        opacity: 0,
        duration: 0.15,
        ease: 'none',
        onUpdate: function () {
          const currentOpacity = mesh.material.opacity;
          mesh.traverse((child) => {
            if (child.material && child !== mesh) {
              child.material.opacity = currentOpacity;
            }
          });
        }
      }, startTime);
    });

    // 6. Animate wires back to gray sequentially
    const sweepBackEnd = sweepBackStart + 0.3 + SWEEP_DUR;
    if (sortedWires.length > 0) {
      [...sortedWires].reverse().forEach((w, i) => {
        const progress = i / sortedWires.length;
        const startTime = sweepBackEnd + (progress * COLOR_SWEEP_DUR);

        tl3d.to(w.material.color, {
          r: grayColor.r,
          g: grayColor.g,
          b: grayColor.b,
          duration: 0.4,
          ease: 'power2.inOut'
        }, startTime);
      });
    }

    // Hold wireframe
    tl3d.to({}, { duration: 0.5 }); // Reduced from 1.8 to make restart faster

  }, { dependencies: [panelsLoaded] });

  // Light Refs
  const ambientRef = useRef();
  const dirLight1Ref = useRef();
  const dirLight2Ref = useRef();
  const facadeLight1Ref = useRef();
  const facadeLight2Ref = useRef();

  // Dummy lookAt target for GSAP to animate
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const dummySheetsRef = useRef([]);
  const dummyGlowRef = useRef(0);
  const dummyBuildingGroupRef = useRef();

  useFrame(() => {
    // Smooth lookAt tracking
    camera.lookAt(lookAtTarget.current);
  });

  useGSAP(() => {
    if (!containerRef.current) return;
    if (!blueprintRef.current || !cncRef.current || !facadeRef.current || !coatingRef.current) return;

    // The master timeline synced to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=4000', // 4000px of scrolling for the whole experience
        scrub: true,
        pin: true,
        anticipatePin: 1,
      }
    });

    // --- INITIAL STATE ---
    // Moved camera to z: 19 to fit the whole building on screen, y: 4 to see the roof slightly
    gsap.set(camera.position, { x: 0, y: 4, z: 19 });
    gsap.set(lookAtTarget.current, { x: 0, y: 0, z: 0 });
    gsap.set(ambientRef.current, { intensity: 0.8 });

    // Stage Positions
    // Shifted Blueprint stage to the right (x: 3.5) to give the text room and align with reference
    const posBlueprint = { x: 3.5, y: 0, z: 0 };
    const posCNC = { x: 50, y: 0, z: 0 };
    const posFacade = { x: 100, y: 0, z: 0 };
    const posCoating = { x: 150, y: 0, z: 0 };

    // Place models far apart
    gsap.set(blueprintRef.current.position, posBlueprint);
    gsap.set(cncRef.current.position, { ...posCNC, x: posCNC.x + 20 });
    gsap.set(facadeRef.current.position, { ...posFacade, x: posFacade.x - 20 });
    gsap.set(coatingRef.current.position, { ...posCoating, y: posCoating.y - 10 });

    // Set initial text states
    gsap.set('.sect-1 .text-anim', { opacity: 1, y: 0 });
    gsap.set('.sect-2 .text-anim', { opacity: 0, y: 40 });
    gsap.set('.sect-3 .text-anim', { opacity: 0, y: 40 });
    gsap.set('.sect-4 .text-anim, .sect-4-palette', { opacity: 0, y: 40 });
    gsap.set('.bg-facade', { opacity: 0 });

    // Hide Coating initially by moving it far below
    gsap.set(coatingRef.current.position, { y: -1000 });

    // ─────────────────────────────────────────────────────────────
    // TRANSITION 1: Blueprint -> CNC Machine
    // ─────────────────────────────────────────────────────────────
    tl.to(blueprintRef.current.position, { x: posBlueprint.x - 15, ease: "power2.inOut", duration: 1.5 }, 0.2);
    tl.to(blueprintRef.current.rotation, { y: 0.5, ease: "power2.inOut", duration: 1.5 }, 0.2);

    tl.to(camera.position, { x: posCNC.x + 1, y: 4, z: posCNC.z + 9, ease: "power2.inOut", duration: 2 }, 0);
    tl.to(lookAtTarget.current, { x: posCNC.x - 4, y: posCNC.y + 0.5, z: posCNC.z, ease: "power2.inOut", duration: 2 }, 0);

    tl.to(cncRef.current.position, { x: posCNC.x, ease: "power2.out", duration: 1.5 }, 0.5);

    tl.to('.sect-1 .text-anim', { opacity: 0, y: -40, stagger: 0.1, duration: 0.5 }, 0.2);
    tl.to('.sect-2 .text-anim', { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 1.2);
    tl.to(dirLight1Ref.current.position, { x: posCNC.x + 10, y: 15, z: posCNC.z + 10, duration: 1 }, 0.5);
    tl.to(dirLight2Ref.current.position, { x: posCNC.x - 10, y: 10, z: posCNC.z - 10, duration: 1 }, 0.5);
    tl.to(ambientRef.current, { intensity: 0.3, duration: 1 }, 0.5);
    tl.to(dirLight1Ref.current.color, { r: 1, g: 1, b: 1, duration: 1 }, 0.5);

    // Hide Blueprint stage by dropping it out of view (using .to for reliable scrubbing)
    tl.to(blueprintRef.current.position, { y: -1000, duration: 0.1 });

    tl.to({}, { duration: 0.5 }); // Hold

    // ─────────────────────────────────────────────────────────────
    // TRANSITION 2: CNC Machine -> Facade Assembly
    // ─────────────────────────────────────────────────────────────
    tl.to(cncRef.current.position, { x: posCNC.x + 15, ease: "power2.inOut", duration: 1.5 }, "+=0");

    tl.to(camera.position, { x: posFacade.x - 24.86, y: 20.4, z: posFacade.z + 23.96, ease: "power2.inOut", duration: 2 }, "<");
    tl.to(lookAtTarget.current, { x: posFacade.x - 4.86, y: posFacade.y + 18.4, z: posFacade.z - 3.54, ease: "power2.inOut", duration: 2 }, "<");

    tl.to(facadeRef.current.position, { x: posFacade.x, ease: "power2.out", duration: 1.5 }, "-=1.5");

    tl.to('.sect-2 .text-anim', { opacity: 0, y: -40, stagger: 0.1, duration: 0.5 }, "-=1.8");
    tl.to('.sect-3 .text-anim', { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "-=0.8");

    tl.to(dirLight1Ref.current, { intensity: 0, duration: 1 }, "-=1");
    tl.to(dirLight2Ref.current, { intensity: 0, duration: 1 }, "-=1");

    tl.to(facadeLight1Ref.current, { intensity: 2.5, duration: 1 }, "-=1");
    tl.to(facadeLight2Ref.current, { intensity: 1.5, duration: 1 }, "-=1");

    tl.to(ambientRef.current, { intensity: 0.2, duration: 1 }, "-=1");
    tl.to('.bg-facade', { opacity: 1, duration: 1 }, "-=1");

    // Hide CNC stage by dropping it out of view
    tl.to(cncRef.current.position, { y: -1000, duration: 0.1 });

    tl.to({}, { duration: 0.5 }); // Hold

    // ─────────────────────────────────────────────────────────────
    // TRANSITION 3: Facade Assembly -> Premium Coating
    // ─────────────────────────────────────────────────────────────
    // Let Coating rise from the depths to prevent background grid pop-in
    tl.to(facadeRef.current.position, { x: posFacade.x - 20, ease: "power2.inOut", duration: 1.5 }, "+=0");

    tl.to(camera.position, { x: posCoating.x - 8, y: 8, z: posCoating.z + 14, ease: "power2.inOut", duration: 2 }, "<");
    tl.to(lookAtTarget.current, { x: posCoating.x, y: posCoating.y, z: posCoating.z, ease: "power2.inOut", duration: 2 }, "<");

    tl.to(coatingRef.current.position, { y: posCoating.y, ease: "power2.out", duration: 1.5 }, "-=1.5");

    tl.to('.sect-3 .text-anim', { opacity: 0, y: -40, stagger: 0.1, duration: 0.5 }, "-=1.8");
    tl.to('.sect-4 .text-anim, .sect-4-palette', { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "-=0.8");

    tl.to(facadeLight1Ref.current, { intensity: 0, duration: 1 }, "-=1");
    tl.to(facadeLight2Ref.current, { intensity: 0, duration: 1 }, "-=1");

    tl.to(dirLight1Ref.current.position, { x: posCoating.x + 10, y: 15, z: posCoating.z + 10, duration: 1 }, "-=1");
    tl.to(dirLight1Ref.current.color, { r: 0.37, g: 0.64, b: 0.98, duration: 1 }, "-=1");
    tl.to(dirLight1Ref.current, { intensity: 1, duration: 1 }, "-=1");

    tl.to(dirLight2Ref.current.position, { x: posCoating.x - 10, y: 10, z: posCoating.z - 10, duration: 1 }, "-=1");
    tl.to(dirLight2Ref.current, { intensity: 0.5, duration: 1 }, "-=1");
    tl.to(dirLight2Ref.current.color, { r: 0.72, g: 0.83, b: 0.93, duration: 1 }, "-=1"); // #b8d4ee

    tl.to(ambientRef.current, { intensity: 0.4, duration: 1 }, "-=1");
    tl.to('.bg-facade', { opacity: 0, duration: 1 }, "-=1");

  }, { scope: containerRef, dependencies: [] });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.8} />
      <directionalLight ref={dirLight1Ref} position={[10, 15, 10]} intensity={1} color="#ffffff" castShadow />
      <directionalLight ref={dirLight2Ref} position={[-10, 10, -10]} intensity={0.5} color="#b8d4ee" />

      <Environment preset="sunset" />

      {/* STAGE 1: Blueprint */}
      <group ref={blueprintRef}>
        <gridHelper args={[40, 40, '#2e3d4f', '#0c1826']} position={[0, -4.82, 0]} />
        <ReferenceBuilding
          sheetsRef={dummySheetsRef}
          wiresRef={dummyWiresRef}
          glowRef={dummyGlowRef}
          buildingGroupRef={dummyBuildingGroupRef}
          isRotating={false}
          disableAnimations={true}
        />
      </group>

      {/* STAGE 2: CNC Machine */}
      <group ref={cncRef} position={[70, 0, 0]}>
        <CNCMachine disableAnimations={false} hideEnvironment={true} />
      </group>

      {/* STAGE 3: Facade */}
      <group ref={facadeRef} position={[80, 0, 0]}>
        <directionalLight ref={facadeLight1Ref} position={[-50, 15, 30]} intensity={0} color="#ffc388" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
        <directionalLight ref={facadeLight2Ref} position={[30, 20, -20]} intensity={0} color="#77aaff" />
        <BuildingStructure disableAnimations={false} />
      </group>

      {/* STAGE 4: Coating */}
      <group ref={coatingRef} position={[150, -1000, 0]}>
        <PremiumCoatingScene disableAnimations={false} hideEnvironment={true} />
      </group>

      <Preload all />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────
// Main Experience Manager
// ─────────────────────────────────────────────────────────────────
export default function ExperienceManager() {
  const containerRef = useRef();

  return (
    <section ref={containerRef} className="relative w-full h-dvh bg-black overflow-hidden font-sans">

      {/* Background Image Container (Animated in GSAP) */}
      <div
        className="bg-facade opacity-0 absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${facadeBg})` }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* UI HTML OVERLAYS */}
      {/* ───────────────────────────────────────────────────────────── */}

      {/* SECTION 1: Blueprint */}
      <div className="sect-1 absolute inset-y-0 left-0 z-10 pointer-events-none flex flex-col justify-center pl-12 md:pl-24 max-w-[900px]">
        <div className="relative">
          <h1 className="text-anim text-5xl sm:text-7xl md:text-[5.5rem] font-black text-[#e2e8f0] leading-[1.05] tracking-tight uppercase mb-8 drop-shadow-2xl font-sans">
            PRECISION <br />
            SHEET METAL & <br />
            <span className="text-[#3BA7FF] drop-shadow-[0_0_15px_rgba(59,167,255,0.4)]">
              FACADES.
            </span>
          </h1>
        </div>

        <div className="relative">
          <p className="text-anim text-[#94a3b8] text-sm md:text-lg mb-8 max-w-[500px] leading-relaxed font-light font-sans tracking-wide">
            Witness blueprint wireframe vectors dynamically integrate into rigid,
            structural sheet metal facades.
          </p>
        </div>
      </div>

      {/* Cinematic HUD Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Side HUD line */}
        <div className="absolute left-6 top-[20%] bottom-[20%] w-[1px] bg-white/10 flex flex-col items-center justify-between py-10">
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>

        {/* Top Left Tech Text */}
        <div className="absolute top-8 left-12 text-[10px] font-mono text-white/30 tracking-widest">
          SYS.COORD: 45.918 | RND: 19.3
          <br />STATUS: ONLINE
        </div>

        {/* Bottom Right Crosshair */}
        <div className="absolute bottom-12 right-12 text-white/20">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* SECTION 2: Fabrication */}
      <div className="sect-2 absolute inset-y-0 left-0 z-10 pointer-events-none flex flex-col justify-center px-8 md:px-16 max-w-[700px]">
        <div className="text-anim opacity-0 translate-y-10 w-16 h-[3px] bg-sky-400 mb-5 ml-1"></div>
        <h2 className="text-anim opacity-0 translate-y-10 text-[4rem] font-black text-white leading-[0.95] tracking-tight mb-5 drop-shadow-xl font-sans">
          STANDARD <br />
          <span className="text-gray-200">FABRICATION</span>
        </h2>
        <div className="text-anim opacity-0 translate-y-10 w-12 h-[2px] bg-sky-500 mb-6 ml-1 opacity-80"></div>
        <p className="text-anim opacity-0 translate-y-10 text-[#a0aab5] text-[13px] leading-[1.8] mb-10 max-w-[420px] font-sans font-medium tracking-wide">
          Our CNC machining and bending processes ensure exact specifications for every panel.
        </p>
      </div>

      {/* SECTION 3: Facade */}
      <div className="sect-3 absolute inset-y-0 left-0 z-10 pointer-events-none flex flex-col justify-center px-8 md:px-16 max-w-[700px]">
        <div className="text-anim opacity-0 translate-y-10 w-16 h-[3px] bg-[#dca876] mb-5 ml-1 shadow-[0_0_10px_rgba(220,168,118,0.5)]"></div>
        <h2 className="text-anim opacity-0 translate-y-10 text-[4.5rem] font-black text-white leading-[0.95] tracking-tight mb-5 drop-shadow-2xl font-sans">
          FACADE <br />
          <span className="text-[#a8abb3]">ASSEMBLY</span>
        </h2>
        <div className="text-anim opacity-0 translate-y-10 w-12 h-[2px] bg-[#dca876] mb-6 ml-1 opacity-80"></div>
        <p className="text-anim opacity-0 translate-y-10 text-[#a0aab5] text-[14px] leading-[1.8] mb-10 max-w-[420px] font-sans font-medium tracking-wide drop-shadow-md">
          Our advanced diagrid facade panels interlock with micron-level precision.
          Dynamic glass modules are installed seamlessly into the structural framework,
          providing both thermal efficiency and stunning architectural aesthetics.
        </p>
        <button className="text-anim opacity-0 translate-y-10 pointer-events-auto self-start bg-transparent border border-[#dca876]/30 text-white font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#dca876]/10 hover:border-[#dca876] transition-all flex items-center gap-3 group backdrop-blur-sm">
          EXPLORE TECH
          <span className="text-[#dca876] group-hover:translate-x-1 transition-transform">&gt;</span>
        </button>
      </div>

      {/* SECTION 4: Coating */}
      <div className="sect-4 absolute inset-y-0 left-0 z-10 pointer-events-none flex flex-col justify-center px-8 md:px-16 max-w-[700px]">
        <div className="text-anim opacity-0 translate-y-10 w-16 h-[2px] bg-cyan-400 mb-4 flex items-center">
          <div className="text-anim opacity-0 translate-y-10 w-2 h-2 bg-cyan-400 -ml-1"></div>
        </div>
        <h2 className="text-anim opacity-0 translate-y-10 text-4xl md:text-5xl font-bold text-white tracking-wider uppercase leading-tight drop-shadow-lg">
          Premium Coating<br />& Finishing
        </h2>
        <p className="text-anim opacity-0 translate-y-10 text-[#a0aab5] text-[14px] leading-[1.8] mt-6 max-w-[420px] font-sans font-medium">
          Robotic precision spraying ensures an even, durable, and weather-resistant finish.
        </p>
      </div>

      {/* SECTION 4: Right Side Color Palette Wrapper */}
      <div className="absolute inset-y-0 right-12 z-20 pointer-events-none flex flex-col justify-center">
        <div className="sect-4-palette opacity-0 translate-y-10 pointer-events-auto bg-[#0f1522]/90 backdrop-blur-md border border-[#2a3649] rounded-xl p-5 w-[280px] shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-white/70 font-semibold tracking-wide">System Color</span>
            <button className="text-white/40 hover:text-white transition-colors">✕</button>
          </div>

          {/* Top Swatches */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 h-6 bg-[#1e293b] rounded-sm cursor-pointer hover:ring-1 ring-white/50"></div>
            <div className="flex-1 h-6 bg-[#334155] rounded-sm cursor-pointer hover:ring-1 ring-white/50"></div>
            <div id="palette-blue-swatch" className="flex-1 h-6 bg-[#0284c7] rounded-sm cursor-pointer hover:ring-1 ring-white/50 ring-offset-1 ring-offset-[#0f1522] transition-all duration-200"></div>
            <div className="flex-1 h-6 bg-[#94a3b8] rounded-sm cursor-pointer hover:ring-1 ring-white/50"></div>
          </div>

          {/* Color Wheel */}
          <div id="palette-wheel-container" className="relative w-48 h-48 mx-auto mb-6">
            {/* Conic Gradient Ring */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,red,yellow,lime,aqua,blue,fuchsia,red)] p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {/* Inner dark circle */}
              <div className="w-full h-full bg-[#111827] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center relative">
                {/* Inner gradient ball */}
                <div id="palette-inner-ball" className="w-20 h-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,#38bdf8,#0369a1)] shadow-lg transition-all duration-300"></div>
                {/* White small selection dot inside */}
                <div className="absolute top-[30%] right-[30%] w-2 h-2 border-[1.5px] border-white rounded-full"></div>
              </div>
            </div>
            {/* Selection Ring on the wheel */}
            <div id="palette-wheel-ring" className="absolute w-4 h-4 border-2 border-white rounded-full shadow-sm shadow-black/50 pointer-events-none" style={{ top: '50%', left: '50%', marginTop: '-8px', marginLeft: '-8px', transform: 'translate(80px, 0px)' }}></div>
          </div>

          {/* Sliders/Gradients */}
          <div className="space-y-3 mb-6">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-white/10 rounded-sm"></div>
              <div className="w-6 h-6 bg-black rounded-sm border border-white/10"></div>
              <div id="palette-slider-container" className="flex-1 h-4 rounded-sm bg-gradient-to-r from-black via-[#0284c7] to-[#e0f2fe] relative">
                <div id="palette-slider-thumb" className="absolute left-2/3 top-1/2 -translate-y-1/2 w-3 h-5 bg-transparent border-[1.5px] border-white rounded-sm transition-none"></div>
              </div>
            </div>
          </div>

          {/* Grayscale / Swatches Grid */}
          <div className="grid grid-cols-8 gap-1 mb-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="h-4 rounded-[2px]" style={{ backgroundColor: `hsl(0, 0%, ${10 + i * 5}%)` }}></div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-white/40 text-xs mt-2">
            <div className="flex gap-1">
              <span className="w-3 h-3 block border border-white/30 rounded-sm"></span>
              <span className="w-3 h-3 block border border-white/30 rounded-sm"></span>
            </div>
            <span className="font-mono tracking-widest text-[10px] uppercase">Base Wood</span>
            <span>✎</span>
          </div>

          {/* Fake Cursor for Animation */}
          <div id="palette-cursor" className="absolute z-50 w-5 h-5 pointer-events-none opacity-0" style={{ top: '0px', left: '0px' }}>
            <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5" className="w-full h-full drop-shadow-md">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.8c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" />
            </svg>
          </div>
        </div>
      </div>


      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3D CANVAS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          gl={{ localClippingEnabled: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          shadows
          camera={{ position: [0, 4, 19], fov: 45 }}
        >
          <Suspense fallback={null}>
            <ExperienceScene containerRef={containerRef} />
            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay gradient for aesthetics */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#020508]/80 via-transparent to-transparent z-0"></div>
    </section>
  );
}
