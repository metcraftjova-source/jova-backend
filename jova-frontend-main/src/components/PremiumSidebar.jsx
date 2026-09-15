import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

/*
  Premium vertical sidebar — dark brushed-metal body, glassy layered "3D"
  icon buttons (depth via stacked shadow layer + raised gradient face,
  subtle tilt-on-hover), bronze glow on the active item.

  The logo is an inline SVG (not an external image import) so a wrong
  asset path can never cause a silent render failure / blank block.
*/

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    )
  },
  {
    to: '/about',
    label: 'About',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
      </>
    )
  },
  {
    to: '/Product',
    label: 'Product',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />
    )
  },
  {
    to: '/services',
    label: 'Services',
    icon: (
      <>
        <circle cx="12" cy="12" r="2.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 13.5a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V19.5a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H4.5a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V4.5a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H19.5a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </>
    )
  },
  {
    to: '/#contact',
    label: 'Contact',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    )
  }
];

// Inline SVG shield — same silhouette as the brand mark, no external file
// to break. Bronze-gradient fill so it reads as "premium metal" on its own.
const ShieldMark = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F0C888" />
        <stop offset="55%" stopColor="var(--bronze-bright, #D9A25C)" />
        <stop offset="100%" stopColor="#8a5f2e" />
      </linearGradient>
    </defs>
    <path
      d="M12 2l7 3v6c0 5-3.2 8.7-7 10-3.8-1.3-7-5-7-10V5l7-3z"
      fill="url(#shieldGrad)"
      stroke="#5c3d1c"
      strokeWidth="0.5"
    />
    <path
      d="M9 12.2l2 2 4-4.4"
      stroke="#1a1310"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const N = navItems.length; // 5 — the spark visits N evenly-spaced stops
const PERIOD_MS = 7000; // one full lap, top to bottom
const DWELL_FRAC = 0.62; // fraction of each stop's time-slice spent "arrived" vs traveling to the next

