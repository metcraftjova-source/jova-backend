import React, { useRef, useMemo, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, Environment } from '@react-three/drei';

import * as THREE from 'three';
import aboutVideo from '../../assets/WinChamp_CNC_Laser_Cutting_Machine_High-Speed_Precision_Fiber_Laser_by_Winarc.mp4';

gsap.registerPlugin(ScrollTrigger);

// A single block of the building with an animatable steel sheet facade
const BlueprintBlock = ({ position, args, color = "#76c2eb", sheetRef, sheetPosition = [0, 0, 0], rotation = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* Wireframe Box */}
      <mesh>
        <boxGeometry args={args} />
        <meshBasicMaterial transparent opacity={0.02} color="#061018" depthWrite={false} />
        <Edges
          linewidth={1.5}
          threshold={15}
          color={new THREE.Color(color).multiplyScalar(1.2)}
        />
      </mesh>

      {/* Steel Sheet Facades (Grid of larger panels) */}
      {sheetRef && (
        <group position={sheetPosition} rotation={rotation}>
          {Array.from({ length: Math.max(1, Math.floor(args[0] / 2.2)) }).map((_, c) => {
            const cols = Math.max(1, Math.floor(args[0] / 2.2));
            const rows = Math.max(1, Math.floor(args[1] / 3));
            const panelW = args[0] / cols;
            const panelH = args[1] / rows;

            return Array.from({ length: rows }).map((_, r) => {
              const x = -args[0] / 2 + panelW / 2 + c * panelW;
              const y = -args[1] / 2 + panelH / 2 + r * panelH;
              const gap = 0.12; // gap to form the grid

              return (
                <mesh key={`${c}-${r}`} ref={sheetRef} position={[x, y, 0]}>
                  <boxGeometry args={[panelW - gap, panelH - gap, 0.05]} />
                  <meshStandardMaterial
                    color="#8a95a5"
                    metalness={0.7}
                    roughness={0.3}
                    transparent
                    opacity={0}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              );
            });
          })}
        </group>
      )}
    </group>
  );
};

