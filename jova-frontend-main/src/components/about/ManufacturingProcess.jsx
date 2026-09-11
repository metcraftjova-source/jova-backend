import React, { useState, useRef } from 'react';
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
  {
    id: '01',
    title: 'Research & Planning',
    description: 'Understanding needs and market research.',
    IconComponent: LightBulbSVG
  },
  {
    id: '02',
    title: 'Design & Engineering',
    description: 'Precision engineering and product design.',
    IconComponent: CpuSVG
  },
  {
    id: '03',
    title: 'Material Selection',
    description: 'Selecting the best quality raw materials.',
    IconComponent: LayersSVG
  },
  {
    id: '04',
    title: 'Precision Manufacturing',
    description: 'Advanced machinery and skilled experts.',
    IconComponent: FactorySVG
  },
  {
    id: '05',
    title: 'Quality Inspection',
    description: 'Rigorous testing at every production stage.',
    IconComponent: ShieldSVG
  },
  {
    id: '06',
    title: 'Packaging & Delivery',
    description: 'Safe packaging and timely global delivery.',
    IconComponent: TruckSVG
  }
];


/* ============================================================
   PROCESS STEP CARD
   ============================================================ */

function ProcessStepCard({ step }) {
  const [isHovered, setIsHovered] = useState(false);
  const SvgComponent = step.IconComponent;

  return (
    <div
      className="
        min-w-[280px]
        lg:min-w-0
        lg:flex-1
        flex
        flex-col
        items-center
        text-center
        group
        snap-center
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D-like Icon Podium */}
      <div className="mb-10 relative">

        {/* Base */}
        <div
          className="
            w-32
            h-32
            bg-gradient-to-b
            from-[#1a1a1a]
            to-[#0a0a0a]
            rounded-xl
            border-t
            border-gray-700
            shadow-2xl
            flex
            items-center
            justify-center
            relative
            z-10
            group-hover:-translate-y-2
            transition-transform
            duration-500
          "
        >

          {/* Inner glow */}
          <div
            className="
              absolute
              inset-0
              bg-orange-500/5
              rounded-xl
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
            "
          />

          <div className="w-16 h-16 relative z-20 pointer-events-none">
            <SvgComponent
              isHovered={isHovered}
              reducedMotion={false}
            />
          </div>
        </div>

        {/* Podium shadow */}
        <div
          className="
            absolute
            -bottom-4
            left-1/2
            -translate-x-1/2
            w-24
            h-4
            bg-orange-500/20
            blur-xl
            rounded-full
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-500
          "
        />
      </div>


      {/* Number */}
      <div
        className="
          w-12
          h-12
          rounded-full
          bg-[#111]
          border-2
          border-gray-800
          text-orange-500
          font-bold
          flex
          items-center
          justify-center
          mb-6
          relative
          z-10
          group-hover:border-orange-500
          group-hover:bg-orange-500/10
          transition-colors
          duration-300
          shadow-[0_0_15px_rgba(249,115,22,0)]
          group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]
        "
      >
        {step.id}
      </div>


      {/* Text */}
      <h3
        className="
          text-white
          font-bold
          text-lg
          mb-3
          px-2
          group-hover:text-orange-400
          transition-colors
        "
      >
        {step.title}
      </h3>

      <p
        className="
          text-gray-400
          text-sm
          leading-relaxed
          px-4
          max-w-[250px]
        "
      >
        {step.description}
      </p>
    </div>
  );
}


/* ============================================================
   STEP ARROW
   ============================================================ */

function StepArrow({ index = 0 }) {
  return (
    <div
      className="
        flex
        items-start
        justify-center
        pt-14
        px-1
        lg:px-0
        shrink-0
      "
      aria-hidden="true"
    >
      <svg
        width="32"
        height="20"
        viewBox="0 0 32 20"
        fill="none"
        className="text-orange-500/70 animate-arrow-flow"
        style={{
          animationDelay: `${index * 0.18}s`
        }}
      >
        <path
          d="M1 10 H24 M17 3 L26 10 L17 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function ManufacturingProcess() {
  return (
    <section
      className="
        w-full
        bg-[#111315]
        py-24
        px-4
        relative
        overflow-hidden
      "
    >

      {/* Background */}
      <div
        className="
          absolute
          top-0
          left-1/4
          w-96
          h-96
          bg-orange-500/5
          blur-[120px]
          rounded-full
          pointer-events-none
        "
      />

      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div
          className="
            text-center
            mb-20
            relative
            z-10
          "
        >
          <h4
            className="
              text-orange-500
              font-semibold
              tracking-wider
              text-sm
              uppercase
              mb-3
            "
          >
            OUR MANUFACTURING PROCESS
          </h4>

          <h2
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-white
              mb-6
            "
          >
            From Concept to{' '}
            <span className="text-orange-500">
              Completion
            </span>
          </h2>

          <p
            className="
              text-gray-400
              text-sm
              md:text-base
              max-w-2xl
              mx-auto
              leading-relaxed
            "
          >
            Every step above is protected by{' '}
            <span className="text-orange-500 font-semibold">
              TEHTER
            </span>
            , our AI-powered manufacturing data verification
            platform. It compares client requirements against
            nesting data before production — catching quantity
            mismatches, missing parts, and material inconsistencies
            before they become costly errors.
          </p>
        </div>


        {/* Process Timeline */}
        <div className="relative w-full">

          <style>
            {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }

              @keyframes arrow-flow {
                0%, 100% {
                  transform: translateX(0);
                  opacity: 0.6;
                }

                50% {
                  transform: translateX(6px);
                  opacity: 1;
                }
              }

              .animate-arrow-flow {
                animation:
                  arrow-flow
                  1.4s
                  ease-in-out
                  infinite;
              }
            `}
          </style>

          <div
            className="
              flex
              flex-nowrap
              items-start
              overflow-x-auto
              pb-12
              snap-x
              hide-scrollbar
              relative
              z-10
              gap-6
              lg:gap-0
            "
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {processSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <ProcessStepCard step={step} />

                {index < processSteps.length - 1 && (
                  <StepArrow index={index} />
                )}
              </React.Fragment>
            ))}
          </div>


          {/* Mobile Scroll Indicator */}
          <div
            className="
              lg:hidden
              flex
              flex-col
              items-center
              mt-4
            "
          >
            <p
              className="
                text-gray-500
                text-xs
                mb-3
              "
            >
              Scroll to see the process in action
            </p>

            <div
              className="
                w-32
                h-1
                bg-gray-800
                rounded-full
                overflow-hidden
              "
            >
              <div
                className="
                  w-1/3
                  h-full
                  bg-orange-500
                  rounded-full
                  animate-pulse
                "
              />
            </div>
          </div>

        </div>


        {/* TEHTER */}
        <TEHTERShowcase />

      </div>
    </section>
  );
}


/* ============================================================
   TEHTER CONTENT
   ============================================================ */

const tehterPoints = [
  {
    label: 'What it is',
    text: 'TEHTER is an AI-powered manufacturing data verification platform — a verification layer between your client data, nesting output, and production planning.'
  },
  {
    label: 'Upload client data',
    text: 'Import the customer\'s part and quantity requirements as the source of truth for what needs to be produced.'
  },
  {
    label: 'Upload nesting data',
    text: 'Add the output from your nesting software, such as CypNest, so both sides of the job are on the table.'
  },
  {
    label: 'Compare',
    text: 'TEHTER automatically compares both datasets, checking quantities, parts, and material usage against each other.'
  },
  {
    label: 'Identify mismatches',
    text: 'Missing parts, extra quantities, and discrepancies are clearly highlighted — before they reach the shop floor.'
  },
  {
    label: 'Confirm & generate BOM',
    text: 'Validate the data, then generate and download a verified Bill of Materials — ready for production with confidence.'
  }
];

const SCRAMBLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/\\';


/* ============================================================
   TEHTER SHOWCASE
   ============================================================ */

function TEHTERShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast =
    activeIndex === tehterPoints.length - 1;

  const isAnimating = useRef(false);

  const textRef = useRef(null);
  const labelRef = useRef(null);
  const scanRef = useRef(null);
  const cardRef = useRef(null);


  const goTo = (nextIndex) => {
    if (
      isAnimating.current ||
      nextIndex === activeIndex
    ) {
      return;
    }

    isAnimating.current = true;

    const nextPoint = tehterPoints[nextIndex];

    const finalText = nextPoint.text;

    const finalLabel =
      `${String(nextIndex + 1).padStart(2, '0')} / ` +
      `${String(tehterPoints.length).padStart(2, '0')} — ` +
      `${nextPoint.label}`;


    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex);
        isAnimating.current = false;
      }
    });


    /* Label fade */
    tl.to(
      labelRef.current,
      {
        opacity: 0,
        y: -6,
        duration: 0.15,
        ease: 'power2.in'
      }
    );


    /* Scan */
    tl.set(
      scanRef.current,
      {
        opacity: 1,
        x: '-100%'
      }
    );

    tl.to(
      scanRef.current,
      {
        x: '100%',
        duration: 0.7,
        ease: 'power1.inOut'
      },
      '<'
    );

    tl.set(
      scanRef.current,
      {
        opacity: 0
      },
      '>-0.05'
    );


    /* New label */
    tl.call(
      () => {
        if (labelRef.current) {
          labelRef.current.textContent =
            finalLabel;
        }
      },
      null,
      '-=0.55'
    );

    tl.to(
      labelRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      },
      '<'
    );


    /* Text scramble */
    tl.to(
      {},
      {
        duration: 0.75,
        ease: 'none',

        onUpdate: function () {
          const progress = this.progress();

          const revealCount =
            Math.floor(
              progress * finalText.length
            );

          let out = '';

          for (
            let i = 0;
            i < finalText.length;
            i++
          ) {
            if (
              i < revealCount ||
              finalText[i] === ' '
            ) {
              out += finalText[i];
            } else {
              out +=
                SCRAMBLE_CHARS[
                  Math.floor(
                    Math.random() *
                    SCRAMBLE_CHARS.length
                  )
                ];
            }
          }

          if (textRef.current) {
            textRef.current.textContent = out;
          }
        },

        onComplete: () => {
          if (textRef.current) {
            textRef.current.textContent =
              finalText;
          }
        }
      },
      '-=0.5'
    );
  };


  const handleNext = () => {
    goTo(
      (activeIndex + 1) %
      tehterPoints.length
    );
  };


  return (
    <div
      className="
        mt-28
        pt-16
        border-t
        border-white/5
        relative
        z-10
      "
    >

      {/* Heading */}
      <div className="text-center mb-12">

        <h2
          className="
            text-3xl
            md:text-4xl
            font-bold
            text-white
          "
        >
          Meet{' '}
          <span className="text-orange-500">
            TEHTER
          </span>
        </h2>

        <p
          className="
            text-orange-500
            font-semibold
            tracking-wider
            text-xs
            uppercase
            mt-3
            mb-4
          "
        >
          An AI Powered System
        </p>

        <p
          className="
            text-gray-400
            text-sm
            md:text-base
            max-w-xl
            mx-auto
            leading-relaxed
          "
        >
          Your nesting software tells you how to cut.
          TEHTER helps you verify what to cut.
        </p>

      </div>


      <div
        className="
          max-w-3xl
          mx-auto
          flex
          flex-col
          items-center
          text-center
        "
      >

        {/* Progress dots */}
        <div
          className="
            flex
            items-center
            gap-2
            mb-8
          "
        >
          {tehterPoints.map((point, i) => (
            <button
              key={point.label}
              onClick={() => goTo(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-500
                cursor-pointer
                ${
                  i === activeIndex
                    ? 'w-8 bg-orange-500'
                    : 'w-1.5 bg-gray-700 hover:bg-gray-600'
                }
              `}
            />
          ))}
        </div>


        {/* Content Card */}
        <div
          ref={cardRef}
          className="
            relative
            w-full
            min-h-[180px]
            flex
            flex-col
            items-center
            justify-center
            px-4
            py-6
            rounded-2xl
            border
            border-white/5
            bg-gradient-to-b
            from-white/[0.02]
            to-transparent
            overflow-hidden
          "
        >

          {/* Corner ticks */}
          <span
            className="
              absolute
              top-3
              left-3
              w-3
              h-3
              border-t
              border-l
              border-orange-500/40
            "
          />

          <span
            className="
              absolute
              top-3
              right-3
              w-3
              h-3
              border-t
              border-r
              border-orange-500/40
            "
          />

          <span
            className="
              absolute
              bottom-3
              left-3
              w-3
              h-3
              border-b
              border-l
              border-orange-500/40
            "
          />

          <span
            className="
              absolute
              bottom-3
              right-3
              w-3
              h-3
              border-b
              border-r
              border-orange-500/40
            "
          />


          {/* Scan line */}
          <div
            ref={scanRef}
            className="
              absolute
              inset-y-0
              left-0
              w-24
              pointer-events-none
              opacity-0
            "
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(249,115,22,0.35), rgba(249,115,22,0.9), rgba(249,115,22,0.35), transparent)',
              filter: 'blur(1px)'
            }}
          />


          <span
            ref={labelRef}
            className="
              text-orange-500
              font-mono
              text-xs
              tracking-widest
              uppercase
              mb-4
            "
          >
            {String(activeIndex + 1).padStart(2, '0')}
            {' / '}
            {String(tehterPoints.length).padStart(2, '0')}
            {' — '}
            {tehterPoints[activeIndex].label}
          </span>


          <p
            ref={textRef}
            className="
              text-white
              text-lg
              md:text-2xl
              font-medium
              leading-relaxed
              max-w-2xl
            "
          >
            {tehterPoints[activeIndex].text}
          </p>

        </div>


        {/* Next */}
        <button
          onClick={handleNext}
          aria-label="Next"
          className="
            mt-10
            w-16
            h-16
            rounded-full
            bg-[#111]
            border-2
            border-orange-500/40
            hover:border-orange-500
            flex
            items-center
            justify-center
            group
            transition-all
            duration-300
            hover:shadow-[0_0_25px_rgba(249,115,22,0.35)]
            cursor-pointer
          "
        >
          {isLast ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="
                text-orange-500
                group-hover:rotate-180
                transition-transform
                duration-500
              "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="
                  M4 4v5h.582m15.356 2
                  A8.001 8.001 0 004.582 9
                  m0 0H9
                  m11 11v-5h-.581
                  m0 0a8.003 8.003 0
                  01-15.357-2
                  m15.357 2H15
                "
              />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="
                text-orange-500
                group-hover:translate-x-1
                transition-transform
                duration-300
              "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>

        <span
          className="
            text-gray-500
            text-xs
            mt-3
            uppercase
            tracking-widest
          "
        >
          {isLast ? 'Restart' : 'Next'}
        </span>

      </div>


      {/* Root System */}
      <TehterRoots />

    </div>
  );
}


