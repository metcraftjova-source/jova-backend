import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function LayersSVG({ isHovered, reducedMotion }) {
  const svgRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      // Base looping animation
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(layer1Ref.current, { y: -3, duration: 2, ease: "sine.inOut" }, 0)
        .to(layer3Ref.current, { y: 3, duration: 2, ease: "sine.inOut" }, 0);
    }, svgRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    
    let ctx = gsap.context(() => {
      if (isHovered) {
        gsap.to(layer1Ref.current, {
          y: -12,
          rotation: -5,
          transformOrigin: "center",
          stroke: "#FF7A00",
          filter: "drop-shadow(0px 0px 6px rgba(255, 122, 0, 0.5))",
          duration: 0.6,
          ease: "power2.out"
        });
        gsap.to(layer2Ref.current, {
          rotation: 0,
          transformOrigin: "center",
          duration: 0.6,
          ease: "power2.out"
        });
        gsap.to(layer3Ref.current, {
          y: 12,
          rotation: 5,
          transformOrigin: "center",
          stroke: "rgba(255,255,255,0.3)",
          duration: 0.6,
          ease: "power2.out"
        });
      } else {
        gsap.to([layer1Ref.current, layer2Ref.current, layer3Ref.current], {
          y: 0,
          rotation: 0,
          stroke: "rgba(255,255,255,0.8)",
          filter: "none",
          duration: 0.6,
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
      <g stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinejoin="round">
        <path 
          ref={layer1Ref}
          d="M50 20 L80 35 L50 50 L20 35 Z" 
          fill="rgba(255,122,0,0.1)"
        />
        <path 
          ref={layer2Ref}
          d="M20 45 L50 60 L80 45" 
          strokeLinecap="round"
        />
        <path 
          ref={layer3Ref}
          d="M20 55 L50 70 L80 55" 
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
