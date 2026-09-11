import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function FactorySVG({ isHovered, reducedMotion }) {
  const svgRef = useRef(null);
  const gear1Ref = useRef(null);
  const gear2Ref = useRef(null);
  const smokeRef = useRef([]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      // Base looping animation
      gsap.to(gear1Ref.current, {
        rotation: 360,
        transformOrigin: "center",
        duration: 4,
        repeat: -1,
        ease: "none"
      });
      gsap.to(gear2Ref.current, {
        rotation: -360,
        transformOrigin: "center",
        duration: 4,
        repeat: -1,
        ease: "none"
      });

      gsap.to(smokeRef.current, {
        y: -10,
        opacity: 0,
        duration: 2,
        stagger: 0.5,
        repeat: -1,
        ease: "power1.out"
      });

    }, svgRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      if (isHovered) {
        gsap.to(gear1Ref.current, {
          stroke: "#FF7A00",
          filter: "drop-shadow(0px 0px 4px rgba(255, 122, 0, 0.6))",
          duration: 0.4
        });
        gsap.to(gear2Ref.current, {
          stroke: "#FF7A00",
          filter: "drop-shadow(0px 0px 4px rgba(255, 122, 0, 0.6))",
          duration: 0.4
        });
        gsap.to(smokeRef.current, {
          scale: 1.2,
          transformOrigin: "bottom",
          duration: 0.4
        });
      } else {
        gsap.to([gear1Ref.current, gear2Ref.current], {
          stroke: "rgba(255,255,255,0.8)",
          filter: "none",
          duration: 0.4
        });
        gsap.to(smokeRef.current, {
          scale: 1,
          duration: 0.4
        });
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
      {/* Smoke */}
      <g stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
        <path ref={el => smokeRef.current[0] = el} d="M35 30 Q 30 20 40 10" />
        <path ref={el => smokeRef.current[1] = el} d="M45 25 Q 40 15 50 5" />
        <path ref={el => smokeRef.current[2] = el} d="M55 25 Q 50 15 60 5" />
      </g>

      {/* Building */}
      <path 
        d="M20 80 L20 50 L40 50 L40 40 L60 40 L60 30 L80 30 L80 80 Z" 
        stroke="rgba(255,255,255,0.8)" 
        strokeWidth="3" 
        strokeLinejoin="round"
      />
      <path d="M20 80 L80 80" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" />

      {/* Gears */}
      <g stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round">
        <circle ref={gear1Ref} cx="35" cy="65" r="5" strokeDasharray="2 2" />
        <circle ref={gear2Ref} cx="55" cy="65" r="7" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}