/* ============================================================
   ROOT GEOMETRY HELPERS
   ============================================================ */

function sampleCubic(seg, steps = 24) {
  const pts = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;

    const x =
      mt * mt * mt * seg.p0[0] +
      3 * mt * mt * t * seg.c1[0] +
      3 * mt * t * t * seg.c2[0] +
      t * t * t * seg.p1[0];

    const y =
      mt * mt * mt * seg.p0[1] +
      3 * mt * mt * t * seg.c1[1] +
      3 * mt * t * t * seg.c2[1] +
      t * t * t * seg.p1[1];

    pts.push([x, y]);
  }

  return pts;
}


function sampleQuad(p0, pc, p1, steps = 12) {
  const pts = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;

    const x =
      mt * mt * p0[0] +
      2 * mt * t * pc[0] +
      t * t * p1[0];

    const y =
      mt * mt * p0[1] +
      2 * mt * t * pc[1] +
      t * t * p1[1];

    pts.push([x, y]);
  }

  return pts;
}


function rootSegment(prev, curr) {
  const midY =
    (prev.y + curr.y) / 2;

  return {
    p0: [prev.x, prev.y],
    c1: [prev.x, midY],
    c2: [curr.x, midY],
    p1: [curr.x, curr.y]
  };
}


function taperedPath(
  points,
  wStart,
  wEnd
) {
  const n = points.length;

  const top = [];
  const bottom = [];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);

    const w =
      wStart +
      (wEnd - wStart) * t;

    const prev =
      points[Math.max(0, i - 1)];

    const next =
      points[Math.min(n - 1, i + 1)];

    const dx =
      next[0] - prev[0];

    const dy =
      next[1] - prev[1];

    const len =
      Math.hypot(dx, dy) || 1;

    const nx =
      -dy / len;

    const ny =
      dx / len;

    top.push([
      points[i][0] +
        (nx * w) / 2,
      points[i][1] +
        (ny * w) / 2
    ]);

    bottom.push([
      points[i][0] -
        (nx * w) / 2,
      points[i][1] -
        (ny * w) / 2
    ]);
  }

  let d =
    `M ${top[0][0].toFixed(1)} ${top[0][1].toFixed(1)} `;

  for (let i = 1; i < top.length; i++) {
    d +=
      `L ${top[i][0].toFixed(1)} ${top[i][1].toFixed(1)} `;
  }

  for (
    let i = bottom.length - 1;
    i >= 0;
    i--
  ) {
    d +=
      `L ${bottom[i][0].toFixed(1)} ${bottom[i][1].toFixed(1)} `;
  }

  d += 'Z';

  return d;
}


