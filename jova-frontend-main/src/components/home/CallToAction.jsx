import React, { useRef } from 'react';
import VideoLoop from '../common/VideoLoop';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
  const containerRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);

  useGSAP(() => {
    // Parallax on the left content
    gsap.fromTo(leftContentRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    // Parallax and mask reveal on the right image
    gsap.fromTo(rightContentRef.current,
      { clipPath: 'inset(10% 10% 10% 10%)', scale: 0.9 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true
        }
      }
    );

    // Mouse Move Parallax Effect
    const container = containerRef.current;
    const leftContent = leftContentRef.current;
    const rightContent = rightContentRef.current;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle parallax on text
      gsap.to(leftContent, {
        x: x * 0.02,
        y: y * 0.02,
        rotationY: x * 0.005,
        rotationX: -y * 0.005,
        ease: "power2.out",
        duration: 0.5
      });

      // Subtle parallax on image container
      gsap.to(rightContent, {
        x: x * -0.015,
        y: y * -0.015,
        rotationY: x * -0.005,
        rotationX: y * 0.005,
        ease: "power2.out",
        duration: 0.5
      });
    });

    container.addEventListener('mouseleave', () => {
      gsap.to([leftContent, rightContent], {
        x: 0,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        ease: "power2.out",
        duration: 0.8
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black py-10 px-4 md:px-8 border-t border-b border-gray-900">
      <div className="max-w-[1920px] mx-auto bg-[#111] rounded-2xl overflow-hidden border border-gray-800 flex flex-col lg:flex-row min-h-[500px]">

        {/* Left Side: Content */}
        <div ref={leftContentRef} className="p-10 lg:p-16 flex flex-col justify-center w-full lg:w-[45%] relative z-10">
          <span className="text-[#FF6B00] font-bold text-xs md:text-sm uppercase tracking-widest mb-4 block">
            Contact us to upgrade yourself
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight tracking-tight uppercase">
            TRANSFORM YOUR  <br />
            <span className="text-[#FF6B00]">VISION INTO </span> REALITY
          </h2>

          <p className="text-gray-400 text-sm md:text-base mb-10 max-w-md leading-relaxed mt-4">
            Collaborate with Jova Metacraft to access innovative sheet metal fabrication, architectural façade solutions, and precision manufacturing tailored to your project requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#FF6B00] hover:bg-[#e65c00] text-white font-bold py-3.5 px-8 rounded flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-colors duration-300">
              Get A Quote
              <span className="text-lg leading-none">&rarr;</span>
            </button>
            <button className="bg-transparent border border-gray-600 hover:border-[#FF6B00] text-gray-300 hover:text-[#FF6B00] font-bold py-3.5 px-8 rounded flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-colors duration-300">
              Contact Us
              <span className="text-lg leading-none">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full lg:w-[55%] min-h-[300px] lg:min-h-full relative overflow-hidden bg-[#1a1a1a]">
          <div ref={rightContentRef} className="w-full h-full relative">
            {/* Subtle gradient overlay to blend left side with right side */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#111] to-transparent z-10 hidden lg:block"></div>

            {/* Animated Image Sequence */}
            <VideoLoop
              src="/frame_4.mp4"
              className="absolute inset-0 w-full h-full"
            />

            {/* Faux 3D text overlay matching the image - just in case it's not part of the actual image */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-50">
              <div className="text-center transform rotate-[-2deg] scale-150">
                <span className="text-white font-bold tracking-widest text-6xl drop-shadow-2xl">JOVA</span><br />
                <span className="text-[#FF6B00] font-bold tracking-[0.3em] text-xl drop-shadow-lg uppercase">Metacraft</span>
              </div>
            </div>

            {/* Adding some subtle warm glowing lights simulating the factory lights */}
            <div className="absolute bottom-10 left-[20%] w-32 h-10 bg-[#FF6B00]/40 blur-2xl rounded-full"></div>
            <div className="absolute bottom-12 left-[50%] w-40 h-10 bg-[#FF6B00]/30 blur-3xl rounded-full"></div>
            <div className="absolute bottom-10 left-[75%] w-20 h-10 bg-[#FF6B00]/40 blur-2xl rounded-full"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CallToAction;