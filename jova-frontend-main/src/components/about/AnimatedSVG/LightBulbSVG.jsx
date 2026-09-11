import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

export default function LightBulbSVG({ isHovered, reducedMotion }) {
  const svgRef = useRef(null);
  const outlineRef = useRef(null);
  const filamentRef = useRef(null);
  const raysRef = useRef([]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      // Base looping animation (calm floating)
      gsap.to(svgRef.current, {
        y: -3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Keep filament fully drawn initially
      gsap.set(filamentRef.current, { drawSVG: "100%" });
      gsap.set(raysRef.current, { opacity: 0, scale: 0.8 });

    }, svgRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      if (isHovered) {
        gsap.to(outlineRef.current, {
          stroke: "#FF7A00",
          filter: "drop-shadow(0px 0px 8px rgba(255, 122, 0, 0.6))",
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.fromTo(raysRef.current,
          { opacity: 0, scale: 0.8, transformOrigin: "center" },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }
        );
      } else {
        gsap.to(outlineRef.current, {
          stroke: "rgba(255,255,255,0.7)",
          filter: "none",
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(raysRef.current, { opacity: 0, scale: 0.8, duration: 0.3 });
      }
    }, svgRef);
    
    return () => ctx.revert();
  }, [isHovered, reducedMotion]);

  return (
    <svg 
      ref={svgRef}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full overflow-visible"
    >
      <defs>
        <filter id="glowLightbulb" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Rays */}
      <g stroke="#FF7A00" strokeWidth="2" strokeLinecap="round">
        <line ref={el => raysRef.current[0] = el} x1="50" y1="10" x2="50" y2="4" />
        <line ref={el => raysRef.current[1] = el} x1="75" y1="20" x2="81" y2="14" />
        <line ref={el => raysRef.current[2] = el} x1="90" y1="45" x2="96" y2="45" />
        <line ref={el => raysRef.current[3] = el} x1="25" y1="20" x2="19" y2="14" />
        <line ref={el => raysRef.current[4] = el} x1="10" y1="45" x2="4" y2="45" />
      </g>

      {/* Bulb Outline */}
      <path 
        ref={outlineRef}
        d="M35 75 C 35 85, 65 85, 65 75 C 65 55, 80 45, 75 25 C 70 5, 30 5, 25 25 C 20 45, 35 55, 35 75 Z"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Base */}
      <path 
        d="M40 75 L60 75 M42 82 L58 82 M45 89 L55 89" 
        stroke="rgba(255,255,255,0.5)" 
        strokeWidth="3" 
        strokeLinecap="round"
      />

      {/* Filament */}
      <path 
        ref={filamentRef}
        d="M40 75 L 45 55 L 50 45 L 55 55 L 60 75" 
        stroke="#FF7A00" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowLightbulb)"
      />
    </svg>
  );
}
