import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

export default function CpuSVG({ isHovered, reducedMotion }) {
  const svgRef = useRef(null);
  const chipRef = useRef(null);
  const pinsRef = useRef([]);
  const circuitsRef = useRef([]);

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
      
      // Ensure circuits and pins are fully visible initially
      gsap.set(circuitsRef.current, { strokeDashoffset: 0, opacity: 0.8 });
      gsap.set(pinsRef.current, { opacity: 0.8 });

    }, svgRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      if (isHovered) {
        gsap.to(chipRef.current, {
          scale: 1.05,
          stroke: "#FF7A00",
          filter: "drop-shadow(0px 0px 6px rgba(255, 122, 0, 0.6))",
          transformOrigin: "center",
          duration: 0.4,
          ease: "back.out(1.5)"
        });
        gsap.to(circuitsRef.current, {
          opacity: 1,
          duration: 0.4
        });
        gsap.to(pinsRef.current, {
          opacity: 1,
          duration: 0.4
        });
      } else {
        gsap.to(chipRef.current, {
          scale: 1,
          stroke: "rgba(255,255,255,0.8)",
          filter: "none",
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(circuitsRef.current, {
          opacity: 0.8,
          duration: 0.4
        });
        gsap.to(pinsRef.current, {
          opacity: 0.8,
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
      <defs>
        <filter id="glowCpu" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Pins */}
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
        {/* Top */}
        <line ref={el => pinsRef.current.push(el)} x1="35" y1="25" x2="35" y2="15" />
        <line ref={el => pinsRef.current.push(el)} x1="50" y1="25" x2="50" y2="15" />
        <line ref={el => pinsRef.current.push(el)} x1="65" y1="25" x2="65" y2="15" />
        {/* Bottom */}
        <line ref={el => pinsRef.current.push(el)} x1="35" y1="75" x2="35" y2="85" />
        <line ref={el => pinsRef.current.push(el)} x1="50" y1="75" x2="50" y2="85" />
        <line ref={el => pinsRef.current.push(el)} x1="65" y1="75" x2="65" y2="85" />
        {/* Left */}
        <line ref={el => pinsRef.current.push(el)} x1="25" y1="35" x2="15" y2="35" />
        <line ref={el => pinsRef.current.push(el)} x1="25" y1="50" x2="15" y2="50" />
        <line ref={el => pinsRef.current.push(el)} x1="25" y1="65" x2="15" y2="65" />
        {/* Right */}
        <line ref={el => pinsRef.current.push(el)} x1="75" y1="35" x2="85" y2="35" />
        <line ref={el => pinsRef.current.push(el)} x1="75" y1="50" x2="85" y2="50" />
        <line ref={el => pinsRef.current.push(el)} x1="75" y1="65" x2="85" y2="65" />
      </g>

      {/* Main Chip */}
      <rect 
        ref={chipRef}
        x="25" 
        y="25" 
        width="50" 
        height="50" 
        rx="6" 
        stroke="rgba(255,255,255,0.8)" 
        strokeWidth="3"
      />

      {/* Inner Circuits */}
      <g 
        stroke="#FF7A00" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#glowCpu)"
      >
        <path ref={el => { if(el) circuitsRef.current[0] = el; }} d="M40 40 L60 40 L60 60 L40 60 Z" />
        <path ref={el => { if(el) circuitsRef.current[1] = el; }} d="M35 50 L40 50" />
        <path ref={el => { if(el) circuitsRef.current[2] = el; }} d="M60 50 L65 50" />
        <path ref={el => { if(el) circuitsRef.current[3] = el; }} d="M50 35 L50 40" />
        <path ref={el => { if(el) circuitsRef.current[4] = el; }} d="M50 60 L50 65" />
      </g>
    </svg>
  );
}
