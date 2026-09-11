import React, { useState, useEffect } from 'react';
import { Eye, Target } from 'lucide-react';

export default function VisionMission() {
  const [isFlipped1, setIsFlipped1] = useState(false);
  const [isFlipped2, setIsFlipped2] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  // Auto-flip for Vision card
  useEffect(() => {
    if (isHovered1) return;
    const interval = setInterval(() => {
      setIsFlipped1(prev => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered1]);

  // Auto-flip for Mission card (staggered)
  useEffect(() => {
    if (isHovered2) return;
    // Initial delay so they don't flip at the exact same time
    const initialDelay = setTimeout(() => {
      setIsFlipped2(prev => !prev);
      const interval = setInterval(() => {
        setIsFlipped2(prev => !prev);
      }, 3500);
      return () => clearInterval(interval);
    }, 1750);
    return () => clearTimeout(initialDelay);
  }, [isHovered2]);

  return (
    <section className="w-full bg-[#111315] py-24 px-4 md:px-12 flex flex-col items-center justify-center relative overflow-hidden">

      <div className="text-center mb-20 relative z-10">
        <h4 className="text-[#E34A12] font-bold tracking-widest text-xs md:text-sm uppercase mb-4">
          OUR PURPOSE
        </h4>
        <h2 className="text-5xl md:text-6xl font-extrabold text-white">
          Vision <span className="text-[#E34A12]">&</span> Mission
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl relative z-10">

        {/* Vision Card Container */}
        <div
          className="w-full md:w-1/2 max-w-[480px] h-[360px] perspective-1000 cursor-pointer"
          onMouseEnter={() => { setIsHovered1(true); setIsFlipped1(true); }}
          onMouseLeave={() => setIsHovered1(false)}
        >
          <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] ${isFlipped1 ? 'rotate-y-180' : ''}`}>

            {/* Front */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#222222] to-[#111111] rounded-[2rem] p-12 md:p-14 flex flex-col items-center justify-center border border-gray-700/50 backface-hidden transition-colors">
              <Eye size={80} className="text-[#E34A12] mb-6 drop-shadow-[0_0_15px_rgba(227,74,18,0.4)]" strokeWidth={1.5} />
              <h3 className="text-3xl font-bold text-white tracking-wide">Our Vision</h3>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#222222] to-[#111111] rounded-[2rem] p-12 md:p-14 flex flex-col justify-center items-center border border-orange-500/40 backface-hidden rotate-y-180">
              <p className="text-gray-300 text-[17px] leading-relaxed text-center">
                To become a global leader in<br />
                innovative manufacturing by delivering<br />
                sustainable, world-class engineering<br />
                solutions.
              </p>
            </div>

          </div>
        </div>

        {/* Mission Card Container */}
        <div
          className="w-full md:w-1/2 max-w-[480px] h-[360px] perspective-1000 cursor-pointer"
          onMouseEnter={() => { setIsHovered2(true); setIsFlipped2(true); }}
          onMouseLeave={() => setIsHovered2(false)}
        >
          <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] ${isFlipped2 ? 'rotate-y-180' : ''}`}>

            {/* Front */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#222222] to-[#111111] rounded-[2rem] p-12 md:p-14 flex flex-col items-center justify-center border border-gray-700/50 backface-hidden transition-colors">
              <Target size={80} className="text-[#E34A12] mb-6 drop-shadow-[0_0_15px_rgba(227,74,18,0.4)]" strokeWidth={1.5} />
              <h3 className="text-3xl font-bold text-white tracking-wide">Our Mission</h3>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#222222] to-[#111111] rounded-[2rem] p-12 md:p-14 flex flex-col justify-center items-center border border-orange-500/40 backface-hidden rotate-y-180">
              <p className="text-gray-300 text-[17px] leading-relaxed text-center">
                Deliver precision-engineered products<br />
                through continuous innovation,<br />
                advanced technology, skilled people,<br />
                and uncompromising quality.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Inline styles for 3D flip utilities */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </section>
  );
}
