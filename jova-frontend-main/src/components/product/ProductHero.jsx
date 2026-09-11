import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ShapeGrid from '../ShapeGrid';

const ProductHero = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial image scale down and fade in
      tl.fromTo(imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: 2, ease: "power3.out" }
      );

      // Text reveal
      const words = textRef.current.querySelectorAll('.word');
      tl.fromTo(words,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "back.out(1.7)" },
        "-=1.5"
      );

      // Line and subtext reveal
      tl.fromTo('.subtext-container',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.8"
      );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split text helper
  const splitText = (text) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="inline-block overflow-hidden mr-3">
        <span className="word inline-block font-bold text-white leading-tight">
          {word === 'Facades' ? <span className="text-[#ff5c00]">{word}</span> : word}
        </span>
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="relative w-full h-dvh bg-[#070707] overflow-hidden flex flex-col justify-center font-sans">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-[#070707]">
        <img 
          ref={imageRef}
          src="/assets/hero_facade_1784535377394.png" 
          alt="Architectural Facade" 
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/80 via-[#070707]/30 to-transparent"></div>
      </div>

      {/* Background Shape Grid */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ShapeGrid 
          speed={0} 
          squareSize={60}
          direction='diagonal'
          borderColor='rgba(255, 255, 255, 0.15)'
          hoverFillColor='rgba(255, 92, 0, 0.4)'
          shape='triangle'
          hoverTrailAmount={5}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 mt-20">
        <div className="flex items-center space-x-4 mb-6 subtext-container">
          <div className="w-12 h-[2px] bg-[#ff5c00]"></div>
          <span className="text-[#ff5c00] font-bold tracking-widest text-sm uppercase">Engineered for Excellence</span>
        </div>

        <h1 ref={textRef} className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] mb-8">
          {splitText("Premium Sheet Metal Facades")}
        </h1>

        <div className="subtext-container max-w-2xl">
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            We deliver state-of-the-art architectural facade systems that combine striking aesthetics with unmatched structural integrity and energy efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