function rootlet(
  origin,
  angleDeg,
  length,
  curveOffset,
  wStart,
  wEnd
) {
  const rad =
    (angleDeg * Math.PI) / 180;

  const end = [
    origin[0] +
      Math.cos(rad) * length,

    origin[1] +
      Math.sin(rad) * length
  ];

  const normalRad =
    rad + Math.PI / 2;

  const mid = [
    (origin[0] + end[0]) / 2 +
      Math.cos(normalRad) *
        curveOffset,

    (origin[1] + end[1]) / 2 +
      Math.sin(normalRad) *
        curveOffset
  ];

  const points =
    sampleQuad(
      origin,
      mid,
      end,
      12
    );

  return {
    path: taperedPath(
      points,
      wStart,
      wEnd
    ),
    points
  };
}


/* ============================================================
   PRODUCTION INDEX
   ============================================================ */

const PRODUCTION_INDEX = 5;


/* ============================================================
   TEHTER ROOTS
   ============================================================ */

function TehterRoots() {

  const W = 1400;
  const H = 640;


  /* ----------------------------------------------------------
     MODULE COLORS
     ---------------------------------------------------------- */

  const modules = React.useMemo(
    () => [
      {
        name: 'Suppliers',
        x: 100,
        y: 560,

        color: '#22d3ee',
        colorSoft: '#67e8f9',
        colorDark: '#0891b2',

        icon: <IconSuppliers />
      },

      {
        name: 'Purchase',
        x: 300,
        y: 440,

        color: '#a78bfa',
        colorSoft: '#c4b5fd',
        colorDark: '#7c3aed',

        icon: <IconPurchase />
      },

      {
        name: 'Quotation',
        x: 480,
        y: 590,

        color: '#60a5fa',
        colorSoft: '#93c5fd',
        colorDark: '#2563eb',

        icon: <IconQuotation />
      },

      {
        name: 'Purchased',
        x: 700,
        y: 460,

        color: '#34d399',
        colorSoft: '#6ee7b7',
        colorDark: '#059669',

        icon: <IconPurchased />
      },

      {
        name: 'Store',
        x: 920,
        y: 590,

        color: '#fbbf24',
        colorSoft: '#fde68a',
        colorDark: '#d97706',

        icon: <IconStore />
      },

      {
        name: 'Production',
        x: 1100,
        y: 440,

        color: '#f97316',
        colorSoft: '#fed7aa',
        colorDark: '#dc2626',

        isPhoenix: true,

        icon: <PhoenixIcon />
      },

      {
        name: 'Delivery',
        x: 1300,
        y: 560,

        color: '#38bdf8',
        colorSoft: '#7dd3fc',
        colorDark: '#0284c7',

        icon: <IconDelivery />
      }
    ],
    []
  );


  /* ----------------------------------------------------------
     HUB
     ---------------------------------------------------------- */

  const hub = React.useMemo(
    () => ({
      x: 700,
      y: 70
    }),
    []
  );


  /* ----------------------------------------------------------
     ROOT GEOMETRY
     ---------------------------------------------------------- */

  const {
    branches,
    rootletShapes,
    hubFeeders
  } = React.useMemo(() => {

    const TIP_W = 3;
    const HUB_W = 16;

    const branches = [];
    const rootletShapes = [];


    modules.forEach((m, i) => {

      const seg =
        rootSegment(
          hub,
          m
        );

      const pts =
        sampleCubic(
          seg,
          28
        );

      const shape =
        taperedPath(
          pts,
          HUB_W,
          TIP_W
        );

      const centerline =
        `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} ` +
        pts
          .slice(1)
          .map(
            (p) =>
              `L ${p[0].toFixed(1)} ${p[1].toFixed(1)} `
          )
          .join('');


      branches.push({
        shape,
        centerline
      });


      /* Rootlets */

      const branchAt = [
        5,
        9,
        13,
        17,
        21,
        25
      ];


      branchAt.forEach(
        (sampleIdx, bi) => {

          const origin =
            pts[sampleIdx];

          const before =
            pts[
              Math.max(
                0,
                sampleIdx - 3
              )
            ];

          const after =
            pts[
              Math.min(
                pts.length - 1,
                sampleIdx + 3
              )
            ];

          const baseAngle =
            (
              Math.atan2(
                after[1] - before[1],
                after[0] - before[0]
              ) *
              180
            ) / Math.PI;

          const seed =
            i * 6 + bi;

          const t =
            sampleIdx /
            (pts.length - 1);

          const localW =
            HUB_W +
            (TIP_W - HUB_W) *
              t;


          const angleA =
            baseAngle +
            80 +
            ((seed * 7) % 30);

          const angleB =
            baseAngle -
            80 -
            ((seed * 5) % 28);


          const lengthA =
            30 +
            ((seed * 11) % 40);

          const lengthB =
            26 +
            ((seed * 9) % 34);


          const curveA =
            12 +
            (seed % 3) * 8;

          const curveB =
            -10 -
            (seed % 2) * 10;


          const rA =
            rootlet(
              origin,
              angleA,
              lengthA,
              curveA,
              Math.max(
                2,
                localW * 0.3
              ),
              0.7
            );


          const rB =
            rootlet(
              origin,
              angleB,
              lengthB,
              curveB,
              Math.max(
                1.6,
                localW * 0.24
              ),
              0.7
            );


          rootletShapes.push(
            rA.path,
            rB.path
          );


          /* Second generation */

          [4, 8].forEach(
            (forkIdx, fi) => {

              if (
                forkIdx >=
                rA.points.length
              ) {
                return;
              }

              const fSeed =
                seed * 3 + fi;


              const forkOriginA =
                rA.points[
                  forkIdx
                ];


              const rForkA =
                rootlet(
                  forkOriginA,

                  angleA +
                    40 +
                    ((fSeed * 13) % 26),

                  lengthA *
                    (
                      0.4 +
                      (fSeed % 3) *
                        0.08
                    ),

                  curveA * 0.6,

                  Math.max(
                    1,
                    localW * 0.12
                  ),

                  0.5
                );


              rootletShapes.push(
                rForkA.path
              );


              const forkOriginB =
                rB.points[
                  Math.min(
                    forkIdx,
                    rB.points.length - 1
                  )
                ];


              const rForkB =
                rootlet(
                  forkOriginB,

                  angleB -
                    38 -
                    ((fSeed * 11) % 24),

                  lengthB *
                    (
                      0.4 +
                      (fSeed % 2) *
                        0.1
                    ),

                  curveB * 0.6,

                  Math.max(
                    1,
                    localW * 0.1
                  ),

                  0.5
                );


              rootletShapes.push(
                rForkB.path
              );
            }
          );
        }
      );
    });


    /* Hub feeder roots */

    const hubFeederAngles = [
      65,
      75,
      85,
      95,
      105,
      115,
      55,
      125,
      70,
      110
    ];


    const hubFeeders =
      hubFeederAngles.map(
        (a, i) =>
          rootlet(
            [
              hub.x,
              hub.y + 6
            ],
            a,
            45 +
              (i % 4) * 14,
            i % 2 === 0
              ? 10
              : -10,
            4.5,
            0.6
          ).path
      );


    return {
      branches,
      rootletShapes,
      hubFeeders
    };

  }, [modules, hub]);


  const pct = (v, total) =>
    `${(v / total) * 100}%`;


  /* ----------------------------------------------------------
     ANIMATION REFS
     ---------------------------------------------------------- */

  const centerlineRefs =
    useRef([]);

  const pulseRefs =
    useRef([]);

  const iconGlowRefs =
    useRef([]);

  const flameBurstRefs =
    useRef([]);

  const iconWasTouching =
    useRef([]);

  const burstTimeouts =
    useRef([]);


  /* ----------------------------------------------------------
     ONE-SHOT NODE BURST
     ---------------------------------------------------------- */

  const fireBurst = (
    index,
    className,
    duration
  ) => {

    const el =
      iconGlowRefs.current[index];

    if (!el) {
      return;
    }


    clearTimeout(
      burstTimeouts.current[index]
    );


    /* Remove old animation */

    el.classList.remove(
      'node-ignite',
      'node-release'
    );


    /* Force reflow */

    void el.offsetWidth;


    /* Start new animation */

    el.classList.add(
      className
    );


    burstTimeouts.current[index] =
      setTimeout(() => {

        el.classList.remove(
          className
        );

      }, duration);
  };


  /* ----------------------------------------------------------
     PULSE ANIMATION
     ---------------------------------------------------------- */

  React.useEffect(() => {

    const PERIOD = 7000;

    const STAGGER = 700;

    const TOUCH_START = 0.48;

    const TOUCH_END = 0.52;


    let rafId;

    let lengths = null;


    const measure = () => {

      lengths =
        centerlineRefs.current.map(
          (el) =>
            el
              ? el.getTotalLength()
              : 0
        );
    };


    const tick = (now) => {

      if (!lengths) {
        measure();
      }


      branches.forEach(
        (_, i) => {

          const raw =
            (
              (
                now -
                i * STAGGER
              ) %
                PERIOD +
              PERIOD
            ) %
            PERIOD;


          const p =
            raw / PERIOD;


          let t;


          /* Travel toward module */

          if (
            p < TOUCH_START
          ) {

            t =
              p /
              TOUCH_START;

          }

          /* Hold */

          else if (
            p < TOUCH_END
          ) {

            t = 1;

          }

          /* Return */

          else {

            t =
              1 -
              (
                p -
                TOUCH_END
              ) /
              (
                1 -
                TOUCH_END
              );
          }


          const pathEl =
            centerlineRefs.current[i];

          const circleEl =
            pulseRefs.current[i];


          if (
            pathEl &&
            circleEl &&
            lengths[i]
          ) {

            const pt =
              pathEl.getPointAtLength(
                t * lengths[i]
              );


            circleEl.setAttribute(
              'cx',
              pt.x.toFixed(2)
            );

            circleEl.setAttribute(
              'cy',
              pt.y.toFixed(2)
            );
          }


          /* --------------------------------------------------
             TOUCH STATE
             -------------------------------------------------- */

          const touching =
            p >= TOUCH_START &&
            p <= TOUCH_END;


          const flameEl =
            flameBurstRefs.current[i];


          if (flameEl) {

            flameEl.classList.toggle(
              'is-touching',
              touching
            );
          }


          /* --------------------------------------------------
             IGNITE / RELEASE
             -------------------------------------------------- */

          const wasTouching =
            iconWasTouching.current[i] ||
            false;


          /* BALL ARRIVES */

          if (
            touching &&
            !wasTouching
          ) {

            fireBurst(
              i,
              'node-ignite',
              1300
            );
          }


          /* BALL LEAVES */

          else if (
            !touching &&
            wasTouching
          ) {

            fireBurst(
              i,
              'node-release',
              650
            );
          }


          iconWasTouching.current[i] =
            touching;
        }
      );


      rafId =
        requestAnimationFrame(
          tick
        );
    };


    rafId =
      requestAnimationFrame(
        tick
      );


    return () => {

      cancelAnimationFrame(
        rafId
      );

      burstTimeouts.current.forEach(
        (t) =>
          clearTimeout(t)
      );
    };

  }, [branches]);


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        mt-20
      "
    >

      <p
        className="
          text-center
          text-orange-500/80
          text-xs
          uppercase
          tracking-widest
          mb-2
        "
      >
        One Verified System, Start to Finish.
      </p>


      <p
        className="
          text-center
          text-gray-500
          text-xs
          uppercase
          tracking-widest
          mb-8
        "
      >
        From sourcing to delivery, TEHTER keeps every stage accountable
      </p>


      <div
        className="
          relative
          w-full
          mx-auto
        "
        style={{
          aspectRatio: `${W} / ${H}`
        }}
      >

        {/* ==================================================
            NODE ANIMATION CSS
            ================================================== */}

        <style>
          {`

          /* ==================================================
             BASE NODE ICON
             ================================================== */

          .node-icon {

            color:
              var(--node-color);

            transform:
              scale(1);

            filter:
              drop-shadow(
                0 0 0 transparent
              );

            transition:
              color 200ms ease,
              filter 200ms ease,
              transform 200ms ease;
          }


          .node-icon svg {

            overflow:
              visible;
          }


          .node-icon svg * {

            transition:
              fill-opacity 150ms ease,
              stroke-opacity 150ms ease;
          }


          /* ==================================================
             COLORED SVG LAYERS
             ================================================== */

          .node-icon .p-outer {

            fill:
              var(--node-color-dark);

            fill-opacity:
              0.08;

            stroke:
              var(--node-color);

            stroke-opacity:
              0.25;
          }


          .node-icon .p-mid {

            fill:
              var(--node-color);

            fill-opacity:
              0.08;

            stroke:
              var(--node-color);

            stroke-opacity:
              0.4;
          }


          .node-icon .p-core {

            fill:
              var(--node-color-soft);

            fill-opacity:
              0.28;

            stroke:
              var(--node-color-soft);

            stroke-opacity:
              0.55;
          }


          .node-icon .p-ember {

            fill:
              var(--node-color-soft);

            stroke:
              none;

            opacity:
              0.35;
          }


          /* ==================================================
             NODE BORDER
             ================================================== */

          .node-border {

            border: 2px solid transparent;

            background:
              linear-gradient(
                #161616,
                #161616
              ) padding-box,

              linear-gradient(
                135deg,
                #7c2d12,
                #ea580c 45%,
                #fbbf24 100%
              ) border-box;

            box-shadow:
              0 0 7px
              rgba(194, 65, 12, 0.25),

              inset 0 0 7px
              rgba(194, 65, 12, 0.12);

            transition:
              box-shadow 250ms ease,
              transform 250ms ease;
          }


          /* ==================================================
             NUMBER
             ================================================== */

          .node-number {

            color:
              var(--node-color);

            border:
              1px solid
              color-mix(
                in srgb,
                var(--node-color) 45%,
                #222 55%
              );

            box-shadow:
              0 0 8px
              color-mix(
                in srgb,
                var(--node-color) 10%,
                transparent
              );

            transition:
              color 200ms ease,
              border-color 200ms ease,
              box-shadow 200ms ease;
          }


          /* ==================================================
             LABEL
             ================================================== */

          .node-label {

            color:
              #9ca3af;

            transition:
              color 250ms ease;
          }


          /* ==================================================
             ENERGY BURST
             ================================================== */

          .node-energy-burst {

            opacity:
              0;

            pointer-events:
              none;

            background:

              radial-gradient(
                circle at 50% 50%,
                var(--node-color-soft) 0%,
                transparent 16%
              ),

              radial-gradient(
                circle at 50% 50%,
                color-mix(
                  in srgb,
                  var(--node-color) 75%,
                  transparent
                ) 10%,
                transparent 45%
              ),

              radial-gradient(
                circle at 50% 50%,
                color-mix(
                  in srgb,
                  var(--node-color-dark) 50%,
                  transparent
                ) 20%,
                transparent 72%
              );

            filter:
              blur(6px);

            transform:
              scale(0.25);
          }


          @keyframes node-burst {

            0% {
              opacity: 0;
              transform:
                scale(0.25);
            }

            10% {
              opacity: 0.95;
              transform:
                scale(0.65);
            }

            30% {
              opacity: 0.8;
              transform:
                scale(1.15);
            }

            60% {
              opacity: 0.3;
              transform:
                scale(1.45);
            }

            100% {
              opacity: 0;
              transform:
                scale(1.8);
            }
          }


          .node-border:has(
            .node-ignite
          )
          .node-energy-burst {

            animation:
              node-burst
              850ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              )
              both;
          }


          .node-border:has(
            .node-release
          )
          .node-energy-burst {

            animation:
              node-burst
              550ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              )
              both;
          }


          /* ==================================================
             IGNITION
             ================================================== */

          @keyframes node-ignite {

            0% {

              filter:
                drop-shadow(
                  0 0 0 transparent
                )
                brightness(1);

              transform:
                scale(1);
            }

            8% {

              filter:
                drop-shadow(
                  0 0 4px
                  var(--node-color-soft)
                )
                drop-shadow(
                  0 0 12px
                  var(--node-color)
                )
                drop-shadow(
                  0 0 28px
                  var(--node-color)
                )
                brightness(1.35);

              transform:
                scale(1.12);
            }

            20% {

              filter:
                drop-shadow(
                  0 0 6px white
                )
                drop-shadow(
                  0 0 16px
                  var(--node-color-soft)
                )
                drop-shadow(
                  0 0 32px
                  var(--node-color)
                )
                drop-shadow(
                  0 0 55px
                  var(--node-color-dark)
                )
                brightness(1.65);

              transform:
                scale(1.25);
            }

            38% {

              filter:
                drop-shadow(
                  0 0 5px
                  var(--node-color-soft)
                )
                drop-shadow(
                  0 0 14px
                  var(--node-color)
                )
                drop-shadow(
                  0 0 28px
                  var(--node-color-dark)
                )
                brightness(1.4);

              transform:
                scale(1.17);
            }

            62% {

              filter:
                drop-shadow(
                  0 0 3px
                  var(--node-color-soft)
                )
                drop-shadow(
                  0 0 9px
                  var(--node-color)
                )
                brightness(1.15);

              transform:
                scale(1.06);
            }

            100% {

              filter:
                drop-shadow(
                  0 0 0 transparent
                )
                brightness(1);

              transform:
                scale(1);
            }
          }


          .node-ignite {

            animation:
              node-ignite
              1.3s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              )
              both;
          }


          /* ==================================================
             RELEASE
             ================================================== */

          @keyframes node-release {

            0% {

              filter:
                drop-shadow(
                  0 0 6px
                  var(--node-color-soft)
                )
                drop-shadow(
                  0 0 18px
                  var(--node-color)
                )
                brightness(1.35);

              transform:
                scale(1.13);
            }

            35% {

              filter:
                drop-shadow(
                  0 0 8px white
                )
                drop-shadow(
                  0 0 18px
                  var(--node-color-soft)
                )
                drop-shadow(
                  0 0 38px
                  var(--node-color)
                )
                brightness(1.5);

              transform:
                scale(1.2);
            }

            100% {

              filter:
                drop-shadow(
                  0 0 0 transparent
                )
                brightness(1);

              transform:
                scale(1);
            }
          }


          .node-release {

            animation:
              node-release
              650ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              )
              both;
          }


          /* ==================================================
             FILL FLARE
             ================================================== */

          @keyframes node-core-flare {

            0% {
              fill-opacity: 0.28;
            }

            10% {
              fill-opacity: 1;
            }

            25% {
              fill-opacity: 1;
            }

            55% {
              fill-opacity: 0.65;
            }

            100% {
              fill-opacity: 0.28;
            }
          }


          @keyframes node-mid-flare {

            0% {
              fill-opacity: 0.08;
            }

            10% {
              fill-opacity: 0.7;
            }

            25% {
              fill-opacity: 0.95;
            }

            55% {
              fill-opacity: 0.35;
            }

            100% {
              fill-opacity: 0.08;
            }
          }


          @keyframes node-outer-flare {

            0% {
              fill-opacity: 0.08;
            }

            10% {
              fill-opacity: 0.45;
            }

            25% {
              fill-opacity: 0.75;
            }

            55% {
              fill-opacity: 0.2;
            }

            100% {
              fill-opacity: 0.08;
            }
          }


          .node-ignite .p-core,
          .node-release .p-core {

            animation:
              node-core-flare
              1.3s
              ease-out
              both;
          }


          .node-ignite .p-mid,
          .node-release .p-mid {

            animation:
              node-mid-flare
              1.3s
              ease-out
              both;
          }


          .node-ignite .p-outer,
          .node-release .p-outer {

            animation:
              node-outer-flare
              1.3s
              ease-out
              both;
          }


          /* ==================================================
             PARTICLES
             ================================================== */

          .node-particle {

            position:
              absolute;

            left:
              50%;

            top:
              50%;

            width:
              3px;

            height:
              3px;

            border-radius:
              999px;

            background:
              radial-gradient(
                circle,
                white 0%,
                var(--node-color-soft) 35%,
                var(--node-color) 65%,
                transparent 100%
              );

            opacity:
              0;

            pointer-events:
              none;
          }


          @keyframes node-ember {

            0% {

              opacity:
                0;

              transform:
                translate(
                  -50%,
                  -50%
                )
                translate(
                  0,
                  0
                )
                scale(0.4);
            }

            15% {
              opacity: 1;
            }

            100% {

              opacity:
                0;

              transform:
                translate(
                  -50%,
                  -50%
                )
                translate(
                  var(--dx),
                  var(--dy)
                )
                scale(0.9);
            }
          }


          @keyframes node-ember-release {

            0% {

              opacity:
                0;

              transform:
                translate(
                  -50%,
                  -50%
                )
                translate(
                  0,
                  0
                )
                scale(0.5);
            }

            20% {
              opacity: 1;
            }

            100% {

              opacity:
                0;

              transform:
                translate(
                  -50%,
                  -50%
                )
                translate(
                  calc(var(--dx) * 1.35),
                  calc(var(--dy) * 1.35)
                )
                scale(0.7);
            }
          }


          .node-border:has(
            .node-ignite
          )
          .node-particle {

            animation:
              node-ember
              700ms
              ease-out
              both;
          }


          .node-border:has(
            .node-release
          )
          .node-particle {

            animation:
              node-ember-release
              500ms
              ease-out
              both;
          }


          /* ==================================================
             PHOENIX
             ================================================== */

          .phoenix-icon {

            --node-color:
              #f97316;

            --node-color-soft:
              #fed7aa;

            --node-color-dark:
              #dc2626;
          }


          .phoenix-icon.node-ignite {

            animation:
              phoenix-ignite
              1.3s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              )
              both;
          }


          @keyframes phoenix-ignite {

            0% {

              filter:
                brightness(1);

              transform:
                scale(1);
            }

            10% {

              filter:
                drop-shadow(
                  0 0 5px
                  #fff7ed
                )
                drop-shadow(
                  0 0 15px
                  #fed7aa
                )
                drop-shadow(
                  0 0 30px
                  #f97316
                )
                drop-shadow(
                  0 0 50px
                  #dc2626
                )
                brightness(1.5);

              transform:
                scale(1.15)
                rotate(-2deg);
            }

            22% {

              filter:
                drop-shadow(
                  0 0 8px white
                )
                drop-shadow(
                  0 0 20px
                  #fde68a
                )
                drop-shadow(
                  0 0 40px
                  #f97316
                )
                drop-shadow(
                  0 0 70px
                  #dc2626
                )
                brightness(1.9);

              transform:
                scale(1.3)
                rotate(2deg);
            }

            40% {

              filter:
                drop-shadow(
                  0 0 6px
                  #fff7ed
                )
                drop-shadow(
                  0 0 16px
                  #fb923c
                )
                drop-shadow(
                  0 0 35px
                  #ea580c
                )
                brightness(1.5);

              transform:
                scale(1.2)
                rotate(-1deg);
            }

            65% {

              filter:
                drop-shadow(
                  0 0 4px
                  #fed7aa
                )
                drop-shadow(
                  0 0 12px
                  #f97316
                )
                brightness(1.2);

              transform:
                scale(1.07);
            }

            100% {

              filter:
                brightness(1);

              transform:
                scale(1);
            }
          }


          /* ==================================================
             PHOENIX BORDER
             ================================================== */

          .phoenix-border {

            border:
              2px solid transparent;

            background:

              linear-gradient(
                #161616,
                #161616
              )
              padding-box,

              linear-gradient(
                135deg,
                #7c2d12,
                #ea580c 45%,
                #fbbf24 100%
              )
              border-box;

            box-shadow:

              0 0 7px
              rgba(
                194,
                65,
                12,
                0.25
              ),

              inset 0 0 7px
              rgba(
                194,
                65,
                12,
                0.12
              );
          }


          .phoenix-border:has(
            .node-ignite
          ) {

            box-shadow:

              0 0 18px
              rgba(
                249,
                115,
                22,
                0.85
              ),

              0 0 38px
              rgba(
                234,
                88,
                12,
                0.55
              ),

              inset 0 0 12px
              rgba(
                253,
                224,
                71,
                0.4
              );
          }


          .phoenix-border:has(
            .node-release
          ) {

            box-shadow:

              0 0 14px
              rgba(
                249,
                115,
                22,
                0.7
              ),

              0 0 28px
              rgba(
                234,
                88,
                12,
                0.4
              ),

              inset 0 0 8px
              rgba(
                253,
                224,
                71,
                0.3
              );
          }


          /* ==================================================
             OTHER NODE BORDER GLOW
             ================================================== */

          .node-border:has(
            .node-ignite
          ) {

            border-color: transparent;

            box-shadow:
              0 0 15px
              rgba(249, 115, 22, 0.65),

              0 0 30px
              rgba(234, 88, 12, 0.30),

              inset 0 0 10px
              rgba(249, 115, 22, 0.20);
          }


          .node-border:has(
            .node-release
          ) {

            border-color: transparent;

            box-shadow:
              0 0 12px
              rgba(249, 115, 22, 0.55),

              0 0 24px
              rgba(234, 88, 12, 0.25);
          }


          /* ==================================================
             TOUCHING STATE
             ================================================== */

          .flame-burst-touch {

            opacity:
              0;

            transform:
              scale(0.3);

            transition:
              opacity 110ms ease-out,
              transform 110ms ease-out;
          }


          .flame-burst-touch.is-touching {

            opacity:
              1;

            transform:
              scale(1);
          }

          `}
        </style>


        {/* ==================================================
            SVG ROOT NETWORK
            ================================================== */}

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="
            absolute
            inset-0
            w-full
            h-full
          "
          preserveAspectRatio="none"
        >

          <defs>

            {/* Root gradient */}
            <linearGradient
              id="rootFill"
              x1="0"
              y1="0"
              x2="1"
              y2="0.3"
            >
              <stop
                offset="0%"
                stopColor="#3a2312"
              />

              <stop
                offset="55%"
                stopColor="#8a4a1e"
              />

              <stop
                offset="100%"
                stopColor="#f97316"
              />
            </linearGradient>


            {/* Ground glow */}
            <radialGradient
              id="groundGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="#f97316"
                stopOpacity="0.2"
              />

              <stop
                offset="100%"
                stopColor="#f97316"
                stopOpacity="0"
              />
            </radialGradient>


            {/* Hub glow */}
            <radialGradient
              id="hubGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="#f97316"
                stopOpacity="0.35"
              />

              <stop
                offset="100%"
                stopColor="#f97316"
                stopOpacity="0"
              />
            </radialGradient>


            {/* Root glow */}
            <filter
              id="rootGlow"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="4.5"
                result="blur"
              />

              <feMerge>

                <feMergeNode
                  in="blur"
                />

                <feMergeNode
                  in="SourceGraphic"
                />

              </feMerge>
            </filter>

          </defs>


          {/* Ground */}
          <ellipse
            cx={hub.x}
            cy={hub.y + 20}
            rx="220"
            ry="60"
            fill="url(#groundGlow)"
          />


          {/* Hub */}
          <circle
            cx={hub.x}
            cy={hub.y}
            r="120"
            fill="url(#hubGlow)"
          />


          {/* Hub feeder roots */}
          {hubFeeders.map(
            (d, i) => (
              <path
                key={`feeder-${i}`}
                d={d}
                fill="#3a2314"
                fillOpacity="0.55"
                stroke="#241408"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
            )
          )}


          {/* Secondary rootlets */}
          {rootletShapes.map(
            (d, i) => (
              <path
                key={`rootlet-${i}`}
                d={d}
                fill="#3a2314"
                fillOpacity="0.55"
                stroke="#241408"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            )
          )}


          {/* Main roots */}
          <g filter="url(#rootGlow)">

            {branches.map(
              (b, i) => (
                <path
                  key={`branch-${i}`}
                  d={b.shape}
                  fill="url(#rootFill)"
                  stroke="#f97316"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                />
              )
            )}

          </g>


          {/* Invisible centerlines */}
          {branches.map(
            (b, i) => (
              <path
                key={`centerline-${i}`}
                ref={(el) =>
                  (centerlineRefs.current[i] = el)
                }
                d={b.centerline}
                fill="none"
                stroke="none"
              />
            )
          )}


          {/* Traveling energy balls */}
          {branches.map(
            (_, i) => (
              <circle
                key={`pulse-${i}`}
                ref={(el) =>
                  (pulseRefs.current[i] = el)
                }
                cx={hub.x}
                cy={hub.y}
                r="5.5"
                fill="#f97316"
                filter="
                  drop-shadow(
                    0 0 6px
                    rgba(249,115,22,1)
                  )
                "
              />
            )
          )}

        </svg>


        {/* ==================================================
            MODULE NODES
            ================================================== */}

        {modules.map(
          (m, i) => (

            <div
              key={m.name}
              className="
                absolute
                flex
                flex-col
                items-center
                gap-2
                -translate-x-1/2
              "
              style={{
                left: pct(m.x, W),
                top: pct(m.y, H)
              }}
            >

              {/* NODE */}
              <div
                className={`
                  relative
                  w-14
                  h-14
                  rounded-xl
                  bg-[#161616]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  overflow-visible
                  node-border

                  ${m.isPhoenix
                    ? 'phoenix-border'
                    : ''
                  }
                `}
                style={{
                  '--node-color':
                    m.color,

                  '--node-color-soft':
                    m.colorSoft,

                  '--node-color-dark':
                    m.colorDark
                }}
              >

                {/* Energy explosion */}
                <div
                  ref={(el) =>
                    (flameBurstRefs.current[i] = el)
                  }
                  className="
                    flame-burst-touch
                    pointer-events-none
                    absolute
                    inset-[-55%]
                    rounded-full
                    node-energy-burst
                  "
                />


                {/* Particles */}

                {[
                  {
                    dx: '-18px',
                    dy: '-30px'
                  },
                  {
                    dx: '14px',
                    dy: '-34px'
                  },
                  {
                    dx: '-26px',
                    dy: '-10px'
                  },
                  {
                    dx: '24px',
                    dy: '-14px'
                  },
                  {
                    dx: '-8px',
                    dy: '-40px'
                  },
                  {
                    dx: '6px',
                    dy: '-24px'
                  }
                ].map(
                  (e, ei) => (

                    <span
                      key={`particle-${i}-${ei}`}
                      className="
                        node-particle
                      "
                      style={{
                        '--dx':
                          e.dx,

                        '--dy':
                          e.dy,

                        animationDelay:
                          `${ei * 45}ms`
                      }}
                    />

                  )
                )}


                {/* Number */}
                <span
                  className="
                    absolute
                    -top-2
                    -left-2
                    w-5
                    h-5
                    rounded-full
                    bg-[#111]
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    z-20
                    node-number
                  "
                  style={{
                    '--node-color':
                      m.color
                  }}
                >
                  {i + 1}
                </span>


                {/* Icon */}
                <span
                  ref={(el) =>
                    (iconGlowRefs.current[i] = el)
                  }
                  className={`
                    node-icon
                    relative
                    z-10
                    flex
                    items-center
                    justify-center

                    ${m.isPhoenix
                      ? 'phoenix-icon'
                      : ''
                    }
                  `}
                  style={{
                    '--node-color':
                      m.color,

                    '--node-color-soft':
                      m.colorSoft,

                    '--node-color-dark':
                      m.colorDark
                  }}
                >
                  {m.icon}
                </span>

              </div>


              {/* Label */}
              <span
                className="
                  text-[11px]
                  font-semibold
                  tracking-wide
                  whitespace-nowrap
                  node-label
                "
                style={{
                  '--node-color':
                    m.color
                }}
              >
                {m.name}
              </span>

            </div>

          )
        )}


        {/* ==================================================
            TEHTER HUB
            ================================================== */}

        <div
          className="
            absolute
            flex
            flex-col
            items-center
            -translate-x-1/2
            -translate-y-1/2
          "
          style={{
            left: pct(hub.x, W),
            top: pct(hub.y, H)
          }}
        >

          <div
            className="
              px-5
              py-2.5
              rounded-full
              border-2
              border-orange-500/60
              bg-black/70
              backdrop-blur-sm
              shadow-[0_0_30px_rgba(249,115,22,0.35)]
            "
          >
            <span
              className="
                text-orange-500
                font-bold
                text-sm
                tracking-[0.25em]
              "
            >
              TEHTER
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   ICONS
   ============================================================ */

function IconSuppliers() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
    >

      <circle
        className="p-outer"
        cx="8"
        cy="8"
        r="5.4"
      />

      <circle
        className="p-outer"
        cx="17"
        cy="9"
        r="4.6"
      />

      <path
        className="p-mid"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="
          M3 20
          c0-3 2.5-5 5-5
          s5 2 5 5

          M14 20
          c0-2.3 1.7-4 4-4
          s4 1.7 4 4
        "
      />

      <circle
        className="p-core"
        cx="8"
        cy="8"
        r="2.6"
      />

      <circle
        className="p-core"
        cx="17"
        cy="9"
        r="2.1"
      />

      <circle
        className="p-ember"
        cx="7"
        cy="6.8"
        r="0.6"
      />

      <circle
        className="p-ember"
        cx="16.2"
        cy="7.8"
        r="0.5"
      />

    </svg>
  );
}


