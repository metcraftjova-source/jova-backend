import React, { useRef } from 'react';
import steelImage from '../../assets/steel_fabrication.png'; // Placeholder for card images

const solutionsData = [
  {
    id: 1,
    title: 'Steel Fabrication',
    desc: 'High-quality steel structures and custom fabrication solutions.',
  },
  {
    id: 2,
    title: 'CNC Machining',
    desc: 'Precision machining for complex components with tight tolerances.',
  },
  {
    id: 3,
    title: 'Architectural Aluminium',
    desc: 'Premium aluminium systems for modern architectural facades.',
  },
  {
    id: 4,
    title: 'Powder Coating',
    desc: 'Advanced powder and color coating for durable and premium finishes.',
  },
  {
    id: 5,
    title: 'Custom Engineering',
    desc: 'End-to-end custom engineering solutions tailored to your needs.',
  }
];

const OurSolutions = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#050505] text-white py-20 px-4 flex flex-col items-center overflow-hidden border-t border-white/5">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-12 z-10 relative text-center">
        <span className="text-[#ff6b00] font-bold text-[11px] tracking-widest uppercase mb-3">
          OUR SOLUTIONS
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Precision. Performance. <span className="text-[#ff6b00]">Perfection.</span>
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-[1600px] flex items-center justify-center">
        
        {/* Left Arrow */}
        <button 
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 z-20 w-12 h-12 items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollRef}
          className="flex flex-row gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 md:px-14 pb-8 pt-4 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {solutionsData.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-[280px] sm:w-[300px] bg-[#111111] rounded-xl border border-white/10 overflow-hidden flex flex-col snap-center group hover:border-[#ff6b00]/50 transition-colors duration-300 shadow-lg"
            >
              {/* Card Image */}
              <div className="w-full h-40 bg-[#1a1a1a] relative overflow-hidden">
                <img 
                  src={steelImage} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent"></div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-[#ff6b00]">
                    {/* Reusable Icon for layout */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  </div>
                  <h3 className="text-white font-semibold text-[15px]">{item.title}</h3>
                </div>
                
                <p className="text-[#999999] text-[13px] leading-relaxed mb-6 flex-grow">
                  {item.desc}
                </p>

                <a href="#" className="flex items-center gap-2 text-[#ff6b00] text-[11px] font-bold tracking-wider hover:text-white transition-colors uppercase group-hover:gap-3 duration-300">
                  LEARN MORE
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 z-20 w-12 h-12 items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="h-1 w-6 bg-[#ff6b00] rounded-full"></div>
        <div className="h-1 w-6 bg-white/40 rounded-full"></div>
        <div className="h-1 w-6 bg-white/20 rounded-full"></div>
      </div>
      
    </section>
  );
};

export default OurSolutions;
