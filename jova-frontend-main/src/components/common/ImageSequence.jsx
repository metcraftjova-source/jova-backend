import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import aboutHeroVideoSrc from '../../assets/about-hero.mp4';

gsap.registerPlugin(ScrollTrigger);

export default function ImageSequenceHero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const playhead = useRef({ t: 0 });

  const hasSignaledReady = useRef(false);

  // Wait for an actual DECODED FRAME (readyState >= 2 / 'loadeddata'), not
  // just metadata (readyState >= 1 / 'loadedmetadata') — metadata alone
  // only gives duration/dimensions, so drawImage() could still paint a
  // blank canvas even after this fires if we don't wait for real pixel
  // data. Matches the same fix applied to the Home page Hero.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      setVideoReady(true);
      if (!hasSignaledReady.current) {
        hasSignaledReady.current = true;
        // Reuses the same global event the Home hero dispatches, so any
        // page-level loading screen can listen for one consistent signal
        // regardless of which hero is mounted.
        window.dispatchEvent(new CustomEvent('jova-hero-ready'));
      }
    };

    if (video.readyState >= 2) {
      markReady();
      return;
    }
    video.addEventListener('loadeddata', markReady);
    return () => video.removeEventListener('loadeddata', markReady);
  }, []);

  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useGSAP(() => {
    if (!videoReady || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    const duration = video.duration || 0;
    if (duration === 0) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const render = () => {
      if (!canvas || !ctx || !video.videoWidth) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions to cover the canvas (like object-fit: cover)
      const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      const x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
      const y = (canvas.height / 2) - (video.videoHeight / 2) * scale;

      ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
    };

    // Initial render
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Setup GSAP Timeline and ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%', // Adjust scroll length here
        pin: true,
        scrub: 0.5, // Smooth scrubbing
      }
    });

    // Animate playhead across the video's own duration (seconds), seeking
    // + redrawing on every update instead of swapping an <img> index.
    tl.to(playhead.current, {
      t: duration,
      ease: 'none',
      duration: 1,
      onUpdate: () => {
        video.currentTime = Math.max(0, Math.min(playhead.current.t, duration - 0.03));
        render();
      }
    }, 0);

    // Fade out initial text on scroll
    if (textRef.current) {
      tl.to(textRef.current, {
        opacity: 0,
        x: -50,
        ease: 'power2.inOut',
        duration: 0.1
      }, 0);
    }

    // Text 2: Standard Fabrication
    if (text2Ref.current) {
      tl.fromTo(text2Ref.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.1, ease: 'power2.out' },
        0.15
      )
        .to(text2Ref.current, { opacity: 0, x: 50, duration: 0.1, ease: 'power2.in' }, 0.35);
    }

    // Text 3: Premium Coating & Finishing
    if (text3Ref.current) {
      tl.fromTo(text3Ref.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.1, ease: 'power2.out' },
        0.75
      )
        .to(text3Ref.current, { opacity: 0, x: 50, duration: 0.1, ease: 'power2.in' }, 0.95);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, { scope: containerRef, dependencies: [videoReady] });

  return (
    <div ref={containerRef} className="relative w-full h-dvh bg-[#050B16] overflow-hidden">
      <video
        ref={videoRef}
        src={aboutHeroVideoSrc}
        muted
        playsInline
        preload="auto"
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Initial Overlay Content */}
      <div ref={textRef} className="absolute inset-y-0 left-[10%] flex flex-col justify-center pointer-events-none z-10">
        <div className="w-12 h-1 bg-[#3BA7FF] mb-6"></div>
        <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-[1.1] font-sans drop-shadow-lg">
          Precision <br />
          Sheet Metal <br />
          & Facades
        </h2>
        <div className="w-12 h-1 bg-[#3BA7FF] mt-6"></div>
      </div>

      {/* Text 2 */}
      <div ref={text2Ref} className="absolute inset-y-0 left-[10%] flex flex-col justify-center pointer-events-none z-10 opacity-0">
        <div className="w-12 h-1 bg-[#3BA7FF] mb-6"></div>
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.1] font-sans mb-6 drop-shadow-lg">
          Standard <br />
          Fabrication
        </h2>
        <div className="w-12 h-1 bg-[#3BA7FF] mb-8"></div>
        <p className="text-white text-sm md:text-base mb-8 max-w-md font-normal leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}>
        We transform raw mterials into high-performance engineering solutions through advanced fabrication techniques and skilled craftsmanship.
        </p>

      </div>

      {/* Text 3 */}
      <div ref={text3Ref} className="absolute top-[35%] left-[10%] flex flex-col pointer-events-none z-10 opacity-0">
        <div className="w-12 h-1 bg-[#3BA7FF] mb-6"></div>
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.1] font-sans mb-6 drop-shadow-lg">
          Premium Coating <br />
          & Finishing
        </h2>
        <p className="text-white text-sm md:text-base mb-8 max-w-md font-normal leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}>
          Protection that performs, finish that impresses
        </p>

      </div>

      {/* Loading State — simplified from the old per-frame download
          percentage, since a single small video loads its metadata almost
          instantly rather than needing hundreds of individual requests. */}
      {!videoReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050B16] z-20 transition-opacity duration-500">
          <div className="w-10 h-10 border-4 border-[#ff6b00] border-t-transparent rounded-full animate-spin mb-5"></div>
          <div style={{ color: '#ff6b00', fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.1em' }}>
            LOADING...
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      {videoReady && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none animate-bounce z-10 text-white/50">
          <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  );
}