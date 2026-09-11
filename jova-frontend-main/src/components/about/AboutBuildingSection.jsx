import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';

import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// A single block of the building with an animatable steel sheet facade
export const BlueprintBlock = ({ position, args, color = "#76c2eb", sheetRef, sheetPosition = [0, 0, 0], rotation = [0, 0, 0], faces = ["front"] }) => {
  const gap = 0.08;
  const panelThickness = 0.02;

  return (
    <group position={position}>
      {/* Wireframe Box */}
      <mesh>
        <boxGeometry args={args} />
        <meshBasicMaterial transparent opacity={0.015} color="#061018" depthWrite={false} />
        <Edges
          linewidth={1.2}
          threshold={15}
          color={new THREE.Color(color).multiplyScalar(1.2)}
        />
      </mesh>

      {/* Steel Sheet Facades (Grid of smaller panels) */}
      {sheetRef && (
        <group position={sheetPosition} rotation={rotation}>
          {faces.includes("front") && (() => {
            const cols = Math.max(1, Math.floor(args[0] / 1.5));
            const rows = Math.max(1, Math.floor(args[1] / 1.5));
            const panelW = args[0] / cols;
            const panelH = args[1] / rows;
            const z = args[2] / 2;

            return Array.from({ length: cols }).flatMap((_, c) =>
              Array.from({ length: rows }).map((_, r) => {
                const x = -args[0] / 2 + panelW / 2 + c * panelW;
                const y = -args[1] / 2 + panelH / 2 + r * panelH;

                return (
                  <mesh key={`front-${c}-${r}`} ref={sheetRef} position={[x, y, z]}>
                    <boxGeometry args={[panelW - gap, panelH - gap, panelThickness]} />
                    <meshBasicMaterial
                      color="#0c1d2e"
                      transparent
                      opacity={0}
                      depthWrite={false}
                    />
                    <Edges
                      linewidth={1.0}
                      threshold={15}
                      color={new THREE.Color(color).multiplyScalar(1.4)}
                    />
                  </mesh>
                );
              })
            );
          })()}

          {faces.includes("top") && (() => {
            const cols = Math.max(1, Math.floor(args[0] / 1.5));
            const depths = Math.max(1, Math.floor(args[2] / 1.5));
            const panelW = args[0] / cols;
            const panelD = args[2] / depths;
            const y = args[1] / 2;

            return Array.from({ length: cols }).flatMap((_, c) =>
              Array.from({ length: depths }).map((_, d) => {
                const x = -args[0] / 2 + panelW / 2 + c * panelW;
                const z = -args[2] / 2 + panelD / 2 + d * panelD;

                return (
                  <mesh key={`top-${c}-${d}`} ref={sheetRef} position={[x, y, z]}>
                    <boxGeometry args={[panelW - gap, panelThickness, panelD - gap]} />
                    <meshBasicMaterial
                      color="#0c1d2e"
                      transparent
                      opacity={0}
                      depthWrite={false}
                    />
                    <Edges
                      linewidth={1.0}
                      threshold={15}
                      color={new THREE.Color(color).multiplyScalar(1.4)}
                    />
                  </mesh>
                );
              })
            );
          })()}

          {faces.includes("side") && (() => {
            const rows = Math.max(1, Math.floor(args[1] / 1.5));
            const depths = Math.max(1, Math.floor(args[2] / 1.5));
            const panelH = args[1] / rows;
            const panelD = args[2] / depths;
            const x = args[0] / 2;

            return Array.from({ length: rows }).flatMap((_, r) =>
              Array.from({ length: depths }).map((_, d) => {
                const y = -args[1] / 2 + panelH / 2 + r * panelH;
                const z = -args[2] / 2 + panelD / 2 + d * panelD;

                return (
                  <mesh key={`side-${r}-${d}`} ref={sheetRef} position={[x, y, z]}>
                    <boxGeometry args={[panelThickness, panelH - gap, panelD - gap]} />
                    <meshBasicMaterial
                      color="#0c1d2e"
                      transparent
                      opacity={0}
                      depthWrite={false}
                    />
                    <Edges
                      linewidth={1.0}
                      threshold={15}
                      color={new THREE.Color(color).multiplyScalar(1.4)}
                    />
                  </mesh>
                );
              })
            );
          })()}
        </group>
      )}
    </group>
  );
};