const BuildingWireframe = ({ sheetsRef }) => {
  const groupRef = useRef();

  // Keep a fixed rotation matching the reference image's perspective, no 360 rotation
  const addToSheets = (el) => {
    if (el && !sheetsRef.current.includes(el)) {
      sheetsRef.current.push(el);
    }
  };

  useGSAP(() => {
    if (!sheetsRef.current.length) return;

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

      tl3d.to(mesh.position, {
        z: origZ,
        duration: 1,
        ease: "power2.out",
      }, index * 0.1);

      tl3d.to(mesh.material, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }, index * 0.1);
    });
  }, { dependencies: [] });

  return (
    <group ref={groupRef} position={[0, -4.5, 0]} rotation={[0, -0.42, 0]} scale={[1.35, 1.35, 1.35]}>
      {/* Ground Floor Base */}
      <BlueprintBlock position={[0, 1.5, 0]} args={[14, 3, 8]} />

      {/* Ground Floor Left Facade (with steel panels) */}
      <BlueprintBlock position={[-3.5, 1.5, 4.05]} args={[7, 3, 0.1]} sheetRef={addToSheets} />

      {/* Ground Floor Right Recessed Facade (pure wireframe, no sheets) */}
      <BlueprintBlock position={[3.5, 1.5, 2.05]} args={[7, 3, 0.1]} />

      {/* Ground Floor Right Entrance Doors / Mullions */}
      <BlueprintBlock position={[1.5, 1.5, 2.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[3.5, 1.5, 2.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[5.5, 1.5, 2.08]} args={[0.08, 3, 0.08]} />

      {/* Left Steps (Two-step stair structure leading to left entrance) */}
      <BlueprintBlock position={[-3.5, -0.15, 4.45]} args={[3.5, 0.3, 0.8]} />
      <BlueprintBlock position={[-3.5, -0.45, 5.05]} args={[4.2, 0.3, 0.8]} />

      {/* Right Steps (Two-step stair structure leading to right entrance) */}
      <BlueprintBlock position={[3.5, -0.15, 2.45]} args={[3.5, 0.3, 0.8]} />
      <BlueprintBlock position={[3.5, -0.45, 3.05]} args={[4.2, 0.3, 0.8]} />

      {/* Second Floor Main Volume (Cantilevered left, flush right) */}
      <BlueprintBlock position={[0, 4.5, 1]} args={[14, 3, 8]} />

      {/* Second Floor Left Facade (Cantilevered, with steel panels) */}
      <BlueprintBlock position={[-3.5, 4.5, 5.05]} args={[7, 3, 0.1]} sheetRef={addToSheets} />

      {/* Second Floor Left Window Mullions */}
      <BlueprintBlock position={[-5.25, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[-3.5, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[-1.75, 4.5, 5.08]} args={[0.08, 3, 0.08]} />

      {/* Second Floor Right Facade (pure wireframe, no sheets) */}
      <BlueprintBlock position={[3.5, 4.5, 5.05]} args={[7, 3, 0.1]} />

      {/* Second Floor Right Window Mullions */}
      <BlueprintBlock position={[1.75, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[3.5, 4.5, 5.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[5.25, 4.5, 5.08]} args={[0.08, 3, 0.08]} />

      {/* Third Floor / Roof Volume */}
      <BlueprintBlock position={[2, 7.5, 0]} args={[10, 3, 6]} />

      {/* Third Floor Facade (pure wireframe, no sheets) */}
      <BlueprintBlock position={[2, 7.5, 3.05]} args={[10, 3, 0.1]} />

      {/* Third Floor Window Mullions */}
      <BlueprintBlock position={[-0.5, 7.5, 3.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[2, 7.5, 3.08]} args={[0.08, 3, 0.08]} />
      <BlueprintBlock position={[4.5, 7.5, 3.08]} args={[0.08, 3, 0.08]} />

      {/* Left side facade panels (with steel panels) */}
      <BlueprintBlock position={[-7.05, 1.5, 0]} args={[0.1, 3, 8]} sheetRef={addToSheets} rotation={[0, Math.PI / 2, 0]} />
      <BlueprintBlock position={[-7.05, 4.5, 1]} args={[0.1, 3, 8]} sheetRef={addToSheets} rotation={[0, Math.PI / 2, 0]} />

      {/* Right side facade panels (pure wireframe, no sheets) */}
      <BlueprintBlock position={[7.05, 1.5, 0]} args={[0.1, 3, 8]} rotation={[0, -Math.PI / 2, 0]} />
      <BlueprintBlock position={[7.05, 4.5, 1]} args={[0.1, 3, 8]} rotation={[0, -Math.PI / 2, 0]} />
      <BlueprintBlock position={[7.05, 7.5, 0]} args={[0.1, 3, 6]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
};

const AboutSection = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const sheetsRef = useRef([]);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => {
          const next = !prev;
          if (videoRef.current) {
            next ? videoRef.current.play() : videoRef.current.pause();
          }
          return next;
        });
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(prev => {
          const next = !prev;
          if (videoRef.current) {
            videoRef.current.muted = next;
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const paragraphText = "Jova Metacraft is a trusted engineering and manufacturing company specializing in precision sheet metal fabrication, architectural façade systems, CNC machining, and advanced metal finishing. We deliver customized, high-performance solutions that combine innovation, quality craftsmanship, and cutting-edge manufacturing to support commercial, industrial, and infrastructure projects.";
  const words = paragraphText.split(" ");

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 1, // Smooth scrub
      }
    });

    // Animate heading
    tl.fromTo(".about-heading",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Animate the blue cut-line border drawing itself dynamically over the gray line
    tl.fromTo(".border-line",
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

    // Animate words in the paragraph sequentially based on scroll
    tl.fromTo(".word",
      { opacity: 0.2, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power1.out" },
      "-=0.5"
    );

    // Animate icons
    tl.fromTo(".about-icon",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.5"
    );

  }, { scope: containerRef });

  return (
    <>
      {/* Cinematic Blur Overlay (Active when video is playing) */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[60] transition-opacity duration-700 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
      />
      <section ref={containerRef} id="about" className={`relative w-full bg-black text-white py-24 px-4 md:px-10 flex justify-center overflow-hidden transition-all duration-700 ${isPlaying ? 'z-[65]' : 'z-0'}`}>
        <div className="relative flex flex-col lg:flex-row w-full max-w-[1500px] border border-gray-800 rounded-[20px] overflow-hidden bg-[#0d0d0f] min-h-[600px]">

          {/* Left Content */}
          <div className="flex flex-col items-start justify-center p-6 lg:p-12 xl:p-16 z-10 w-full lg:w-[45%] flex-shrink-0">
            <span className="about-heading text-[#ff6b00] font-bold text-[11px] tracking-widest uppercase mb-4 block">
              ABOUT JOVA METACRAFT
            </span>

            <h2 className="about-heading text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-8 relative z-10">
              Engineered Metal Solutions <br />
              & <span className="text-[#ff6b00]">Architectural Façade Systems</span>
            </h2>

            <p ref={textRef} className="text-[15px] md:text-[16px] font-light mb-12 leading-[1.8] max-w-md flex flex-wrap gap-x-1 relative z-10">
              {words.map((word, index) => (
                <span key={index} className="word text-white">
                  {word}
                </span>
              ))}
            </p>

            {/* Features / Icons */}
            <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-4 mb-10 relative z-10">
              <div className="about-icon flex items-center gap-2">
                <div className="text-[#ff6b00]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-17.66-7.07l2.83 2.83m11.31 11.31l2.83 2.83m0-16.97l-2.83 2.83M6.34 17.66l-2.83 2.83M12 16a4 4 0 100-8 4 4 0 000 8z" /></svg>
                </div>
                <span className="text-[10px] md:text-[11px] text-[#cccccc] font-medium leading-[1.3]">Precision<br />Engineering</span>
              </div>
              <div className="about-icon flex items-center gap-2">
                <div className="text-[#ff6b00]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>
                </div>
                <span className="text-[10px] md:text-[11px] text-[#cccccc] font-medium leading-[1.3]">Advanced<br />Technology</span>
              </div>
            </div>

            <button className="about-heading flex items-center gap-2 border border-[#ff6b00] text-[#ff6b00] bg-transparent hover:bg-[#ff6b00]/10 transition-colors duration-300 text-[11px] font-bold py-2.5 px-6 rounded border-opacity-50 relative z-10">
              DISCOVER MORE
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className={`relative w-full lg:w-[55%] h-[350px] sm:h-[400px] lg:h-[600px] overflow-hidden group ${isPlaying ? 'z-[70]' : 'z-10'} transition-all duration-700`}>
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{
                clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0% 50%)',
              }}
            >
              <video
                ref={videoRef}
                src={aboutVideo}
                muted={isMuted}
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              ></video>
            </div>

            {/* Play/Pause Button - Center */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newPlayingState = !isPlaying;
                setIsPlaying(newPlayingState);
                if (videoRef.current) {
                  if (newPlayingState) {
                    videoRef.current.play();
                  } else {
                    videoRef.current.pause();
                  }
                }
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] bg-black/50 hover:bg-black/70 text-white p-4 md:p-5 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center border border-white/20 cursor-pointer shadow-xl group-hover:opacity-100"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>

            {/* Mute/Unmute Button - Top Right */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newMutedState = !isMuted;
                setIsMuted(newMutedState);
                if (videoRef.current) {
                  videoRef.current.muted = newMutedState;
                }
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[100] bg-black/70 hover:bg-black text-white p-2.5 md:p-3 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center border border-white/20 cursor-pointer shadow-lg"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              )}
            </button>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="10,0 0,50 10,100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              <polyline className="border-line" points="10,0 0,50 10,100" fill="none" stroke="#1F2937" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
