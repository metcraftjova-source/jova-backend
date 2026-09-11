import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';
import logoVideoSrc from '../../assets/logo.mp4';
import homeHeroVideoSrc from '../../assets/home-hero.mp4';

gsap.registerPlugin(ScrollTrigger);

const contents = [
  {
    heading: "ENGINEERING THE FUTURE",
    paragraph: "Advancing the future of construction with virtual construction, architectural visualization, and innovative engineering solutions designed to improve efficiency, collaboration, and project performance."
  },
  {
    heading: "DEFINING TOMORROW",
    paragraph: "Driving innovation through advanced construction solutions, precision manufacturing, and modern technologies that deliver sustainable, high-quality outcomes for the built environment."
  },
  {
    heading: "DRIVEN BY INNOVATION",
    paragraph: "Delivering advanced engineering, precision fabrication, and technology-driven solutions designed to meet the evolving needs of modern construction and infrastructure."
  }
].map((c) => ({
  ...c,
  headingWords: c.heading.split(' '),
  paragraphWords: c.paragraph.split(' '),
}));

// `onReady` fires once the hero videos have actually decoded a real,
// drawable frame — not just once metadata is known. Pass this down from
// the parent (e.g. App.jsx / HomePage.jsx) and wire it to whatever flips
// LoadingScreen's `ready` prop to true. Without something calling this,
// LoadingScreen has no way to know the hero is actually ready and its
// progress bar will sit at 90% forever.
const Hero = ({ onReady }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const logoVideoRef = useRef(null);
  const heroVideoRef = useRef(null);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showText, setShowText] = useState(false);
  const [videosReady, setVideosReady] = useState(false);
  const [revealedWordCount, setRevealedWordCount] = useState(0);
  const hasAutoPlayed = useRef(false);
  const isAutoScrolling = useRef(false);
  const introDoneRef = useRef(false); // tracks last value dispatched via 'jova-intro-status'
  const updateFrameRef = useRef(() => {});
  const scrollTriggerRef = useRef(null);
  const onReadyFiredRef = useRef(false);
  const lenis = useLenis();

  // Wait for both source videos to have actual frame data ready (not just
  // metadata) before wiring up ScrollTrigger — readyState 1 only confirms
  // duration/dimensions are known, not that a frame can actually be seeked
  // and drawn yet, which is what previously caused the canvas to get stuck
  // showing only the very first frame.
  useEffect(() => {
    const logoVideo = logoVideoRef.current;
    const heroVideo = heroVideoRef.current;
    if (!logoVideo || !heroVideo) return;

    let logoReady = logoVideo.readyState >= 2;
    let heroReady = heroVideo.readyState >= 2;

    const checkReady = () => {
      if (logoReady && heroReady) {
        // Some browsers only fully activate frame decoding after an actual
        // play() call, even muted+instantly paused — without this,
        // drawImage(video, ...) can keep showing the very first frame no
        // matter what currentTime is set to.
        Promise.all([
          logoVideo.play().then(() => logoVideo.pause()).catch(() => {}),
          heroVideo.play().then(() => heroVideo.pause()).catch(() => {}),
        ]).finally(() => setVideosReady(true));
      }
    };

    const onLogoData = () => { logoReady = true; checkReady(); };
    const onHeroData = () => { heroReady = true; checkReady(); };

    if (logoReady) checkReady();
    else logoVideo.addEventListener('loadeddata', onLogoData);
    if (heroReady) checkReady();
    else heroVideo.addEventListener('loadeddata', onHeroData);

    return () => {
      logoVideo.removeEventListener('loadeddata', onLogoData);
      heroVideo.removeEventListener('loadeddata', onHeroData);
    };
  }, []);

  useGSAP(() => {
    if (!videosReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const logoVideo = logoVideoRef.current;
    const heroVideo = heroVideoRef.current;

    const logoDuration = logoVideo.duration || 0;
    const heroDuration = heroVideo.duration || 0;
    // Logo intro plays through ~35% faster relative to scroll/auto-scroll
    // time than before — the hero (engineering) video's pacing is
    // completely untouched. Tune LOGO_SPEED if it needs to be more/less.
    const LOGO_SPEED = 2;
    const logoEffectiveDuration = logoDuration / LOGO_SPEED;
    const totalDuration = logoEffectiveDuration + heroDuration;
    if (totalDuration === 0) return;

    let activeVideo = logoVideo;

    const drawVideoFrame = (video) => {
      if (!video.videoWidth || !video.videoHeight) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      const x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
      const y = (canvas.height / 2) - (video.videoHeight / 2) * scale;
      ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
    };

    // Render whichever video is currently active, at a given moment within
    // its own timeline (seconds).
    const render = (overallTime) => {
      const introFinished = overallTime >= logoEffectiveDuration;
      const video = introFinished ? heroVideo : logoVideo;
      // Logo: overallTime runs through the compressed (faster) timeline,
      // so scale back up to the video's real currentTime. Hero: untouched,
      // same 1:1 mapping as before.
      const localTime = introFinished
        ? Math.min(overallTime - logoEffectiveDuration, heroDuration)
        : Math.min(overallTime * LOGO_SPEED, logoDuration);

      activeVideo = video;
      // Clamp to avoid seeking past the very end, which some browsers reject
      video.currentTime = Math.max(0, Math.min(localTime, video.duration - 0.03));
      drawVideoFrame(video);

      return introFinished;
    };

    // Render first frame immediately, then fire the exact readiness signal
    // App.jsx is listening for — until now nothing ever dispatched this,
    // so LoadingScreen always fell through to App.jsx's 6-second failsafe
    // instead of finishing as soon as the hero was actually ready.
    render(0);
    if (!onReadyFiredRef.current) {
      onReadyFiredRef.current = true;
      window.dispatchEvent(new CustomEvent('jova-hero-ready'));
      onReady && onReady(); // also call the prop, in case a parent wires this directly instead
    }

    const sequence = { t: 0 };

    // Everything that needs to happen at a given point in the sequence —
    // draw the right video frame, decide which heading is active, and how
    // many of its words are revealed. Shared between the normal
    // scroll-scrubbed path AND the decoupled auto-play timeline below.
    const updateFrame = (overallTime) => {
      const introFinished = render(overallTime);

      if (!introFinished) {
        setShowText(false);
        setIsFinished(false);
      } else {
        setShowText(true);
        const heroProgress = (overallTime - logoEffectiveDuration) / heroDuration;

        if (heroProgress > 0.95) {
          setIsFinished(true);
        } else {
          setIsFinished(false);

          const segment = 1 / contents.length;
          const rawIndex = Math.min(Math.floor(heroProgress / segment), contents.length - 1);
          setActiveTextIndex(rawIndex);

          // How far we are through *this heading's* slice — used to
          // reveal its words one at a time rather than the whole sentence
          // snapping in at once.
          const localT = (heroProgress - rawIndex * segment) / segment;
          const current = contents[rawIndex];
          const totalWords = current.headingWords.length + current.paragraphWords.length;
          const count = Math.min(totalWords, Math.ceil(Math.max(0, localT) * totalWords));
          setRevealedWordCount(count);
        }
      }

      // Let the Header's side dock know once the JOVA logo intro has
      // played through, so it knows when to activate. Only dispatched
      // on change, not every frame.
      if (introFinished !== introDoneRef.current) {
        introDoneRef.current = introFinished;
        window.dispatchEvent(new CustomEvent('jova-intro-status', { detail: { done: introFinished } }));
      }
    };
    updateFrameRef.current = updateFrame;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5, // Smooth scrubbing
      animation: gsap.to(sequence, {
        t: totalDuration,
        ease: "none",
        onUpdate: () => updateFrame(sequence.t),
      })
    });
    scrollTriggerRef.current = st;

  }, { scope: containerRef, dependencies: [videosReady] });

  // One scroll (wheel tick / touch swipe / key press) while at the very top
  // auto-plays the whole pinned sequence to the end of the logo intro,
  // instead of requiring the user to manually scroll through all 400dvh.
  useEffect(() => {
    if (!videosReady) return;

    const triggerAutoPlay = () => {
      if (hasAutoPlayed.current || isAutoScrolling.current) return;
      if (window.scrollY > 10) return; // only from the very top
      const container = containerRef.current;
      if (!container) return;

      hasAutoPlayed.current = true;
      isAutoScrolling.current = true;

      const logoDuration = logoVideoRef.current.duration || 0;
      const heroDuration = heroVideoRef.current.duration || 0;
      const LOGO_SPEED = 2; // must match the value in the main render effect above
      const logoEffectiveDuration = logoDuration / LOGO_SPEED;
      const totalDuration = logoEffectiveDuration + heroDuration;
      if (totalDuration === 0) return;

      // Auto-play all the way through the logo intro AND the full hero
      // sequence — every heading reveals its words one at a time at a
      // readable pace.
      const targetOverallTime = totalDuration;
      const scrollableHeight = container.offsetHeight - window.innerHeight;
      const targetY = container.offsetTop + scrollableHeight;

      // The page's scroll position and the video's playback are normally
      // locked together 1:1 (scroll drives the video via ScrollTrigger's
      // scrub) — so scrolling fast would force the video to blur through
      // frames too. Instead: move the page to its final position quickly,
      // and disable the scrub for a moment so it doesn't fight over the
      // video timeline, while a separate, independent tween plays the
      // video/text out slowly and readably underneath.
      const st = scrollTriggerRef.current;
      if (st) st.disable(false);

      const totalWordsAllHeadings = contents.reduce(
        (sum, c) => sum + c.headingWords.length + c.paragraphWords.length,
        0
      );
      const introPace = Math.max(3.5, 12 * (logoEffectiveDuration / totalDuration));
      const readingPace = totalWordsAllHeadings * 0.4; // ~400ms/word — genuinely readable
      const videoDuration = introPace + readingPace;

      const scrollDuration = 2.2; // fast — the page itself should get there quickly

      const finishAutoScroll = () => {
        isAutoScrolling.current = false;
        if (st) {
          st.enable();
          ScrollTrigger.refresh();
        }
      };

      // Fast: just move the page to its final scroll position.
      if (lenis) {
        lenis.scrollTo(targetY, {
          duration: scrollDuration,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
        });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }

      // Slow: the video/text plays out on its own readable timeline,
      // independent of how fast the page itself just scrolled.
      const autoSequence = { t: 0 };
      gsap.to(autoSequence, {
        t: targetOverallTime,
        duration: videoDuration,
        ease: 'none',
        onUpdate: () => updateFrameRef.current(autoSequence.t),
        onComplete: finishAutoScroll,
      });
    };

    const handleWheel = (e) => {
      if (e.deltaY > 0) triggerAutoPlay();
    };
    const handleTouchMove = () => triggerAutoPlay();
    const handleKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) triggerAutoPlay();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lenis, videosReady]);

  return (
    <section ref={containerRef} id="home" className="relative w-full h-[400dvh] bg-black">
      {/* Sticky Container */}
      <div className="sticky top-0 left-0 w-full h-dvh overflow-hidden flex flex-col justify-center items-center">
        {/* Hidden source videos — never displayed directly. Their frames
            are drawn to the visible canvas below, seeked frame-by-frame via
            currentTime as the person scrolls. Kept technically in the
            layout (not display:none) so browsers don't suspend decoding. */}
        <video
          ref={logoVideoRef}
          src={logoVideoSrc}
          muted
          playsInline
          preload="auto"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}
        />
        <video
          ref={heroVideoRef}
          src={homeHeroVideoSrc}
          muted
          playsInline
          preload="auto"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}
        />

        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
        ></canvas>

        {/* Dark overlay for text legibility against busy sky/building backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/45 z-[5]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
          <div className="flex flex-col items-center justify-center text-center px-8 py-16 md:px-16 md:py-24 w-full max-w-4xl">
            <style>{`
              @keyframes jova-word-in {
                from { opacity: 0; transform: translateY(14px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .jova-word {
                display: inline-block;
                animation: jova-word-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
              }
            `}</style>
            <div className={`transition-opacity duration-700 ease-in-out flex flex-col items-center text-center ${showText && !isFinished ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.1em] uppercase mb-6 text-[#D4AF37]"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)' }}
              >
                {contents[activeTextIndex]?.headingWords.map((word, i) =>
                  i < revealedWordCount ? (
                    <span key={`${activeTextIndex}-h-${i}`} className="jova-word mr-[0.3em]">
                      {word}
                    </span>
                  ) : null
                )}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide text-white drop-shadow-md">
                {contents[activeTextIndex]?.paragraphWords.map((word, i) => {
                  const globalIndex = i + contents[activeTextIndex].headingWords.length;
                  return globalIndex < revealedWordCount ? (
                    <span key={`${activeTextIndex}-p-${i}`} className="jova-word mr-[0.28em]">
                      {word}
                    </span>
                  ) : null;
                })}
              </p>
            </div>

            <div className="absolute bottom-8 md:bottom-12 animate-bounce text-white/50 block">
              <span className="text-xs uppercase tracking-widest block mb-2">Scroll</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;