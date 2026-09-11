import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import ShapeGrid from '../ShapeGrid';
import AnimatedGlassIcon from './icons/AnimatedGlassIcon';
import {
  SolidAluminumIcon,
  InsulatedMetalIcon,
  StandingSeamIcon,
  CassettePanelIcon,
  CorrugatedPanelIcon,
  PerforatedPanelIcon
} from './icons/FacadeIcons';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: '01',
    title: 'Solid Aluminum Wall Panels',
    description: 'High-strength, non-combustible solid aluminum panels offering exceptional durability and a sleek, flat aesthetic for modern architecture.',
    image: '/assets/solid_aluminum_1784535395272.png',
    icon: <SolidAluminumIcon className="w-full h-full" />
  },
  {
    id: '02',
    title: 'Insulated Metal Wall Panels (IMP)',
    description: 'Advanced composite panels providing superior thermal efficiency, moisture control, and rapid installation in a single component.',
    image: '/assets/insulated_metal_1784535405781.png',
    icon: <InsulatedMetalIcon className="w-full h-full" />
  },
  {
    id: '03',
    title: 'Standing Seam Wall Panels',
    description: 'Distinctive vertical shadow lines with concealed fasteners, offering exceptional weather resistance and architectural character.',
    image: '/assets/standing_seam_1784535461444.png',
    icon: <StandingSeamIcon className="w-full h-full" />
  },
  {
    id: '04',
    title: 'Cassette Panel Systems',
    description: 'Precision-folded metal cassettes engineered for invisible fixing, allowing for perfectly flat, large-scale modular facades.',
    image: '/assets/cassette_panel_1784535497827.png',
    icon: <CassettePanelIcon className="w-full h-full" />
  },
  {
    id: '05',
    title: 'Corrugated / Trapezoidal Metal Panels',
    description: 'Economical and robust profiled sheets that deliver structural rigidity and dynamic light interplay for industrial and commercial exteriors.',
    image: '/assets/corrugated_metal_1784535514187.png',
    icon: <CorrugatedPanelIcon className="w-full h-full" />
  },
  {
    id: '06',
    title: 'Perforated Metal Façade Panels',
    description: 'Customizable hole patterns providing solar shading, acoustic control, and stunning visual permeability to transform any building envelope.',
    image: '/assets/perforated_metal_1784535530626.png',
    icon: <PerforatedPanelIcon className="w-full h-full" />
  }
];

const ProductRange = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo('.section-header', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Cards Staggered Animation using a single trigger on the grid
      gsap.fromTo('.product-card',
        { 
          y: 100, 
          opacity: 0,
          rotationX: 10
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );

      // Refresh ScrollTrigger to ensure accurate trigger calculations after render
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#030303] py-32 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden">
      {/* Background SVG Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-[0.03]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-white">
          <polygon points="100,0 100,100 0,100" />
        </svg>
      </div>

      {/* Section Header */}
      <div className="section-header flex flex-col items-center justify-center text-center mb-24 relative z-10">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-[1px] w-12 bg-[#ff5c00]"></div>
          <span className="text-[#ff5c00] font-bold tracking-widest text-sm uppercase">Our Systems</span>
          <div className="h-[1px] w-12 bg-[#ff5c00]"></div>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
          Architectural Solutions for <br/> <span className="text-gray-500 font-light">Every Vision</span>
        </h2>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {products.map((product, i) => (
          <div 
            key={product.id} 
            className="product-card group relative h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer bg-[#050505] shadow-2xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black opacity-100 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent h-2/3 bottom-0 top-auto"></div>
            </div>

            {/* Top Bar: Icon & Number */}
            <div className="absolute top-6 w-full px-8 flex justify-between items-start z-20">
              <AnimatedGlassIcon>
                {product.icon}
              </AnimatedGlassIcon>
              <span className="text-5xl font-black text-white/10 group-hover:text-white/30 transition-colors duration-500 font-sans tracking-tighter">
                {product.id}
              </span>
            </div>

            {/* Content (Bottom) */}
            <div className="absolute bottom-0 w-full p-8 z-20 flex flex-col justify-end">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ff5c00] transition-colors duration-300 leading-tight drop-shadow-lg">
                {product.title}
              </h3>
              
              {/* Accordion Reveal using CSS Grid */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                <div className="overflow-hidden">
                  <div className="pt-2">
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Glow Border */}
            <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-[#ff5c00]/50 z-30 transition-colors duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductRange;
