import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GlassIcon from "./GlassIcon";

gsap.registerPlugin(ScrollTrigger);

// One distinct color per step, loosely themed to the stage: cool blue for
// early consultation, purple for design, brand orange for manufacturing,
// green for quality/approval, pink for final delivery.
const stepColors = [
  { color: "#38bdf8", hoverColor: "#7dd3fc", glow: "rgba(56,189,248,0.9)" }, // 01 Consultation — blue
  { color: "#a78bfa", hoverColor: "#c4b5fd", glow: "rgba(167,139,250,0.9)" }, // 02 Design & Planning — purple
  { color: "#fb923c", hoverColor: "#fdba74", glow: "rgba(251,146,60,0.9)" }, // 03 Precision Manufacturing — orange
  { color: "#4ade80", hoverColor: "#86efac", glow: "rgba(74,222,128,0.9)" }, // 04 Quality Assurance — green
  { color: "#f472b6", hoverColor: "#f9a8d4", glow: "rgba(244,114,182,0.9)" }, // 05 Delivery & Installation — pink
];

const processSteps = [
  {
    id: "01",
    title: " Consultation",
    desc: "Understanding your project requirements to recommend practical and efficient solutions.",
    illustration: true,
    icon: (
      // Two people, full color — a flat vector illustration rather than
      // a single-color line icon.
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="17" cy="17" r="7" fill="#38bdf8" />
        <path d="M4 41c0-8 5.5-13 13-13s13 5 13 13" fill="#38bdf8" />
        <circle cx="31" cy="19" r="8" fill="#fb923c" />
        <path d="M17 42c0-9 6-14.5 14-14.5S45 33 45 42" fill="#fb923c" />
        <circle cx="24" cy="8" r="3" fill="#fef3c7" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Design & Planning",
    desc: "Developing clear designs and detailed plans to support smooth and efficient project execution.",
    illustration: true,
    icon: (
      // Building under a construction crane — full color flat vector
      // illustration.
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="42" width="40" height="2" fill="#475569" />
        <rect x="8" y="20" width="18" height="22" rx="1" fill="#94a3b8" />
        <rect x="11" y="24" width="4" height="4" fill="#e2e8f0" />
        <rect x="18" y="24" width="4" height="4" fill="#e2e8f0" />
        <rect x="11" y="31" width="4" height="4" fill="#e2e8f0" />
        <rect x="18" y="31" width="4" height="4" fill="#e2e8f0" />
        <rect x="14" y="37" width="6" height="5" fill="#64748b" />
        <path d="M33 36l3-30" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
        <path d="M37 36l-3-30" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
        <rect x="34" y="6" width="2.5" height="30" fill="#fb923c" />
        <rect x="20" y="8" width="17" height="2.5" fill="#fb923c" />
        <rect x="37" y="7" width="4" height="3" fill="#f59e0b" />
        <line x1="24" y1="10.5" x2="24" y2="18" stroke="#64748b" strokeWidth="1" />
        <rect x="22" y="18" width="4" height="3" fill="#facc15" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Precision Manufacturing",
    desc: "Producing high-quality sheet metal and architectural façade solutions using advanced manufacturing processes.",
    illustration: true,
    icon: (
      // Magnifying glass with a gear inside (precision) and a green
      // checkmark badge (quality checking) — full color flat vector
      // illustration.
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="13" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2.5" />
        <g fill="#0284c7">
          <rect x="18.5" y="8.5" width="3" height="4.5" />
          <rect x="18.5" y="27" width="3" height="4.5" />
          <rect x="7.5" y="18.5" width="4.5" height="3" />
          <rect x="28" y="18.5" width="4.5" height="3" />
          <circle cx="20" cy="20" r="5.5" />
        </g>
        <circle cx="20" cy="20" r="2.2" fill="#e0f2fe" />
        <rect x="27.5" y="27.5" width="5" height="15" rx="2.5" transform="rotate(45 30 35)" fill="#075985" />
        <circle cx="35" cy="13" r="8" fill="#22c55e" />
        <path d="M31 13l2.6 2.6L39 10.4" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Quality Assurance",
    desc: "Conducting thorough quality checks to ensure durability, accuracy, and consistent performance",
    illustration: true,
    icon: (
      // Shield + check, full color, with a glossy glass-like highlight
      // swept across the top-left — not just a flat solid fill.
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="shieldClip04">
            <path d="M24 4 L40 10 V23 C40 33.5 33 40.5 24 44 C15 40.5 8 33.5 8 23 V10 Z" />
          </clipPath>
          <linearGradient id="shieldGloss04" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M24 4 L40 10 V23 C40 33.5 33 40.5 24 44 C15 40.5 8 33.5 8 23 V10 Z"
          fill="#16a34a"
        />
        <path d="M24 4 L40 10 V23 C40 33.5 33 40.5 24 44 Z" fill="#22c55e" />
        <g clipPath="url(#shieldClip04)">
          <ellipse
            cx="15"
            cy="12"
            rx="15"
            ry="9"
            fill="url(#shieldGloss04)"
            transform="rotate(-25 15 12)"
          />
        </g>
        <path
          d="M16.5 23.5l5 5 10-10"
          stroke="#f0fdf4"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "05",
    title: "Delivery & Installation",
    desc: "Providing timely delivery and professional installation to ensure every project is completed successfully",
    illustration: true,
    icon: (
      // Package plus a wrench, installing it — full color flat vector
      // illustration.
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 18l12-6 12 6" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="8" y="18" width="24" height="6" fill="#ea580c" />
        <rect x="8" y="24" width="24" height="14" fill="#c2410c" />
        <rect x="18" y="18" width="4" height="20" fill="#9a3412" />
        <circle cx="14" cy="34" r="1.6" fill="#fbbf24" />
        <g transform="translate(29,3) rotate(35)">
          <path
            d="M4 2a4 4 0 1 0 3 6.6l7 7a1.4 1.4 0 0 0 2-2l-7-7A4 4 0 0 0 4 2z"
            fill="#94a3b8"
          />
          <rect x="12" y="12" width="14" height="4" rx="2" fill="#64748b" />
        </g>
      </svg>
    ),
  },
];

const stats = [
  { value: "500+", label: "Successful Projects Delivered" },
  { value: "15+", label: "Years of Engineering Excellence" },
  { value: "250+", label: "Experienced Professionals" },
  { value: "25+", label: "Industry Sectors Served" },
  { value: "1M+", label: "Sq. Ft. Precision Fabricated" },
  { value: "98%", label: "Customer Satisfaction Rate" },
];

const OurProcess = () => {
  const containerRef = useRef(null);
  const timelineLineRef = useRef(null);

  useGSAP(
    () => {
      // Parallax on title
      gsap.fromTo(
        ".process-title",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );

      // Setup timeline line length
      const lineLength = timelineLineRef.current.getTotalLength();
      gsap.set(timelineLineRef.current, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
      });

      // Create main sequence timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Draw timeline
      tl.to(
        timelineLineRef.current,
        {
          strokeDashoffset: 0,
          ease: "none",
          duration: 2,
        },
        0,
      );

      const steps = gsap.utils.toArray(".process-step");

      steps.forEach((step, i) => {
        // Sync startTime with the 2s timeline line drawing
        const startTime = (i / (steps.length - 1)) * 2;

        // 2. Glass Circle pops in
        const glassContainer = step.querySelector(".glass-icon-container");
        const glassCircle = step.querySelector(".glass-circle");

        tl.fromTo(
          glassContainer,
          { scale: 0.3, opacity: 0, rotationY: -15, rotationX: -5 },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            rotationX: 0,
            ease: "elastic.out(1, 0.5)",
            duration: 0.6,
          },
          startTime,
        );

        // 3. Icon draws itself
        const svgPaths = step.querySelectorAll(
          ".icon-svg path, .icon-svg circle, .icon-svg rect, .icon-svg polyline",
        );
        svgPaths.forEach((path) => {
          const pathLength = path.getTotalLength ? path.getTotalLength() : 100;
          tl.fromTo(
            path,
            { strokeDashoffset: pathLength, opacity: 0 },
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            startTime + 0.2,
          );
        });

        // 4. Reflection sweeps across
        const reflection = step.querySelector(".reflection-layer");
        tl.fromTo(
          reflection,
          { x: "-100%", y: "-100%", opacity: 0 },
          {
            x: "100%",
            y: "100%",
            opacity: 0.8,
            duration: 0.8,
            ease: "power1.inOut",
          },
          startTime + 0.3,
        );
        // Fade reflection back out slightly
        tl.to(reflection, { opacity: 0, duration: 0.2 }, startTime + 0.9);

        // 5. Text content fades in
        const textContent = step.querySelectorAll(".step-text");
        tl.fromTo(
          textContent,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" },
          startTime + 0.4,
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#0a0a0a] text-white pt-20 border-t border-white/5 flex flex-col font-sans overflow-hidden"
    >
      {/* Top Section: Process Timeline */}
      <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-12 flex flex-col xl:flex-row gap-12 xl:gap-8 items-start justify-between mb-24">
        {/* Left Title */}
        <div className="process-title flex flex-col items-start w-full xl:w-[25%] flex-shrink-0 relative z-20">
          <span className="text-[#ff6b00] font-bold text-[11px] tracking-widest uppercase mb-4 block">
            Our Proven Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">
            From Vision
            <br />
            To <span className="text-[#ff6b00]">Reality</span>
          </h2>
        </div>

        {/* Right Timeline */}
        <div className="w-full xl:w-[75%] relative mt-8 xl:mt-0">
          <div className="w-full flex pb-8 relative">
            {/* Animated SVG Timeline Line */}
            <div className="absolute top-[60px] left-[5%] right-[5%] h-[2px] z-0 pointer-events-none hidden md:block">
              <svg
                width="100%"
                height="2"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]"
              >
                <line
                  ref={timelineLineRef}
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="url(#orangeGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="orangeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(255,107,0,0.1)" />
                    <stop offset="50%" stopColor="rgba(255,107,0,1)" />
                    <stop offset="100%" stopColor="rgba(255,107,0,0.1)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex-shrink-0 relative px-4 w-full">
              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10 w-full items-center">
                {processSteps.map((step, index) => (
                  <div
                    key={`process-${step.id}`}
                    className="process-step group flex flex-col items-center text-center w-[200px]"
                  >
                    <GlassIcon
                      icon={step.icon}
                      id={step.id}
                      index={index}
                      color={stepColors[index]?.color}
                      hoverColor={stepColors[index]?.hoverColor}
                      glow={stepColors[index]?.glow}
                      illustration={step.illustration}
                    />

                    <div className="mt-6 flex flex-col items-center">
                      <span
                        className="block w-8 h-[2px] rounded-full mb-4 transition-all duration-300 group-hover:w-12"
                        style={{ backgroundColor: stepColors[index]?.color }}
                      />
                      <h3 className="step-text text-[13px] font-semibold mb-2 text-white">
                        {step.title}
                      </h3>
                      <p className="step-text text-[11px] leading-[1.6] max-w-[150px] text-gray-400">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Stats Bar */}
      {/* <div className="w-full bg-[#111111] border-y border-white/5 py-1 relative z-20">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 divide-x-0 lg:divide-x divide-white/10 py-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-center lg:justify-start gap-4 px-4">
                <div className="flex flex-col">
                  <span className="text-[#ff6b00] font-bold text-xl md:text-2xl">
                    {stat.value}
                  </span>
                  <span className="text-[#aaaaaa] text-[11px] uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default OurProcess;