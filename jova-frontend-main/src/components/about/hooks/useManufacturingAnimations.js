import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { animationConfig } from '../utils/animationConfig';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export function useManufacturingAnimations({
  containerRef,
  cardsRef
}) {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!containerRef.current || !cardsRef.current.length) return;

    let ctx = gsap.context(() => {
      // 1. Scroll Entrance Animation
      const cards = cardsRef.current;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true
        },
        onComplete: () => {
          if (!prefersReducedMotion) {
            startFloatingLoop(cards);
          }
        }
      });

      // Reset initial state for entrance animation
      gsap.set(cards, {
        opacity: 0,
        y: 80,
        rotateX: 25,
        scale: 0.85,
        filter: "blur(12px)"
      });

      tl.to(cards, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: animationConfig.entrance.duration,
        stagger: animationConfig.entrance.stagger,
        ease: animationConfig.entrance.ease
      });

    }, containerRef);

    // 2. Floating Loop Function
    const startFloatingLoop = (cards) => {
      cards.forEach((card, i) => {
        // Randomize duration between 4 and 6 seconds
        const randomDuration = 4 + Math.random() * 2;
        
        gsap.to(card, {
          y: `+=${animationConfig.floating.yAmount}`,
          rotation: animationConfig.floating.rotateAmount,
          duration: randomDuration,
          ease: animationConfig.floating.ease,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * -randomDuration // Start at random point in loop
        });
      });
    };

    return () => ctx.revert();
  }, [containerRef, cardsRef]);
}
