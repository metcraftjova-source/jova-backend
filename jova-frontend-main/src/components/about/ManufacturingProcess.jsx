import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';

import LightBulbSVG from './AnimatedSVG/LightBulbSVG';
import CpuSVG from './AnimatedSVG/CpuSVG';
import LayersSVG from './AnimatedSVG/LayersSVG';
import FactorySVG from './AnimatedSVG/FactorySVG';
import ShieldSVG from './AnimatedSVG/ShieldSVG';
import TruckSVG from './AnimatedSVG/TruckSVG';

/* ============================================================
    PROCESS STEPS
    ============================================================ */
const processSteps = [
  { id: '01', title: 'Research & Planning', description: 'Understanding needs and market research.', IconComponent: LightBulbSVG },
  { id: '02', title: 'Design & Engineering', description: 'Precision engineering and product design.', IconComponent: CpuSVG },
  { id: '03', title: 'Material Selection', description: 'Selecting the best quality raw materials.', IconComponent: LayersSVG },
  { id: '04', title: 'Precision Manufacturing', description: 'Advanced machinery and skilled experts.', IconComponent: FactorySVG },
  { id: '05', title: 'Quality Inspection', description: 'Rigorous testing at every production stage.', IconComponent: ShieldSVG },
  { id: '06', title: 'Packaging & Delivery', description: 'Safe packaging and timely global delivery.', IconComponent: TruckSVG }
];

