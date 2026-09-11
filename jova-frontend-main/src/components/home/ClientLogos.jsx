import React, { useRef, useState, useEffect } from 'react';
import atsChemLogo from '../../assets/ClientLogo/ATSChem-logo.svg';
import cumiLogo from '../../assets/ClientLogo/CUMI-logo.svg';
import essaeLogo from '../../assets/ClientLogo/Essae-logo.svg';
import ionExchangeLogo from '../../assets/ClientLogo/IonExchange-logo.svg';
import lwLogo from '../../assets/ClientLogo/LW-logo.svg';
import mersenLogo from '../../assets/ClientLogo/Mersen-logo.png';
import propelLogo from '../../assets/ClientLogo/Propel-logo.svg';
import rigidfabLogo from '../../assets/ClientLogo/rigidfab-logo.jpeg';
import southernLogo from '../../assets/ClientLogo/Southern-logo.svg';
import spLogo from '../../assets/ClientLogo/SP-logo.svg';
import terexLogo from '../../assets/ClientLogo/Terex-logo-new.png';
import wegLogo from '../../assets/ClientLogo/Weg-logo-new.png';
import { ScrollReveal } from './ScrollReveal';

const logos = [
  atsChemLogo,
  cumiLogo,
  essaeLogo,
  ionExchangeLogo,
  lwLogo,
  mersenLogo,
  propelLogo,
  rigidfabLogo,
  southernLogo,
  spLogo,
  terexLogo,
  wegLogo
];

const LogoItem = ({ logo, index }) => {
  const [isCenter, setIsCenter] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Create an observer that only triggers when the element is in the middle 20% of the screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCenter(entry.isIntersecting);
      },
      {
        root: null,
        // -40% on left and right means the active intersection area is only the middle 20% of the screen horizontally
        rootMargin: "0px -40% 0px -40%", 
        threshold: 0
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <img 
        ref={imgRef}
        src={logo} 
        alt={`Partner Logo ${index}`} 
        className={`h-12 md:h-16 w-36 md:w-44 object-contain transition-all duration-500 cursor-pointer
          ${isCenter 
            ? 'grayscale-0 opacity-100 scale-110 drop-shadow-[0_15px_30px_rgba(255,107,0,0.5)]' 
            : 'filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_15px_30px_rgba(255,107,0,0.5)]'
          }
        `}
      />
    </div>
  );
};

const ClientLogos = () => {
  return (
    <section className="bg-[#0a0b0c] py-16 overflow-hidden relative border-t border-white/10 z-20">
      <ScrollReveal delay={0.2} className="w-full">
        {/* Gradient masks for smooth fade in/out on the edges */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#0a0b0c] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#0a0b0c] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex w-max animate-marquee space-x-20 px-10 items-center">
          {/* Duplicate the logos array to create a seamless infinite scrolling effect */}
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <LogoItem key={index} logo={logo} index={index} />
          ))}
        </div>
      </ScrollReveal>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        /* Optional: Pause the animation when hovered */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientLogos;