const PremiumSidebar = () => {
  const { pathname } = useLocation();
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  const [isIdle, setIsIdle] = useState(true);
  const idleTimerRef = useRef(null);

  const asideRef = useRef(null);
  const railRef = useRef(null);
  const sparkRef = useRef(null);
  const itemRefs = useRef([]);
  const igniteRefs = useRef([]);
  const stopsRef = useRef([]); // measured pixel Y of each icon's center, top to bottom
  const litIndexRef = useRef(-1); // which icon is currently lit, so DOM is only touched on change

  useEffect(() => {
    const markScrolling = () => {
      setIsIdle(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 400);
    };

    window.addEventListener('wheel', markScrolling, { passive: true });
    window.addEventListener('touchmove', markScrolling, { passive: true });
    window.addEventListener('scroll', markScrolling, { passive: true });
    return () => {
      window.removeEventListener('wheel', markScrolling);
      window.removeEventListener('touchmove', markScrolling);
      window.removeEventListener('scroll', markScrolling);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Measure each icon's real vertical center relative to the sidebar, so
  // the rail and the traveling dot line up with Home/About/Product/
  // Services/Contact exactly as laid out — not a guessed fixed spacing
  // that drifts whenever the flex layout sizes differently.
  useEffect(() => {
    const measure = () => {
      const asideTop = asideRef.current?.getBoundingClientRect().top ?? 0;
      stopsRef.current = itemRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top - asideTop + r.height / 2;
      });

      // Draw the rail spanning exactly from the first to the last icon
      // center, instead of a hardcoded height.
      if (railRef.current && stopsRef.current.length > 1) {
        const first = stopsRef.current[0];
        const last = stopsRef.current[stopsRef.current.length - 1];
        railRef.current.style.top = `${first}px`;
        railRef.current.style.height = `${last - first}px`;
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Drives only the spark dot's position along the rail — it travels
  // down through the REAL measured icon positions in order (Home first,
  // Contact last), dwells briefly at each one, then continues. It does
  // not trigger any glow/ignite effect on the icons it passes.
  useEffect(() => {
    let rafId;

    const tick = (now) => {
      const stops = stopsRef.current;
      if (stops.length < 2 || !sparkRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const n = stops.length;
      const cycle = (now % PERIOD_MS) / PERIOD_MS; // 0..1 over one lap
      const stopSpan = 1 / n;
      const stopIndex = Math.min(n - 1, Math.floor(cycle / stopSpan));
      const localT = (cycle - stopIndex * stopSpan) / stopSpan; // 0..1 within this stop's slice

      const isDwelling = localT < DWELL_FRAC;
      const isLastStop = stopIndex === n - 1;

      let topPx;
      let opacity = 1;

      if (isDwelling) {
        topPx = stops[stopIndex];
      } else if (isLastStop) {
        // Reached Contact and dwelled — fade out, then the next lap
        // restarts back at Home.
        topPx = stops[n - 1];
        const fadeT = (localT - DWELL_FRAC) / (1 - DWELL_FRAC);
        opacity = 1 - fadeT;
      } else {
        // Traveling from this stop to the next one, in order.
        const travelT = (localT - DWELL_FRAC) / (1 - DWELL_FRAC);
        topPx = stops[stopIndex] + (stops[stopIndex + 1] - stops[stopIndex]) * travelT;
      }

      sparkRef.current.style.top = `${topPx}px`;
      sparkRef.current.style.opacity = opacity;

      // Glow the icon the dot is currently sitting on — and only that
      // one. Driven from the same real dwell state as the dot's own
      // position, so the two can never drift out of sync.
      const nextLit = isDwelling ? stopIndex : -1;
      if (nextLit !== litIndexRef.current) {
        if (litIndexRef.current >= 0 && igniteRefs.current[litIndexRef.current]) {
          igniteRefs.current[litIndexRef.current].classList.remove('is-lit');
        }
        if (nextLit >= 0 && igniteRefs.current[nextLit]) {
          igniteRefs.current[nextLit].classList.add('is-lit');
        }
        litIndexRef.current = nextLit;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <aside
      ref={asideRef}
      className={`hidden lg:flex fixed left-0 top-0 h-screen w-[104px] z-50 flex-col items-center py-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] ${
        isIdle ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-full pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(160deg, #1a1512 0%, #0c0a08 45%, #050403 100%)',
        borderRight: '1px solid rgba(217,162,92,0.15)',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.03), 8px 0 30px rgba(0,0,0,0.5)'
      }}
    >
      <style>{`
        .sb-icon-3d {
          transform-style: preserve-3d;
          perspective: 300px;
        }
        .sb-icon-3d .sb-face {
          transition: transform 350ms cubic-bezier(0.34,1.5,0.64,1), box-shadow 350ms ease;
        }
        .sb-icon-3d:hover .sb-face {
          transform: rotateX(12deg) rotateY(-12deg) translateZ(4px);
        }
        .sb-icon-3d:active .sb-face {
          transform: rotateX(4deg) rotateY(-4deg) translateZ(1px) scale(0.96);
        }

        /* Idle float — each icon gently bobs, staggered so they never sync,
           giving the whole rail a living, motion-graphics feel at rest. */
        @keyframes sb-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .sb-float-wrap {
          animation: sb-float 3.6s ease-in-out infinite;
        }

        /* Rotating conic light sweep behind the active icon — reads like a
           scanning metallic glow orbiting the button. */
        @keyframes sb-orbit {
          to { transform: rotate(360deg); }
        }
        .sb-orbit-ring {
          position: absolute;
          inset: -3px;
          border-radius: 1rem;
          background: conic-gradient(from 0deg, transparent 0%, rgba(217,162,92,0.9) 15%, transparent 30%, transparent 100%);
          animation: sb-orbit 2.4s linear infinite;
          filter: blur(1px);
        }

        /* Specular sheen sweeping diagonally across each glass face on a
           loop — like light catching brushed metal. */
        @keyframes sb-sheen {
          0% { transform: translateX(-120%) translateY(-120%) rotate(25deg); opacity: 0; }
          8% { opacity: 0.5; }
          22% { opacity: 0; }
          100% { transform: translateX(120%) translateY(120%) rotate(25deg); opacity: 0; }
        }
        .sb-sheen {
          position: absolute;
          inset: -50%;
          background: linear-gradient(75deg, transparent 45%, rgba(255,255,255,0.35) 50%, transparent 55%);
          animation: sb-sheen 5s ease-in-out infinite;
          pointer-events: none;
          border-radius: inherit;
        }

        /* Slow ambient pulse on the logo, like a heartbeat glow. */
        @keyframes sb-logo-pulse {
          0%, 100% { box-shadow: 0 0 18px rgba(217,162,92,0.15), inset 0 1px 1px rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 28px rgba(217,162,92,0.35), inset 0 1px 1px rgba(255,255,255,0.12); }
        }
        .sb-logo-pulse {
          animation: sb-logo-pulse 3s ease-in-out infinite;
        }

        /* ===== Traveling current — the spark runs down the spine
           connecting every icon and dwells briefly at each stop, purely
           as a decorative "energy flowing through the system" cue. It
           does NOT trigger any glow/ignite change on the icons it visits
           — their appearance is unaffected as the dot passes. ===== */
        .sb-rail {
          position: absolute;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(217,162,92,0.05), rgba(217,162,92,0.18), rgba(217,162,92,0.05));
          z-index: 0;
        }
        .sb-spark {
          position: absolute;
          left: 50%;
          top: 0px;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          margin-top: -3px;
          border-radius: 999px;
          background: var(--bronze-bright, #D9A25C);
          box-shadow: 0 0 8px 2px rgba(217,162,92,0.9), 0 0 16px 4px rgba(217,162,92,0.4);
          z-index: 1;
        }

        /* Per-icon glow ring — dim by default, brightens only while the
           dot is really dwelling on that exact icon (JS-toggled .is-lit,
           driven from the same tick as the dot's own position). */
        .sb-ignite-ring {
          position: absolute;
          inset: -4px;
          border-radius: 1.1rem;
          border: 1.5px solid var(--bronze-bright, #D9A25C);
          pointer-events: none;
          opacity: 0;
          transform: scale(1);
          transition: opacity 250ms ease, transform 250ms ease;
        }
        .sb-ignite-ring.is-lit {
          opacity: 0.9;
          transform: scale(1.1);
          box-shadow: 0 0 14px 2px rgba(217,162,92,0.6);
        }
      `}</style>

      {/* Connecting spine + traveling spark, sits behind the icon column */}
      <div ref={railRef} className="sb-rail" />
      <div ref={sparkRef} className="sb-spark" />

      {/* Logo */}
      <div
        className="sb-logo-pulse relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shrink-0 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #2a2118, #0f0c09)',
          border: '1px solid rgba(217,162,92,0.35)'
        }}
      >
        <div className="sb-sheen" />
        <ShieldMark />
      </div>

      {/* Nav items */}
      <nav className="relative z-10 flex flex-col items-center gap-4 flex-1">
        {navItems.map((item, idx) => {
          const active = isActive(item.to);
          const content = (
            <div className="relative flex flex-col items-center group cursor-pointer sb-icon-3d">
              {active && (
                <span
                  className="absolute -inset-3 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(217,162,92,0.4) 0%, transparent 70%)',
                    filter: 'blur(8px)'
                  }}
                />
              )}

              {/* Layered "3D" button: base shadow layer + raised glass face,
                  idle-floating as a group so it feels animated at rest */}
              <div
                ref={(el) => (itemRefs.current[idx] = el)}
                className="sb-float-wrap relative w-14 h-14"
                style={{ animationDelay: `${idx * 0.35}s` }}
              >
                {/* Glow ring — brightens only while the dot is actually
                    dwelling on this exact icon */}
                <div
                  ref={(el) => (igniteRefs.current[idx] = el)}
                  className="sb-ignite-ring"
                />

                {/* Rotating orbit glow ring — only on the active item */}
                {active && <div className="sb-orbit-ring" />}

                {/* Depth shadow layer, sits behind, offset down-right */}
                <div
                  className="absolute inset-0 rounded-2xl translate-y-1 translate-x-0.5"
                  style={{ background: 'rgba(0,0,0,0.55)', filter: 'blur(2px)' }}
                />

                {/* Raised face */}
                <div
                  className="sb-face relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={
                    active
                      ? {
                          background: 'linear-gradient(145deg, #4a3a22, #1a1310)',
                          border: '1.5px solid var(--bronze-bright, #D9A25C)',
                          boxShadow:
                            '0 0 16px rgba(217,162,92,0.55), 0 0 32px rgba(217,162,92,0.25), inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)'
                        }
                      : {
                          background: 'linear-gradient(145deg, #2b241d, #100d0a)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -2px 3px rgba(0,0,0,0.5)'
                        }
                  }
                >
                  <div className="sb-sheen" style={{ animationDelay: `${idx * 0.6}s` }} />
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={active ? 'var(--bronze-bright, #D9A25C)' : '#a8a29a'}
                    strokeWidth="1.8"
                    className="relative z-10"
                    style={{ filter: active ? 'drop-shadow(0 0 4px rgba(217,162,92,0.6))' : 'none' }}
                  >
                    {item.icon}
                  </svg>
                </div>
              </div>

              <span
                className={`mt-1.5 text-[9px] font-semibold tracking-wide transition-colors duration-300 ${
                  active ? 'text-[var(--bronze-bright,#D9A25C)]' : 'text-gray-500 group-hover:text-gray-300'
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          return item.to.startsWith('/#') ? (
            <a key={item.label} href={item.to}>{content}</a>
          ) : (
            <Link key={item.label} to={item.to}>{content}</Link>
          );
        })}
      </nav>

      {/* Bottom tagline */}
      <div className="relative z-10 mt-auto pt-6 px-3 text-center">
        <div
          className="w-6 h-[2px] mx-auto mb-3 rounded-full"
          style={{ background: 'var(--bronze-bright, #D9A25C)' }}
        />
        <p className="text-[8px] font-bold tracking-[0.15em] text-gray-500 uppercase leading-relaxed">
          Engineering<br />Ideas Into<br />Reality
        </p>
      </div>
    </aside>
  );
};

export default PremiumSidebar;