function ProcessStepCard({ step }) {
  const [isHovered, setIsHovered] = useState(false);
  const SvgComponent = step.IconComponent;
  return (
    <div className="min-w-[280px] lg:min-w-0 lg:flex-1 flex flex-col items-center text-center group snap-center" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="mb-10 relative">
        <div className="w-32 h-32 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl border-t border-gray-700 shadow-2xl flex items-center justify-center relative z-10 group-hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute inset-0 bg-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-16 h-16 relative z-20 pointer-events-none"><SvgComponent isHovered={isHovered} reducedMotion={false} /></div>
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-orange-500/25 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="w-12 h-12 rounded-full bg-[#111] border-2 border-gray-800 text-orange-500 font-bold flex items-center justify-center mb-6 relative z-10 group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-colors duration-300 shadow-[0_0_15px_rgba(249,115,22,0)] group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]">{step.id}</div>
      <h3 className="text-white font-bold text-lg mb-3 px-2 group-hover:text-orange-400 transition-colors">{step.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed px-4 max-w-[250px]">{step.description}</p>
    </div>
  );
}

function StepArrow({ index = 0 }) {
  return (
    <div className="flex items-start justify-center pt-14 px-1 lg:px-0 shrink-0" aria-hidden="true">
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" className="text-orange-500/70 animate-arrow-flow" style={{ animationDelay: `${index * 0.18}s` }}>
        <path d="M1 10 H24 M17 3 L26 10 L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function ManufacturingProcess() {
  return (
    <section className="w-full bg-[#111315] py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-[1650px] mx-auto">
        <div className="text-center mb-20 relative z-10">
          <h4 className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-3">OUR MANUFACTURING PROCESS</h4>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">From Concept to <span className="text-orange-500">Completion</span></h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Every step above is protected by <span className="text-orange-500 font-semibold">TEHTER</span>, our AI-powered manufacturing data verification platform. It compares client requirements against nesting data before production.
          </p>
        </div>
        <div className="relative w-full">
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } @keyframes arrow-flow { 0%, 100% { transform: translateX(0); opacity: 0.6; } 50% { transform: translateX(6px); opacity: 1; } } .animate-arrow-flow { animation: arrow-flow 1.4s ease-in-out infinite; }`}</style>
          <div className="flex flex-nowrap items-start overflow-x-auto pb-12 snap-x hide-scrollbar relative z-10 gap-6 lg:gap-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {processSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <ProcessStepCard step={step} />
                {index < processSteps.length - 1 && <StepArrow index={index} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <TEHTERShowcase />
      </div>
    </section>
  );
}

/* ============================================================
    TEHTER CONTENT (WITH SLOW SCRAMBLE DECRYPTION EFFECT)
    ============================================================ */
const tehterPoints = [
  { label: 'What it is', text: 'TEHTER is an AI-powered manufacturing data verification platform — a verification layer between your client data, nesting output, and production planning.' },
  { label: 'Upload client data', text: 'Import the customer\'s part and quantity requirements as the source of truth for what needs to be produced.' },
  { label: 'Upload nesting data', text: 'Add the output from your nesting software, such as CypNest, so both sides of the job are on the table.' },
  { label: 'Compare', text: 'TEHTER automatically compares both datasets, checking quantities, parts, and material usage against each other.' },
  { label: 'Identify mismatches', text: 'Missing parts, extra quantities, and discrepancies are clearly highlighted — before they reach the shop floor.' },
  { label: 'Confirm & generate BOM', text: 'Validate the data, then generate and download a verified Bill of Materials — ready for production with confidence.' }
];
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/\\';

function TEHTERShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isLast = activeIndex === tehterPoints.length - 1;
  const isAnimating = useRef(false);
  const textRef = useRef(null);
  const labelRef = useRef(null);
  const scanRef = useRef(null);

  const goTo = (nextIndex) => {
    if (isAnimating.current || nextIndex === activeIndex) return;
    isAnimating.current = true;
    const nextPoint = tehterPoints[nextIndex];
    const finalText = nextPoint.text;
    const finalLabel = `${String(nextIndex + 1).padStart(2, '0')} / ${String(tehterPoints.length).padStart(2, '0')} — ${nextPoint.label}`;
    const tl = gsap.timeline({ onComplete: () => { setActiveIndex(nextIndex); isAnimating.current = false; } });

    tl.to(labelRef.current, { opacity: 0, y: -6, duration: 0.15, ease: 'power2.in' });
    tl.set(scanRef.current, { opacity: 1, x: '-100%' });
    tl.to(scanRef.current, { x: '100%', duration: 0.7, ease: 'power1.inOut' }, '<');
    tl.set(scanRef.current, { opacity: 0 }, '>-0.05');
    tl.call(() => { if (labelRef.current) labelRef.current.textContent = finalLabel; }, null, '-=0.55');
    tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '<');

    tl.to({}, {
      duration: 2.0,
      ease: 'none',
      onUpdate: function () {
        const progress = this.progress();
        const revealCount = Math.floor(progress * finalText.length);
        let out = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i < revealCount || finalText[i] === ' ') {
            out += finalText[i];
          } else {
            out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        if (textRef.current) {
          textRef.current.textContent = out;
        }
      },
      onComplete: () => { 
        if (textRef.current) textRef.current.textContent = finalText; 
      }
    }, '-=0.5');
  };

  const handleNext = () => goTo((activeIndex + 1) % tehterPoints.length);

  return (
    <div className="mt-28 pt-16 border-t border-white/5 relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Meet <span className="text-orange-500">TEHTER</span></h2>
        <p className="text-orange-500 font-semibold tracking-wider text-xs uppercase mt-3 mb-4">An AI Powered System</p>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">Your nesting software tells you how to cut. TEHTER helps you verify what to cut.</p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-8">
          {tehterPoints.map((point, i) => (
            <button key={point.label} type="button" onClick={() => goTo(i)} aria-label={`Go to step ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === activeIndex ? 'w-8 bg-orange-500' : 'w-1.5 bg-gray-700 hover:bg-gray-600'}`} />
          ))}
        </div>
        <div className="relative w-full min-h-[180px] flex flex-col items-center justify-center px-4 py-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
          <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-orange-500/40" />
          <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-orange-500/40" />
          <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-orange-500/40" />
          <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-orange-500/40" />
          <div ref={scanRef} className="absolute inset-y-0 left-0 w-24 pointer-events-none opacity-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.35), rgba(249,115,22,0.9), rgba(249,115,22,0.35), transparent)', filter: 'blur(1px)' }} />
          <span ref={labelRef} className="text-orange-500 font-mono text-xs tracking-widest uppercase mb-4">
            {String(activeIndex + 1).padStart(2, '0')} / {String(tehterPoints.length).padStart(2, '0')} — {tehterPoints[activeIndex].label}
          </span>
          <p ref={textRef} className="text-white text-lg md:text-2xl font-medium leading-relaxed max-w-2xl">{tehterPoints[activeIndex].text}</p>
        </div>

        <button type="button" onClick={handleNext} aria-label={isLast ? 'Restart' : 'Next'} className="mt-10 w-16 h-16 rounded-full bg-[#111] border-2 border-orange-500/40 hover:border-orange-500 flex items-center justify-center group transition-all duration-300 hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] cursor-pointer">
          {isLast ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500 group-hover:rotate-180 transition-transform duration-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2 A8.001 8.001 0 004.582 9 m0 0H9 m11 11v-5h-.581 m0 0a8.003 8.003 0 01-15.357-2 m15.357 2H15" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500 group-hover:translate-x-1 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          )}
        </button>
      </div>

      <TehterNeuralNetwork />
    </div>
  );
}

/* ============================================================
    TEHTER NEURAL NETWORK (PROPERLY SPACED T-E-H-T-E-R LETTERS)
    ============================================================ */
function TehterNeuralNetwork() {
  const canvasRef = useRef(null);
  const moduleRefs = useRef([]);
  const tehterLetterRefs = useRef([]);
  const containerRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [theme, setTheme] = useState('multicolor'); 
  const [showGrid, setShowGrid] = useState(true);

  // Live refs mirroring the toggle states above. The heavy effect below
  // (which builds the ~800-particle brain geometry) only depends on
  // [modules, theme, showGrid, tehterLetters] — NOT on autoRotate or
  // isFullscreen. Reading those two through refs instead lets Auto-Spin
  // and Fullscreen be toggled instantly, without tearing down every event
  // listener and regenerating the entire randomized particle cloud from
  // scratch (which was previously happening on every toggle: visible as
  // a flicker/pop as all ~800 points jumped to new random positions, plus
  // burning ~8000 rejection-sampling iterations for no visual reason).
  const autoRotateRef = useRef(autoRotate);
  const isFullscreenRef = useRef(isFullscreen);
  const resizeFnRef = useRef(() => {});

  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => {
    isFullscreenRef.current = isFullscreen;
    // The canvas needs a fresh size the moment fullscreen actually
    // changes (different height budget) — call the current resize
    // function directly rather than re-running the whole heavy effect.
    resizeFnRef.current();
  }, [isFullscreen]);

  const modules = useMemo(() => [
    { name: 'Suppliers', x: -280, y: 195, z: -100, color: '#22d3ee' },
    { name: 'Purchase', x: -180, y: 198, z: 90, color: '#a78bfa' },
    { name: 'Quotation', x: -80, y: 195, z: -110, color: '#60a5fa' },
    { name: 'Purchased', x: 20, y: 197, z: 60, color: '#34d399' },
    { name: 'Store', x: 160, y: 195, z: -80, color: '#fbbf24' },
    { name: 'Production', x: 70, y: 65, z: -20, color: '#f97316' },
    { name: 'Delivery', x: 260, y: 195, z: 80, color: '#38bdf8' }
  ], []);

  // Cleanly spaced out X coordinates so T-E-H-T-E-R letters do not overlap
  const tehterLetters = useMemo(() => [
    { char: 'T', x: -150, y: -50, z: -20, color: '#22d3ee', shadow: 'rgba(34,211,238,0.9)' }, // Cyan
    { char: 'E', x: -90,  y: -50, z:  20, color: '#c084fc', shadow: 'rgba(192,132,252,0.9)' }, // Purple
    { char: 'H', x: -30,  y: -50, z: -10, color: '#f97316', shadow: 'rgba(249,115,22,0.9)' },  // Orange
    { char: 'T', x:  30,  y: -50, z:  10, color: '#34d399', shadow: 'rgba(52,211,153,0.9)' },  // Green
    { char: 'E', x:  90,  y: -50, z: -20, color: '#fbbf24', shadow: 'rgba(251,191,36,0.9)' },  // Yellow
    { char: 'R', x:  150, y: -50, z:  20, color: '#38bdf8', shadow: 'rgba(56,189,248,0.9)' }   // Sky Blue
  ], []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let width, height;
    let nodes = [];
    let edges = [];
    let moduleNodeStartIndex = 0; // where module nodes begin in `nodes`/`proj`

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0.08, y: -0.15 }; 
    let targetRotation = { x: 0.08, y: -0.15 };

    const resize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = isFullscreenRef.current ? window.innerHeight : 720;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeFnRef.current = resize;

    function getNodeStyle() {
      const r = Math.random();
      if (theme === 'multicolor') {
        if (r > 0.90) return { c: '#ff3333', s: 2.2, isGlow: true }; 
        if (r > 0.78) return { c: '#ffcc00', s: 2.0, isGlow: true }; 
        if (r > 0.65) return { c: '#22d3ee', s: 1.8, isGlow: true }; 
        if (r > 0.50) return { c: '#c084fc', s: 1.8, isGlow: true }; 
        if (r > 0.35) return { c: '#f97316', s: 1.7, isGlow: true }; 
        return { c: '#0096c7', s: 1.0, isGlow: false };              
      } else if (theme === 'purple') {
        if (r > 0.92) return { c: '#ffffff', s: 2.2, isGlow: true };
        if (r > 0.75) return { c: '#d8b4fe', s: 1.8, isGlow: true };
        return { c: '#9333ea', s: 1.0, isGlow: false };
      } else if (theme === 'orange') {
        if (r > 0.92) return { c: '#ffffff', s: 2.2, isGlow: true };
        if (r > 0.75) return { c: '#fb923c', s: 1.8, isGlow: true };
        return { c: '#ea580c', s: 1.0, isGlow: false };
      } else {
        if (r > 0.92) return { c: '#ffffff', s: 2.2, isGlow: true };
        if (r > 0.75) return { c: '#38bdf8', s: 1.8, isGlow: true };
        return { c: '#0077b6', s: 1.0, isGlow: false };
      }
    }

    const initNetwork = () => {
      nodes = [];
      edges = [];

      // 1. HUMAN BRAIN VOLUME
      let brainCount = 0;
      let attempts = 0;
      while (brainCount < 400 && attempts < 8000) {
        attempts++;
        let nx = (Math.random() * 2 - 1);       
        let ny = (Math.random() * 2 - 1);       
        let nz = (Math.random() * 2.2 - 1.1);   

        // Subtle frontal taper: the "front" half (nz > 0) narrows in x
        // slightly compared to the fuller "back" half — real brains
        // aren't a perfectly symmetric egg, and this small asymmetry
        // reads as anatomical rather than a geometric primitive.
        const zTaper = nz > 0 ? 1 - nz * 0.14 : 1;
        let ellipsoid = (nx * nx) / (0.95 * zTaper * zTaper) + (ny * ny) / 0.62 + (nz * nz) / 1.15;
        if (ellipsoid > 1.0) continue;

        // Brainstem notch underneath, where the stem bridge below plugs in.
        if (ny > 0.1 && Math.abs(nx) > 0.4 && nz > -0.35 && nz < 0.35) continue;
        if (ny > 0.3 && Math.abs(nx) < 0.35 && nz < 0.3) continue;

        // Longitudinal fissure: a groove along the midline (nx ≈ 0) at
        // the crown of the brain (ny very negative = top), thinning out
        // as it goes deeper. This is what actually splits the point
        // cloud into two visible hemispheres from above, instead of
        // reading as one smooth blob with a slit cut out of it.
        const nearTop = Math.max(0, -ny - 0.35);
        const fissureChance = Math.exp(-(nx * nx) / 0.012) * Math.min(1, nearTop * 2.2);
        if (Math.random() < fissureChance * 0.92) continue;

        let x = nx * 290; 
        let y = ny * 110 - 85; 
        let z = nz * 185;

        // Classify by how close this point is to the outer boundary.
        // Points near the shell (ellipsoid ≈ 1) are what actually reads
        // as the brain's outline as it rotates — those get lit up.
        // Points deep in the interior just add visual noise if they're
        // drawn just as brightly, so they're dimmed down instead.
        const isSurface = ellipsoid > 0.78;
        let style = getNodeStyle();
        style.isGlow = isSurface;
        style.s = isSurface ? style.s * 1.15 : style.s * 0.55;
        nodes.push({ x, y, z, ...style, type: 'brain', brainRegion: isSurface ? 'surface' : 'core' });
        brainCount++;
      }

      // 1b. CEREBELLUM BULGE — a smaller, denser secondary lobe tucked
      // under the back of the main mass, right where the brainstem
      // would naturally lead into it. A second, smaller sphere reads as
      // recognizably "brain-like" from any rotation angle in a way a
      // single ellipsoid never quite does on its own.
      let cerebellumCount = 0;
      let cerebellumAttempts = 0;
      while (cerebellumCount < 70 && cerebellumAttempts < 3000) {
        cerebellumAttempts++;
        let cx = (Math.random() * 2 - 1);
        let cy = (Math.random() * 2 - 1);
        let cz = (Math.random() * 2 - 1);
        const sphereVal = (cx * cx) + (cy * cy) + (cz * cz);
        if (sphereVal > 1.0) continue;

        let x = cx * 95;
        let y = cy * 55 + 120;
        let z = cz * 70 - 150;

        const isSurface = sphereVal > 0.72;
        let style = getNodeStyle();
        style.isGlow = isSurface;
        style.s = isSurface ? style.s * 1.15 : style.s * 0.55;
        nodes.push({ x, y, z, ...style, type: 'brain', brainRegion: isSurface ? 'surface' : 'core' });
        cerebellumCount++;
      }

      // 2. EMBED T-E-H-T-E-R NODES
      tehterLetters.forEach(l => {
        nodes.push({
          x: l.x,
          y: l.y,
          z: l.z,
          c: l.color,
          s: 3.2,
          isGlow: true,
          type: 'tehter_letter',
          char: l.char
        });
      });

      // 3. BRAINSTEM BRIDGE
      const stemStart = { x: 25, y: -20, z: -15 }; 
      const stemEnd = { x: 55, y: 195, z: 0 };
      for (let i = 0; i < 35; i++) {
        let t = Math.random();
        let spread = 5 + (Math.pow(t, 2) * 18); 
        let angle = Math.random() * Math.PI * 2;
        
        let x = stemStart.x + (stemEnd.x - stemStart.x) * t + Math.cos(angle) * spread;
        let y = stemStart.y + (stemEnd.y - stemStart.y) * t;
        let z = stemStart.z + (stemEnd.z - stemStart.z) * t + Math.sin(angle) * spread;

        let style = getNodeStyle();
        nodes.push({ x, y, z, ...style, type: 'stem' });
      }

      // 4. FLOOR GRID NODES
      if (showGrid) {
        for (let i = 0; i < 350; i++) {
          let r = Math.sqrt(Math.random()) * 1150; 
          let theta = Math.random() * Math.PI * 2;
          let x = Math.cos(theta) * r;
          let z = Math.sin(theta) * r;
          let y = 195 + Math.sin(x * 0.015) * 15 + Math.cos(z * 0.015) * 15;

          let style = getNodeStyle();
          if (Math.random() > 0.45) style.isGlow = true;
          nodes.push({ x, y, z, ...style, type: 'floor' });
        }
      }

      // 5. EMBED MODULE NODES — record where these start so the render
      // loop can look their projected screen positions straight back up
      // in `proj` instead of recomputing the same trig a second time.
      moduleNodeStartIndex = nodes.length;
      modules.forEach((mod) => {
        nodes.push({
          x: mod.x,
          y: mod.y,
          z: mod.z,
          c: mod.color,
          s: 3.0,
          isGlow: true,
          type: 'module_node',
          name: mod.name
        });
      });

      // Connection Matrix
      for (let i = 0; i < nodes.length; i++) {
        let n1 = nodes[i];
        let connectedCount = 0;
        let maxConnections = n1.type === 'module_node' ? 6 : 3;

        for (let j = i + 1; j < nodes.length && connectedCount < maxConnections; j++) {
          let n2 = nodes[j];
          if (n1.type === 'brain' && n2.type === 'floor') continue;
          if (n1.type === 'floor' && n2.type === 'brain') continue;
          // Skip interior-to-interior brain connections entirely — wiring
          // up the dim core points just as densely as the shell buries
          // the outline in criss-crossing lines. Keeping only
          // surface-to-surface (and surface-to-core) connections makes
          // the visible mesh trace the actual shape of the brain.
          if (
            n1.type === 'brain' && n2.type === 'brain' &&
            n1.brainRegion === 'core' && n2.brainRegion === 'core'
          ) continue;

          let dx = n1.x - n2.x;
          let dy = n1.y - n2.y;
          let dz = n1.z - n2.z;
          let d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          let threshold = 55;
          if (n1.type === 'floor' || n2.type === 'floor') threshold = 110;
          if (n1.type === 'module_node' || n2.type === 'module_node') threshold = 160;

          if (d < threshold) {
            edges.push({ i, j, maxD: threshold });
            connectedCount++;
          }
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      if (autoRotateRef.current && !isDragging) {
        targetRotation.y += 0.003;
      }

      rotation.x += (targetRotation.x - rotation.x) * 0.06;
      rotation.y += (targetRotation.y - rotation.y) * 0.06;

      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);

      const proj = new Array(nodes.length);
      const fov = 540;

      for (let idx = 0; idx < nodes.length; idx++) {
        const n = nodes[idx];
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.z * cosY + n.x * sinY;
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + n.y * sinX;

        const safeZ = Math.max(-fov + 10, z2);
        const scale = fov / (fov + safeZ);
        
        const px = x1 * scale + width / 2;
        const py = y2 * scale + height / 2 + 10;
        
        const depthAlpha = Math.max(0.2, Math.min(1.0, 1 - (safeZ - 40) / 580));
        proj[idx] = { px, py, scale, z: safeZ, depthAlpha, node: n };
      }

      ctx.lineWidth = 0.6;
      for (let e = 0; e < edges.length; e++) {
        const p1 = proj[edges[e].i];
        const p2 = proj[edges[e].j];
        if (!p1 || !p2) continue;
        // Remaining core-to-surface brain connections still get dimmed
        // down (a fully-core-to-core edge is already skipped entirely
        // above), so the mesh itself reads as an outline rather than a
        // uniformly-bright tangle.
        const isDimBrainEdge =
          (p1.node.type === 'brain' && p1.node.brainRegion === 'core') ||
          (p2.node.type === 'brain' && p2.node.brainRegion === 'core');
        const edgeDim = isDimBrainEdge ? 0.35 : 1;
        const avgAlpha = (p1.depthAlpha + p2.depthAlpha) * 0.5 * edgeDim;
        
        const strokeColor = 
          theme === 'orange' ? `rgba(249, 115, 22, ${0.45 * avgAlpha})` :
          theme === 'purple' ? `rgba(168, 85, 247, ${0.45 * avgAlpha})` :
          theme === 'multicolor' ? `rgba(0, 180, 216, ${0.4 * avgAlpha})` :
          `rgba(56, 189, 248, ${0.45 * avgAlpha})`;

        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      for (let idx = 0; idx < proj.length; idx++) {
        const p = proj[idx];
        if (!p) continue;
        const rad = Math.max(0.25, p.node.s * p.scale);
        // Core (interior) brain points are already smaller and non-glow
        // from generation — dim their fill too, so the bright surface
        // shell is what actually stands out as the brain's outline.
        const regionDim = p.node.type === 'brain' && p.node.brainRegion === 'core' ? 0.3 : 1;

        if (p.node.isGlow) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, rad * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.node.c;
          ctx.globalAlpha = p.depthAlpha * 0.35 * regionDim;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
        ctx.fillStyle = p.node.c;
        ctx.globalAlpha = p.depthAlpha * regionDim;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      let letterIndex = 0;
      proj.forEach((p) => {
        if (p.node.type === 'tehter_letter') {
          const el = tehterLetterRefs.current[letterIndex];
          if (el) {
            el.style.transform = `translate(-50%, -50%) translate3d(${p.px}px, ${p.py}px, 0) scale(${Math.max(0.75, p.scale)})`;
            el.style.opacity = p.depthAlpha;
            el.style.zIndex = Math.floor(1000 - p.z);
          }
          letterIndex++;
        }
      });

      // Module labels reuse the projection already computed above for
      // these exact node indices — no need to redo the trig a second
      // time for the same seven points every frame.
      modules.forEach((mod, i) => {
        const el = moduleRefs.current[i];
        const p = proj[moduleNodeStartIndex + i];
        if (el && p) {
          el.style.transform = `translate(-50%, -50%) translate3d(${p.px}px, ${p.py}px, 0) scale(${Math.max(0.6, p.scale)})`;
          el.style.opacity = p.depthAlpha;
          el.style.zIndex = Math.floor(1000 - p.z);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleDown = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
      if (container) container.style.cursor = 'grabbing';
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.003;
      targetRotation.x += deltaY * 0.003;
      targetRotation.x = Math.max(-0.45, Math.min(0.55, targetRotation.x));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handleUp = () => {
      isDragging = false;
      if (container) container.style.cursor = 'grab';
    };

    if (container) {
      container.addEventListener('mousedown', handleDown);
      container.addEventListener('touchstart', handleDown, { passive: true });
    }
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleUp);
    window.addEventListener('resize', resize);
    
    resize();
    initNetwork();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
      if (container) {
        container.removeEventListener('mousedown', handleDown);
        container.removeEventListener('touchstart', handleDown);
      }
      cancelAnimationFrame(animationFrameId);
    };
    // Deliberately NOT depending on autoRotate/isFullscreen — see the refs
    // above. Regenerating the whole particle cloud only makes sense when
    // the geometry itself actually changes (theme/grid/modules/letters).
  }, [modules, theme, showGrid, tehterLetters]);

  return (
    <div className="max-w-[1650px] mx-auto mt-20 relative px-4">
      <p className="text-center text-orange-400 text-base md:text-lg font-bold tracking-wide mb-2" style={{ textShadow: '0 0 18px rgba(249,115,22,0.45)' }}>
        One Verified System, Start to Finish.
      </p>
      <p className="text-center text-gray-400 text-xs md:text-sm tracking-wider uppercase mb-8">
        Drag to rotate 3D neural architecture
      </p>

      <div 
        ref={containerRef} 
        className={`relative w-full mx-auto overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black cursor-grab select-none transition-all duration-300 ${isFullscreen ? 'h-screen rounded-none border-none' : 'h-[720px]'}`}
      >
        <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
        
        {/* Fullscreen Options Toolbar */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-xl">
          <button 
            type="button"
            onClick={() => setTheme(theme === 'multicolor' ? 'purple' : theme === 'purple' ? 'orange' : theme === 'orange' ? 'cyan' : 'multicolor')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
          >
            Theme: <span className="text-yellow-400 uppercase">{theme}</span>
          </button>

          <button 
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${autoRotate ? 'bg-orange-500 text-black font-bold' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            Auto-Spin: {autoRotate ? 'ON' : 'OFF'}
          </button>

          <button 
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${showGrid ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            Floor Grid: {showGrid ? 'SHOW' : 'HIDE'}
          </button>

          <button 
            type="button"
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
              ) : (
                // Standard 4-corner "maximize" icon. The previous version
                // of this path had a typo (a stray "v-40 4h-4" segment)
                // that produced a broken, garbled icon — replaced with a
                // clean, verified path.
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </>
              )}
            </svg>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>

        {/* Spaced Out Multi-Colored T-E-H-T-E-R Nodes */}
        {tehterLetters.map((l, i) => (
          <div 
            key={i} 
            ref={(el) => (tehterLetterRefs.current[i] = el)} 
            className="absolute top-0 left-0 flex flex-col items-center pointer-events-none" 
            style={{ willChange: 'transform, opacity', transformOrigin: 'center center' }}
          >
            <div 
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center backdrop-blur-md"
              style={{
                backgroundColor: `${l.color}20`,
                borderColor: l.color,
                boxShadow: `0 0 20px ${l.shadow}`
              }}
            >
              <span 
                className="font-mono text-xs font-black"
                style={{ color: l.color }}
              >
                {l.char}
              </span>
            </div>
          </div>
        ))}
        
        {/* Floor Process Workflow Modules */}
        {modules.map((m, i) => (
          <div key={m.name} ref={(el) => (moduleRefs.current[i] = el)} className="absolute top-0 left-0 flex flex-col items-center pointer-events-none" style={{ willChange: 'transform, opacity', transformOrigin: 'center center' }}>
            <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-white" style={{ textShadow: `0 2px 4px #000, 0 0 10px ${m.color}` }}>
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}