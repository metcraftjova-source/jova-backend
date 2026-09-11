import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function TruckSVG({ isHovered, reducedMotion }) {
  const svgRef = useRef(null);
  const wheelsRef = useRef([]);
  const truckRef = useRef(null);
  const packageRef = useRef(null);
  const trailRef = useRef(null);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      // Base looping animation
      gsap.to(wheelsRef.current, {
        rotation: 360,
        transformOrigin: "center",
        duration: 1,
        repeat: -1,
        ease: "none"
      });

      gsap.to(truckRef.current, {
        y: -1,
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "none"
      });

      gsap.to(packageRef.current, {
        y: -3,
        rotation: -2,
        duration: 0.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.fromTo(trailRef.current,
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 1.5, repeat: -1, ease: "none" }
      );
    }, svgRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      if (isHovered) {
        gsap.to(truckRef.current, {
          x: 5,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(trailRef.current, {
          opacity: 1,
          duration: 0.4
        });
        gsap.to(packageRef.current, {
          stroke: "#FF7A00",
          filter: "drop-shadow(0px 0px 4px rgba(255, 122, 0, 0.5))",
          duration: 0.4
        });
      } else {
        gsap.to(truckRef.current, {
          x: 0,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(trailRef.current, {
          opacity: 0.3,
          duration: 0.4
        });
        gsap.to(packageRef.current, {
          stroke: "rgba(255,255,255,0.8)",
          filter: "none",
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
      {/* Trail */}
      <path 
        ref={trailRef}
        d="M5 80 L35 80" 
        stroke="rgba(255,122,0,0.5)" 
        strokeWidth="2" 
        strokeDasharray="10 10"
        strokeLinecap="round"
        opacity="0.3"
      />

      <g ref={truckRef}>
        {/* Cab */}
        <path d="M60 45 L75 45 L85 60 L85 75 L60 75 Z" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M75 45 L85 60" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinejoin="round" />
        
        {/* Window */}
        <path d="M65 50 L75 50 L80 58 L65 58 Z" fill="rgba(255,122,0,0.2)" stroke="rgba(255,122,0,0.5)" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Trailer */}
        <rect x="15" y="35" width="45" height="40" rx="3" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
        
        {/* Package symbol inside trailer */}
        <g ref={packageRef}>
          <rect x="25" y="45" width="16" height="16" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
          <path d="M25 53 L41 53" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
          <path d="M33 45 L33 53" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        </g>
        
        {/* Wheels */}
        <g stroke="rgba(255,255,255,0.9)" strokeWidth="2.5">
          <circle ref={el => wheelsRef.current[0] = el} cx="30" cy="75" r="6" fill="#111315" />
          <circle ref={el => wheelsRef.current[1] = el} cx="70" cy="75" r="6" fill="#111315" />
          {/* Wheel detail */}
          <path d="M30 72 L30 78 M27 75 L33 75" strokeWidth="1.5" />
          <path d="M70 72 L70 78 M67 75 L73 75" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
}
