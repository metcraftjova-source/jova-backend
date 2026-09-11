import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const AnimatedGlassIcon = ({ children }) => {
  const containerRef = useRef(null);
  const glassRef = useRef(null);
  const sweepRef = useRef(null);

  useEffect(() => {
    const card = containerRef.current.closest('.product-card');
    if (!card) return;

    const ctx = gsap.context(() => {
      // Idle Animation: slow float, subtle rotate
      const idleTl = gsap.timeline({ repeat: -1, yoyo: true })
        .to(containerRef.current, { y: -6, duration: 3.5, ease: 'sine.inOut' })
        .to(containerRef.current, { rotationZ: 3, duration: 4.5, ease: 'sine.inOut' }, 0);

      // Occasional Light Sweep (Idle)
      gsap.to(sweepRef.current, {
        x: '200%',
        duration: 2,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 4,
      });

      // Quick setters for Parallax
      const xTo = gsap.quickTo(glassRef.current, "rotationY", { ease: "power3", duration: 0.6 });
      const yTo = gsap.quickTo(glassRef.current, "rotationX", { ease: "power3", duration: 0.6 });
      
      const layerBgX = gsap.quickTo('.layer-bg', "x", { ease: "power3", duration: 0.5 });
      const layerBgY = gsap.quickTo('.layer-bg', "y", { ease: "power3", duration: 0.5 });
      
      const layerFgX = gsap.quickTo('.layer-fg', "x", { ease: "power3", duration: 0.5 });
      const layerFgY = gsap.quickTo('.layer-fg', "y", { ease: "power3", duration: 0.5 });

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        
        // Normalize (-1 to 1)
        const normX = (relX / rect.width) * 2 - 1;
        const normY = (relY / rect.height) * 2 - 1;

        // 3D Glass Tilt (Max 20 deg)
        xTo(normX * 20);
        yTo(-normY * 20);

        // Layer separation (Parallax inside SVG)
        layerBgX(-normX * 4);
        layerBgY(-normY * 4);
        layerFgX(normX * 8);
        layerFgY(normY * 8);
      };

      const handleMouseEnter = () => {
        idleTl.pause();
        // Dynamic hover entry
        gsap.to(containerRef.current, { 
          y: -15, 
          scale: 1.15, 
          rotationZ: 0,
          duration: 0.6, 
          ease: 'back.out(1.7)' 
        });
        
        // Ignite the glass rim
        gsap.to(glassRef.current, { 
          boxShadow: '0 25px 50px -12px rgba(255, 92, 0, 0.4), inset 0 2px 20px rgba(255, 92, 0, 0.3)', 
          borderColor: 'rgba(255, 92, 0, 0.6)', 
          background: 'rgba(255, 92, 0, 0.1)',
          duration: 0.5 
        });

        // Fast light sweep on enter
        gsap.fromTo(sweepRef.current, 
          { x: '-100%', opacity: 0.8 }, 
          { x: '200%', opacity: 0, duration: 0.8, ease: 'power2.out' }
        );
      };

      const handleMouseLeave = () => {
        // Reset trackers
        xTo(0);
        yTo(0);
        layerBgX(0);
        layerBgY(0);
        layerFgX(0);
        layerFgY(0);
        
        // Elastic return to idle
        gsap.to(containerRef.current, { 
          y: 0, 
          scale: 1, 
          rotationZ: 0,
          duration: 1.2, 
          ease: 'elastic.out(1, 0.4)',
          onComplete: () => idleTl.play()
        });
        
        // Restore glass to default premium state
        gsap.to(glassRef.current, { 
          rotationX: 0, 
          rotationY: 0, 
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255,255,255,0.2)', 
          borderColor: 'rgba(255, 255, 255, 0.18)',
          background: 'rgba(255, 255, 255, 0.08)',
          duration: 1.2, 
          ease: 'elastic.out(1, 0.4)' 
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-30 mb-6 origin-center pointer-events-none" style={{ perspective: '1200px' }}>
      <div 
        ref={glassRef}
        className="w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden will-change-transform pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255,255,255,0.2)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Animated Specular Highlight / Sweep */}
        <div 
          ref={sweepRef} 
          className="absolute inset-0 w-1/2 h-[200%] -top-1/2 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 z-0"
        ></div>
        
        {/* SVG Container */}
        <div className="w-11 h-11 relative z-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedGlassIcon;
