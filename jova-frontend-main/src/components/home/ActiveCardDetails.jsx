import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo for a nice snappy start and slow finish
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);
    
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

const ActiveCardDetails = ({ cap, onClose }) => {
  if (!cap) return null;

  return (
    <div className="w-full bg-[#0D1015] text-white relative border-t border-gray-800 py-20 px-8 md:px-16 lg:px-24 flex flex-col lg:flex-row items-start justify-between gap-12 overflow-hidden">
      
      <style>{`
        @keyframes draw {
          from { stroke-dashoffset: 200; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim-pop-1 { animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards; opacity: 0; }
        .anim-pop-2 { animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards; opacity: 0; }
        .anim-pop-3 { animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards; opacity: 0; }
        .anim-pop-4 { animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s forwards; opacity: 0; }
        
        .svg-draw path, .svg-draw circle {
          stroke-dasharray: 200;
          animation: draw 1.5s ease-out forwards;
        }
        .svg-draw-delay path, .svg-draw-delay circle {
          stroke-dasharray: 200;
          animation: draw 1.5s ease-out 0.5s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Close/Cancel Button */}
      <button 
        onClick={onClose}
        className="absolute right-6 top-6 w-12 h-12 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF6B00] hover:bg-white/5 transition-all z-20 group"
        aria-label="Close details"
      >
        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Left Column: Text & Stats */}
      <div className="w-full lg:w-5/12 flex flex-col gap-6 relative z-10">
        <div className="anim-pop-1">
          <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-3">LENIE DEFRIIOUT</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Trust and Statistics</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            The lightneool's areiveaf ismposited as senal of loling aner-wiqping
            with the cingeilen gnd now lacent crysties, and stafels. Alniler-
            and albelyciumty videdifice of dure sturirying boct.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
          <div className="anim-pop-2">
            <h4 className="text-5xl md:text-6xl font-bold text-gray-300">
              <AnimatedNumber end={250} suffix="+" />
            </h4>
          </div>
          <div className="anim-pop-2">
            <h4 className="text-5xl md:text-6xl font-bold text-gray-300">
              <AnimatedNumber end={100} suffix="+" />
            </h4>
          </div>
          <div className="anim-pop-3">
            <h4 className="text-5xl md:text-6xl font-bold text-gray-300">
              <AnimatedNumber end={196} suffix="+" />
            </h4>
          </div>
          <div className="anim-pop-3">
            <h4 className="text-5xl md:text-6xl font-bold text-gray-300">
              <AnimatedNumber end={369} />
            </h4>
          </div>
        </div>
      </div>

      {/* Middle Column: Icons */}
      <div className="w-full lg:w-3/12 grid grid-cols-2 gap-8 relative z-10 items-center justify-center">
        {/* ISO Globe Badge */}
        <div className="flex justify-center anim-pop-1">
          <svg className="w-24 h-24 text-gray-400 svg-draw" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="40" r="25" />
            <path d="M50 15v50M25 40h50M35 20c-10 10-10 30 0 40M65 20c10 10 10 30 0 40" />
            <text x="50" y="45" textAnchor="middle" stroke="none" fill="currentColor" fontSize="16" fontWeight="bold">ISO</text>
            <path d="M35 63l-10 20 15-5 10 15 5-25" strokeLinejoin="round" />
            <path d="M65 63l10 20-15-5-10 15-5-25" strokeLinejoin="round" />
            <circle cx="75" cy="15" r="8" fill="#111418" stroke="#FF6B00" />
            <text x="75" y="20" textAnchor="middle" stroke="none" fill="#FF6B00" fontSize="12">!</text>
          </svg>
        </div>
        {/* Checkmark Badge */}
        <div className="flex justify-center relative anim-pop-2">
          <svg className="w-24 h-24 text-gray-400 svg-draw" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M50 15l7 7 10-3 3 10 9 4-4 9 4 9-9 4-3 10-10-3-7 7-7-7-10 3-3-10-9-4 4-9-4-9 9-4 3-10 10 3 7-7z" strokeLinejoin="round" />
            <path d="M35 45l10 10 20-20" />
          </svg>
          <div className="absolute -bottom-2 -right-2">
            <svg className="w-16 h-16 text-[#FF6B00] svg-draw-delay" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="50" cy="40" r="20" fill="#0D1015"/>
              <path d="M40 40l5 5 10-10" />
              <path d="M38 56l-10 25 15-5 10 15 5-25" strokeLinejoin="round" />
              <path d="M62 56l10 25-15-5-10 15-5-25" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {/* Second ISO Badge */}
        <div className="flex justify-center mt-8 anim-pop-3">
           <svg className="w-24 h-24 text-gray-400 svg-draw" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="40" r="25" />
            <circle cx="50" cy="40" r="20" strokeDasharray="4 4"/>
            <text x="50" y="45" textAnchor="middle" stroke="none" fill="currentColor" fontSize="16" fontWeight="bold">ISO</text>
            <path d="M35 63l-10 20 15-5 10 15 5-25" strokeLinejoin="round" />
            <path d="M65 63l10 20-15-5-10 15-5-25" strokeLinejoin="round" stroke="#FF6B00" />
          </svg>
        </div>
        {/* Graph Badge */}
        <div className="flex justify-center mt-8 anim-pop-4">
           <svg className="w-24 h-24 text-gray-400 svg-draw" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 80h60" />
            <path d="M25 80v-20h10v20M40 80v-40h10v40M55 80v-30h10v30M70 80v-50h10v50" />
            <path d="M55 80v-30h10v30" stroke="#FF6B00" />
            <path d="M20 50l20-15 15 10 25-25" />
            <path d="M70 15h10v10" />
            <circle cx="55" cy="25" r="8" />
            <path d="M55 13v4M55 33v4M43 25h4M63 25h4" />
          </svg>
        </div>
      </div>

      {/* Right Column: Premium Statistics */}
      <div className="w-full lg:w-4/12 flex flex-col gap-6 relative z-10 pl-0 lg:pl-12 border-l border-gray-800 anim-pop-4">
        <div>
          <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-3">PREMIUM STATISTICS</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Trench and<br/>Smarldoma</h2>
          
          <div className="w-16 h-1 bg-gradient-to-r from-[#FF6B00] to-transparent mb-6"></div>
          
          <p className="text-gray-400 text-sm leading-relaxed">
            A Bot-endbooh iderilerat loci
            codtentury emifallers creaite
            ingeciation, and cwree tinod
            datelng onglever us you realig.
          </p>
        </div>

        <div className="mt-8">
          <button className="flex items-center gap-12 border border-gray-600 rounded-full py-4 px-8 hover:border-[#FF6B00] hover:bg-white/5 transition-all group">
            <span className="text-sm font-medium">Learn and Scroll</span>
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FF6B00] transition-colors">
              &rarr;
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ActiveCardDetails;
