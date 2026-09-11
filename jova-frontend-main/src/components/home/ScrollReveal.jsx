import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const ScrollReveal = ({ 
  children, 
  className = '', 
  delay = 0, 
  yOffset = 50, 
  xOffset = 0,
  duration = 0.8,
  stagger = 0,
  scale = 1,
  rotation = 0,
  scrub = false
}) => {
  const el = useRef(null);

  useGSAP(() => {
    // Determine if we should animate children (stagger) or just the wrapper
    const target = stagger > 0 ? el.current.children : el.current;

    gsap.fromTo(target,
      { 
        opacity: 0, 
        y: yOffset, 
        x: xOffset,
        scale: scale,
        rotation: rotation
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el.current,
          start: "top 85%",
          scrub: scrub,
          toggleActions: "play none none reverse",
          once: !scrub
        }
      }
    );
  }, { scope: el });

  return (
    <div ref={el} className={className}>
      {children}
    </div>
  );
};