function IconPurchase() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
    >

      <path
        className="p-outer"
        d="
          M2.6 3.6
          h2
          l2.4 12.2
          a1.5 1.5 0 001.5 1.3
          h9.2
          a1.5 1.5 0 001.5-1.2
          L21 7.6
          H6.4
        "
      />

      <path
        className="p-mid"
        d="
          M5.6 7.6
          h13.7
          l-1.3 6.4
          a1.5 1.5 0 01-1.5 1.2
          H8.7
          a1.5 1.5 0 01-1.5-1.3
          z
        "
      />

      <circle
        className="p-core"
        cx="9"
        cy="20"
        r="1.4"
      />

      <circle
        className="p-core"
        cx="18"
        cy="20"
        r="1.4"
      />

      <circle
        className="p-ember"
        cx="9"
        cy="20"
        r="0.5"
      />

      <circle
        className="p-ember"
        cx="18"
        cy="20"
        r="0.5"
      />

    </svg>
  );
}


function IconQuotation() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
    >

      <path
        className="p-outer"
        d="M7 3h8l4 4v14H7z"
      />

      <path
        className="p-mid"
        d="M15 3v4h4z"
      />

      <path
        className="p-core"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
        d="
          M10 12h6
          M10 16h6
          M10 8h2
        "
      />

      <circle
        className="p-ember"
        cx="9"
        cy="8"
        r="0.5"
      />

    </svg>
  );
}


