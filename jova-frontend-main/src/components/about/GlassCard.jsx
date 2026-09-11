import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { animationConfig } from './utils/animationConfig';

export default function GlassCard({ step, setRef, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const reflectionRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (-1 to 1)
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    const maxMove = animationConfig.magnetic.maxMovement;
    
    // Magnetic movement & rotation
    gsap.to(card, {
      x: mouseX * maxMove,
      y: mouseY * maxMove - 18, // Combine with hover lift
      rotateX: -mouseY * 10,
      rotateY: mouseX * 8,
      ease: "power2.out",
      duration: 0.4
    });

    // Move reflection
    gsap.to(reflectionRef.current, {
      x: mouseX * 50,
      y: mouseY * 50,
      opacity: 0.8,
      ease: "power2.out",
      duration: 0.4
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (reducedMotion || !cardRef.current) return;

    gsap.to(cardRef.current, {
      scale: animationConfig.hover.scale,
      boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 2px rgba(255,255,255,0.15)",
      borderColor: "rgba(255,122,0,0.3)",
      backdropFilter: "blur(30px)",
      duration: animationConfig.hover.duration,
      ease: animationConfig.hover.ease,
      overwrite: "auto"
    });

    gsap.to(glowRef.current, {
      opacity: 1,
      scale: 1.2,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (reducedMotion || !cardRef.current) return;

    // Return to original floating state relative values
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 1px rgba(255,255,255,0.08)",
      borderColor: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(25px)",
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto"
    });

    gsap.to(reflectionRef.current, {
      x: 0,
      y: 0,
      opacity: 0,
      duration: 0.6
    });

    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.6
    });
  };

  const SvgComponent = step.IconComponent;

  return (
    <div 
      ref={(el) => {
        cardRef.current = el;
        setRef(el); // Pass to parent for entrance animation
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center text-center group snap-center min-w-[280px] lg:min-w-0"
      style={{
        transformStyle: "preserve-3d",
        perspective: `${animationConfig.magnetic.perspective}px`,
        willChange: "transform, opacity, filter"
      }}
    >
      {/* 3D Glass Container */}
      <div 
        className="relative w-40 h-40 mb-10 rounded-[28px] flex items-center justify-center overflow-hidden transition-colors duration-500"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 1px rgba(255,255,255,0.08)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Ambient Orange Glow */}
        <div 
          ref={glowRef}
          className="absolute inset-0 bg-orange-500/20 blur-2xl opacity-0 pointer-events-none transition-opacity duration-300 rounded-full"
          style={{ transform: 'translateZ(-10px)' }}
        ></div>

        {/* Dynamic Glass Reflection */}
        <div 
          ref={reflectionRef}
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 pointer-events-none"
          style={{ transform: 'translateZ(10px)' }}
        ></div>

        {/* SVG Container */}
        <div className="relative z-20 w-24 h-24 pointer-events-none" style={{ transform: 'translateZ(20px)' }}>
          <SvgComponent isHovered={isHovered} reducedMotion={reducedMotion} />
        </div>
      </div>

      {/* Floating Glass Number Badge */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 relative z-10 transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}
           style={{
             background: isHovered ? "rgba(255,122,0,0.15)" : "rgba(255,255,255,0.05)",
             backdropFilter: "blur(10px)",
             border: `1px solid ${isHovered ? '#FF7A00' : 'rgba(255,255,255,0.1)'}`,
             boxShadow: isHovered ? "0 0 20px rgba(255,122,0,0.4)" : "0 5px 15px rgba(0,0,0,0.3)"
           }}>
        <span className={`font-bold transition-colors duration-500 ${isHovered ? 'text-white' : 'text-orange-500'}`}>
          {step.id}
        </span>
      </div>

      {/* Text Content */}
      <h3 className={`font-bold text-lg mb-3 px-2 transition-colors duration-500 ${isHovered ? 'text-white' : 'text-gray-200'}`}>
        {step.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed px-4 max-w-[250px]">
        {step.description}
      </p>
    </div>
  );
}
