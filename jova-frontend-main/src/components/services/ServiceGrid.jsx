import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { GlassIcon } from './icons/GlassIcon';
import {
  StructuralSteelIcon,
  ShotBlastingIcon,
  IndustrialPaintingIcon,
  FacadeSolutionsIcon
} from './icons/ServiceIllustrations';

import servicesFabrication from '../../assets/ServiceGrid/Steel Fabrication.png';
import servicesErection from '../../assets/ServiceGrid/Shot Blasting.png';
import servicesPeb from '../../assets/ServiceGrid/Industrial Painting & Coating.png';
import servicesInfrastructure from '../../assets/ServiceGrid/Facade Solutions.png';

const servicesList = [
  {
    id: '01',
    title: 'STEEL FABRICATION',
    description: 'We transform raw metal into precision-engineered components through expert cutting, bending, welding, and assembly. Using advanced machinery and strict quality control, we deliver custom structural steel solutions for industrial, commercial, and architectural projects.',
    icon: <StructuralSteelIcon />,
    image: servicesFabrication,
    checklist: []
  },
  {
    id: '02',
    title: 'SHOT BLASTING',
    description: 'We prepare metal surfaces using high-speed abrasive blasting to remove rust, scale, paint, and contaminants. The result is a clean, uniform finish that ensures stronger coating adhesion and lasting durability.',
    icon: <ShotBlastingIcon />,
    image: servicesErection,
    checklist: []
  },
  {
    id: '03',
    title: 'INDUSTRIAL PAINTING & COATINGS',
    description: 'We provide protective and decorative coating solutions that shield metal structures from corrosion and wear. Our industrial-grade paints and precise application deliver lasting durability and a superior finish.',
    icon: <IndustrialPaintingIcon />,
    image: servicesPeb,
    checklist: []
  },
  {
    id: '04',
    title: 'FACADE SOLUTIONS',
    description: 'We design and install architectural facades that blend structural strength with visual appeal. Our solutions ensure weather resistance and a refined, professional exterior finish.',
    icon: <FacadeSolutionsIcon />,
    image: servicesInfrastructure,
    checklist: []
  }
];

const ServiceGrid = () => {
  const { hash } = useLocation();
  const lenis = useLenis();
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    if (hash === '#engineering-excellence') {
      const timer = setTimeout(() => {
        const element = document.getElementById('engineering-excellence');
        if (element) {
          if (lenis) {
            lenis.scrollTo(element, {
              offset: -80,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (hash && hash.startsWith('#service-')) {
      const serviceId = hash.replace('#service-', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(`service-${serviceId}`);
        if (element) {
          setHighlightedId(serviceId);
          if (lenis) {
            lenis.scrollTo(element, {
              offset: -120,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          // Remove highlight after 3 seconds
          const removeHighlightTimer = setTimeout(() => {
            setHighlightedId(null);
          }, 3000);
          return () => clearTimeout(removeHighlightTimer);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash, lenis]);

  return (
    <section id="engineering-excellence" className="relative w-full bg-[#FAFAFA] py-16 lg:py-24 flex flex-col justify-center" style={{ overflow: 'clip' }}>
      <style>{`
        @keyframes highlight-pulse {
          0%, 100% {
            border-color: #E34A12;
            box-shadow: 0 0 15px rgba(227, 74, 18, 0.15);
          }
          50% {
            border-color: #FF8D4F;
            box-shadow: 0 0 35px rgba(227, 74, 18, 0.45);
          }
        }
        .highlighted-service-card {
          animation: highlight-pulse 1.5s infinite ease-in-out;
        }
      `}</style>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E34A12]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#E34A12]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <span className="inline-block text-[#E34A12] text-xs font-black uppercase tracking-widest mb-1.5">
            • OUR SERVICES
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Engineering Excellence. <span className="text-[#E34A12]">Built to Last.</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed font-medium">
            We deliver high-quality steel fabrication, industrial construction, and engineering solutions that ensure durability, safety, and long-term value.
          </p>
        </div>

        {/* 2x2 Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {servicesList.map((service) => (
            <div
              key={service.id}
              id={`service-${service.id}`}
              className={`group relative bg-white rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col min-h-[320px] h-auto cursor-pointer ${
                highlightedId === service.id
                  ? 'highlighted-service-card border-[#E34A12] z-30'
                  : 'border-gray-100/80 hover:border-transparent hover:shadow-[0_20px_50px_rgba(227,74,18,0.08)]'
              }`}
              style={highlightedId === service.id ? {
                transform: 'scale(1.02)',
              } : {}}
            >
              {/* Right Image panel positioned absolute spanning full height of parent card wrapper */}
              <div className="absolute right-0 top-0 bottom-0 w-[42%] overflow-hidden z-10">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Left Side Gradient Overlay (smooth fade) */}
                <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
              </div>

              {/* Overlaid ID Number (absolute top-right corner over the image) */}
              <span className="absolute top-6 right-8 lg:top-8 lg:right-10 text-[#F1F3F5] font-black text-5xl lg:text-6xl select-none group-hover:text-[#E34A12]/15 transition-colors duration-500 leading-none z-20">
                {service.id}
              </span>

              {/* Top Row: Glass Icon only */}
              <div className="flex justify-between items-start w-full relative z-20 p-5 pb-0 lg:p-6 lg:pb-0">
                <GlassIcon className="w-12 h-12 lg:w-14 lg:h-14">
                  {service.icon}
                </GlassIcon>
              </div>

              {/* Bottom Row: Content Left */}
              <div className="flex flex-row justify-between items-stretch flex-grow mt-3 lg:mt-4 gap-6 relative z-10 px-5 pb-5 lg:px-6 lg:pb-6 pt-0">
                {/* Left Text Details */}
                <div className="w-[58%] flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-base lg:text-[17px] font-black text-slate-900 tracking-tight group-hover:text-[#E34A12] transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Small Orange Underline Line */}
                    <div className="w-10 h-[2.5px] bg-[#E34A12] mt-1.5 mb-3.5"></div>

                    {/* Description */}
                    <p className="text-gray-500 text-[11px] lg:text-xs leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    {/* Checklist */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2.5 lg:mb-3.5">
                      {service.checklist.map((item) => (
                        <div key={item} className="flex items-center space-x-1">
                          {/* Custom Check Icon */}
                          <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#E34A12] text-[#E34A12] bg-[#E34A12]/5">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-[10px] lg:text-[11px] font-black text-slate-700 tracking-tight">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;