function IconPurchased() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
    >

      <circle
        className="p-outer"
        cx="12"
        cy="12"
        r="10"
      />

      <circle
        className="p-mid"
        cx="12"
        cy="12"
        r="7.4"
      />

      <path
        className="p-core"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
        d="
          M20 6
          L9 17
          l-5-5
        "
      />

      <circle
        className="p-ember"
        cx="9"
        cy="17"
        r="0.6"
      />

    </svg>
  );
}


function IconStore() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
    >

      <path
        className="p-outer"
        d="
          M2 9
          l1.5-5
          h17
          L22 9
          z
        "
      />

      <path
        className="p-mid"
        d="
          M3.5 9.5
          h17
          V20
          h-17
          z
        "
      />

      <path
        className="p-core"
        d="
          M9.5 21
          v-5.5
          h5
          V21
          z
        "
      />

      <circle
        className="p-ember"
        cx="12"
        cy="6.5"
        r="0.5"
      />

    </svg>
  );
}


/* ============================================================
   PHOENIX ICON
   ============================================================ */

function PhoenixIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
    >

      {/* Outer phoenix wings */}
      <path
        className="p-outer"
        stroke="#7c2d12"
        strokeWidth="0.4"
        strokeOpacity="0.5"
        d="
          M12 1.6
          c-2 2.6-5.6 3.6-6.9 7
          C3.9 11.9 4.7 14.6 6.6 16
          c-.6-2.4.4-4.9 2.8-6.2
          c-1 2.4-.7 4.9.7 6.7
          c.9 1.1 2 1.7 3 1.7
          c1 0 2.1-.6 3-1.7
          c1.4-1.8 1.7-4.3.7-6.7
          c2.4 1.3 3.4 3.8 2.8 6.2
          c1.9-1.4 2.7-4.1 1.5-7.4
          c-1.3-3.4-4.9-4.4-6.9-7z
        "
      />


      {/* Mid flame */}
      <path
        className="p-mid"
        d="
          M12 4.6
          c-1.4 1.9-3.9 2.7-4.7 5.1
          c-.6 1.7 0 3.5 1.4 4.5
          c-.5-1.7.1-3.4 1.7-4.4
          c-.6 1.7-.4 3.4.6 4.6
          c.7.8 1.4 1.2 2 .8
          c.6.4 1.3 0 2-.8
          c1-1.2 1.2-2.9.6-4.6
          c1.6 1 2.2 2.7 1.7 4.4
          c1.4-1 2-2.8 1.4-4.5
          c-.8-2.4-3.3-3.2-4.7-5.1z
        "
      />


      {/* Hot core */}
      <path
        className="p-core"
        d="
          M12 8.3
          c-.8 1-1.7 1.5-1.9 2.7
          c-.1.9.3 1.7 1 2.1
          c-.2-.8.1-1.6.7-2.1
          c-.2.8 0 1.6.5 2.1
          c.3.4.5.5.7.5
          c.2 0 .4-.1.7-.5
          c.5-.5.7-1.3.5-2.1
          c.6.5.9 1.3.7 2.1
          c.7-.4 1.1-1.2 1-2.1
          c-.2-1.2-1.1-1.7-1.9-2.7z
        "
      />


      {/* Embers */}
      <circle
        className="p-ember"
        cx="6.1"
        cy="7.3"
        r="0.55"
      />

      <circle
        className="p-ember"
        cx="17.9"
        cy="7.3"
        r="0.55"
      />

      <circle
        className="p-ember"
        cx="12"
        cy="2.2"
        r="0.5"
      />

    </svg>
  );
}


/* ============================================================
   DELIVERY
   ============================================================ */

function IconDelivery() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
    >

      <rect
        className="p-outer"
        x="1"
        y="7"
        width="13"
        height="10"
        rx="1"
      />

      <path
        className="p-mid"
        d="
          M14 10
          h4
          l3 3
          v4
          h-7
          z
        "
      />

      <circle
        className="p-core"
        cx="6"
        cy="19"
        r="1.7"
      />

      <circle
        className="p-core"
        cx="17"
        cy="19"
        r="1.7"
      />

      <circle
        className="p-ember"
        cx="6"
        cy="19"
        r="0.55"
      />

      <circle
        className="p-ember"
        cx="17"
        cy="19"
        r="0.55"
      />

    </svg>
  );
}
