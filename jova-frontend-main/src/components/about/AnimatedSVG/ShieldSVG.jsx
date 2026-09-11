import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

export default function ShieldSVG({ isHovered, reducedMotion }) {
  const svgRef = useRef(null);
  const shieldRef = useRef(null);
  const checkRef = useRef(null);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      // Base looping animation
      gsap.to(shieldRef.current, {
        y: -3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(checkRef.current, {
        stroke: "#FF7A00",
        filter: "drop-shadow(0px 0px 5px rgba(255, 122, 0, 0.6))",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, svgRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      if (isHovered) {
        gsap.fromTo(shieldRef.current,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1.2, ease: "power2.out" }
        );
        gsap.fromTo(checkRef.current,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.8, delay: 0.4, ease: "power2.out" }
        );
        gsap.to(shieldRef.current, {
          scale: 1.05,
          transformOrigin: "center",
          stroke: "rgba(255,255,255,1)",
          duration: 0.4,
          ease: "back.out(1.5)"
        });
      } else {
        gsap.to(shieldRef.current, {
          scale: 1,
          stroke: "rgba(255,255,255,0.8)",
          duration: 0.4,
          ease: "power2.out"
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
      <path 
        ref={shieldRef}
        d="M50 15 L20 25 L20 45 C20 65 40 80 50 85 C60 80 80 65 80 45 L80 25 Z" 
        stroke="rgba(255,255,255,0.8)" 
        strokeWidth="3" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        ref={checkRef}
        d="M35 50 L45 60 L65 40" 
        stroke="rgba(255,255,255,0.6)" 
        strokeWidth="3" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