export const BuildingWireframe = ({ sheetsRef, disableAnimations = false }) => {
  const groupRef = useRef();

  // Keep a fixed rotation matching the reference image's perspective, no 360 rotation
  const addToSheets = (el) => {
    if (el && !sheetsRef.current.includes(el)) {
      sheetsRef.current.push(el);
    }
  };

  useGSAP(() => {
    if (!sheetsRef.current.length || disableAnimations) return;

    const tl3d = gsap.timeline({
      repeat: -1,       // infinite loop
      yoyo: true,       // animate back and forth
      repeatDelay: 1.5, // pause when fully assembled before disassembling
      delay: 0.5        // small initial delay
    });

    sheetsRef.current.forEach((mesh, index) => {
      // Store original z
      const origZ = mesh.position.z;

      // Start further out and transparent
      mesh.position.z = origZ + 10;
      mesh.material.opacity = 0;

      mesh.traverse((child) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      });

      tl3d.to(mesh.position, {
        z: origZ,
        duration: 1.2,
        ease: "power2.out",
      }, index * 0.05);

      tl3d.to(mesh.material, {
        opacity: 0.6,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: function () {
          const currentOpacity = mesh.material.opacity;
          mesh.traverse((child) => {
            if (child.material && child !== mesh) {
              child.material.opacity = currentOpacity * 1.5;
            }
          });
        }
      }, index * 0.05);
    });
  }, { dependencies: [] });

  return (
    <group ref={groupRef} position={[0, -4.5, 0]} rotation={[0, -0.42, 0]} scale={[1.35, 1.35, 1.35]}>
      {/* Ground Floor Base */}
      <BlueprintBlock position={[0, 1.5, 0]} args={[14, 3, 8]} />

      {/* Ground Floor Left Facade (with steel panels) */}
      <BlueprintBlock position={[-3.5, 1.5, 4.05]} args={[7, 3, 0.1]} sheetRef={addToSheets} />

      {/* Ground Floor Right Recessed Facade (with steel panels) */}
      <BlueprintBlock position={[3.5, 1.5, 2.05]} args={[7, 3, 0.1]} sheetRef={addToSheets} />

      {/* Ground Floor Right Entrance Doors / Mullions */}
      <BlueprintBlock position={[1.5, 1.5, 2.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[3.5, 1.5, 2.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[5.5, 1.5, 2.08]} args={[0.08, 3, 0.08]} />

      {/* Left Steps (Two-step stair structure leading to left entrance) */}
      <BlueprintBlock position={[-3.5, -0.15, 4.45]} args={[3.5, 0.3, 0.8]} faces={["front", "top"]} sheetRef={addToSheets} />
      <BlueprintBlock position={[-3.5, -0.45, 5.05]} args={[4.2, 0.3, 0.8]} faces={["front", "top"]} sheetRef={addToSheets} />

      {/* Right Steps (Two-step stair structure leading to right entrance) */}
      <BlueprintBlock position={[3.5, -0.15, 2.45]} args={[3.5, 0.3, 0.8]} faces={["front", "top"]} sheetRef={addToSheets} />
      <BlueprintBlock position={[3.5, -0.45, 3.05]} args={[4.2, 0.3, 0.8]} faces={["front", "top"]} sheetRef={addToSheets} />

      {/* Second Floor Main Volume (Cantilevered left, flush right) */}
      <BlueprintBlock position={[0, 4.5, 1]} args={[14, 3, 8]} faces={["top"]} sheetRef={addToSheets} />

      {/* Second Floor Left Facade (Cantilevered, with steel panels) */}
      <BlueprintBlock position={[-3.5, 4.5, 5.05]} args={[7, 3, 0.1]} sheetRef={addToSheets} />

      {/* Second Floor Left Window Mullions */}
      <BlueprintBlock position={[-5.25, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[-3.5, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[-1.75, 4.5, 5.08]} args={[0.08, 3, 0.08]} />

      {/* Second Floor Right Facade (with steel panels) */}
      <BlueprintBlock position={[3.5, 4.5, 5.05]} args={[7, 3, 0.1]} sheetRef={addToSheets} />

      {/* Second Floor Right Window Mullions */}
      <BlueprintBlock position={[1.75, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[3.5, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[5.25, 4.5, 5.08]} args={[0.08, 3, 0.08]} />

      {/* Third Floor / Roof Volume */}
      <BlueprintBlock position={[2, 7.5, 0]} args={[10, 3, 6]} faces={["top"]} sheetRef={addToSheets} />

      {/* Third Floor Facade (with steel panels) */}
      <BlueprintBlock position={[2, 7.5, 3.05]} args={[10, 3, 0.1]} sheetRef={addToSheets} />

      {/* Third Floor Window Mullions */}
      <BlueprintBlock position={[-0.5, 7.5, 3.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[2, 7.5, 3.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[4.5, 7.5, 3.08]} args={[0.08, 3, 0.08]} />

      {/* Left side facade panels (with steel panels) */}
      <BlueprintBlock position={[-7.05, 1.5, 0]} args={[0.1, 3, 8]} sheetRef={addToSheets} rotation={[0, Math.PI / 2, 0]} />
      <BlueprintBlock position={[-7.05, 4.5, 1]} args={[0.1, 3, 8]} sheetRef={addToSheets} rotation={[0, Math.PI / 2, 0]} />
      <BlueprintBlock position={[-3.05, 7.5, 0]} args={[0.1, 3, 6]} sheetRef={addToSheets} rotation={[0, Math.PI / 2, 0]} />

      {/* Right side facade panels (with steel panels) */}
      <BlueprintBlock position={[7.05, 1.5, 0]} args={[0.1, 3, 8]} sheetRef={addToSheets} rotation={[0, -Math.PI / 2, 0]} />
      <BlueprintBlock position={[7.05, 4.5, 1]} args={[0.1, 3, 8]} sheetRef={addToSheets} rotation={[0, -Math.PI / 2, 0]} />
      <BlueprintBlock position={[7.05, 7.5, 0]} args={[0.1, 3, 6]} sheetRef={addToSheets} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
};

const AboutBuildingSection = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const sheetsRef = useRef([]);

  const paragraphText = "At Jova Metacraft, we combine design intelligence with advanced manufacturing technologies. From full structural models to detailed panel detailing, our precision engineering brings blueprint concepts to high-quality structural reality.";
  const words = paragraphText.split(" ");

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 1,
      }
    });

    tl.fromTo(".about-new-heading",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    tl.fromTo(".about-new-border-line",
      {
        strokeDasharray: 110,
        strokeDashoffset: 110
      },
      {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power1.inOut"
      },
      "<"
    );

    tl.fromTo(".new-word",
      { opacity: 0.2, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power1.out" },
      "-=0.5"
    );

    tl.fromTo(".about-new-icon",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.5"
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about-building" className="relative w-full bg-black text-white py-24 px-4 md:px-10 flex justify-center overflow-hidden">
      <div className="relative flex flex-col lg:flex-row w-full max-w-[1500px] border border-gray-800 rounded-[20px] overflow-hidden bg-[#0d0d0f] min-h-[600px]">

        {/* Left Content */}
        <div className="flex flex-col items-start justify-center p-6 lg:p-12 xl:p-16 z-10 w-full lg:w-[45%] flex-shrink-0">
          <span className="about-new-heading text-[#ff6b00] font-bold text-[11px] tracking-widest uppercase mb-4 block">
            ENGINEERING SHOWCASE
          </span>

          <h2 className="about-new-heading text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-8 relative z-10">
            Precision &<br />
            Architectural <span className="text-[#ff6b00]">Detailing</span>
          </h2>

          <p ref={textRef} className="text-[15px] md:text-[16px] font-light mb-12 leading-[1.8] max-w-md flex flex-wrap gap-x-1 relative z-10">
            {words.map((word, index) => (
              <span key={index} className="new-word text-white">
                {word}
              </span>
            ))}
          </p>

          <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-4 mb-10 relative z-10">
            <div className="about-new-icon flex items-center gap-2">
              <div className="text-[#ff6b00]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-17.66-7.07l2.83 2.83m11.31 11.31l2.83 2.83m0-16.97l-2.83 2.83M6.34 17.66l-2.83 2.83M12 16a4 4 0 100-8 4 4 0 000 8z" /></svg>
              </div>
              <span className="text-[10px] md:text-[11px] text-[#cccccc] font-medium leading-[1.3]">High Fidelity<br />Modeling</span>
            </div>
            <div className="about-new-icon flex items-center gap-2">
              <div className="text-[#ff6b00]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>
              </div>
              <span className="text-[10px] md:text-[11px] text-[#cccccc] font-medium leading-[1.3]">Facade<br />Technology</span>
            </div>
          </div>

          <button className="about-new-heading flex items-center gap-2 border border-[#ff6b00] text-[#ff6b00] bg-transparent hover:bg-[#ff6b00]/10 transition-colors duration-300 text-[11px] font-bold py-2.5 px-6 rounded border-opacity-50 relative z-10">
            VIEW CAPABILITIES
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Right Content - 3D House Facade Canvas */}
        <div className="relative w-full lg:w-[55%] h-[500px] lg:h-auto overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0% 50%)',
            }}
          >
            <Canvas
              className="absolute inset-0 w-full h-full"
              camera={{ position: [15, 12, 18], fov: 45 }}
              gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
            >
              <color attach="background" args={['#070b14']} />

              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 10]} intensity={2} />
              <directionalLight position={[-10, 10, -10]} intensity={1.5} />
              <directionalLight position={[0, -10, 10]} intensity={1} />

              {/* Glowing Blueprint floor grid */}
              <gridHelper args={[40, 40, '#4fcdf2', '#142334']} position={[0, -4.55, 0]} />

              <BuildingWireframe sheetsRef={sheetsRef} />



              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2 - 0.1}
              />
            </Canvas>
          </div>

          {/* Border Overlay SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline points="10,0 0,50 10,100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <polyline className="about-new-border-line" points="10,0 0,50 10,100" fill="none" stroke="#4fcdf2" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

      </div>
    </section>
  );
};

export default AboutBuildingSection;
