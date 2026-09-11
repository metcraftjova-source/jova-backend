import React from 'react';

// Common SVG props
const svgProps = {
    viewBox: "0 0 100 100",
    width: "60%",
    height: "60%",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
};

// Colors
const accent = "#E34A12"; // Orange
const secondary = "#475569"; // Slate 600
const primary = "#0f172a"; // Slate 900

export const StructuralSteelIcon = () => (
    <svg {...svgProps}>
        <g className="shadow" opacity="0.2">
            <path d="M20 80h60v10H20z" fill={primary} />
        </g>
        <g className="main fade-fill">
            {/* I-Beam profile */}
            <path d="M25 20h50v10H60v40h15v10H25V70h15V30H25V20z" fill={primary} />
            {/* Front face highlight */}
            <path d="M25 20h50v5H25z" fill={secondary} />
            <path d="M40 25h20v45H40z" fill={secondary} />
            <path d="M25 70h50v5H25z" fill={secondary} />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="2" strokeLinecap="round">
            <path className="draw-stroke" d="M15 45L30 30" />
            <path className="draw-stroke" d="M85 55L70 70" />
            <circle className="draw-stroke" cx="75" cy="30" r="2" fill={accent} />
            <circle className="draw-stroke" cx="25" cy="75" r="3" fill={accent} />
        </g>
    </svg>
);

export const CraneErectionIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill" fill={primary}>
            {/* Crane Base & Tower */}
            <path d="M10 90h20v-5H10z" />
            <path d="M15 85h10V20H15z" fill={secondary} />
            {/* Crane Arm */}
            <path d="M10 20h60v8H10z" />
            {/* Hook wire */}
            <path d="M60 28v30" stroke={secondary} strokeWidth="2" />
            {/* Hook */}
            <path d="M55 58h10v5a5 5 0 01-10 0" fill="none" stroke={accent} strokeWidth="3" />
        </g>
        <g className="highlight">
            {/* Suspended Beam */}
            <path className="draw-stroke" d="M40 70h40v10H40z" fill="none" stroke={accent} strokeWidth="3" />
        </g>
    </svg>
);

export const PebFabricationIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill">
            {/* Warehouse Frame */}
            <path d="M10 80v-40L50 20l40 20v40" fill="none" stroke={primary} strokeWidth="4" strokeLinejoin="round" />
            {/* Internal Supports */}
            <path d="M15 75v-30l35-15 35 15v30" fill="none" stroke={secondary} strokeWidth="2" strokeDasharray="4 4" />
            <path d="M50 25v55" stroke={primary} strokeWidth="4" />
            <path d="M30 35v45" stroke={secondary} strokeWidth="2" />
            <path d="M70 35v45" stroke={secondary} strokeWidth="2" />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="4" strokeLinejoin="round" fill="none">
            <path className="draw-stroke" d="M10 40L50 20l40 20" />
        </g>
    </svg>
);

export const MezzanineFloorsIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill" stroke={primary} strokeWidth="4" fill="none">
            {/* Bottom Level */}
            <path d="M10 80h80" />
            <path d="M20 80v-30" />
            <path d="M50 80v-30" />
            <path d="M80 80v-30" />
            {/* Middle Level */}
            <path d="M10 50h80" stroke={secondary} />
            <path d="M20 50v-30" stroke={secondary} />
            <path d="M50 50v-30" stroke={secondary} />
            <path d="M80 50v-30" stroke={secondary} />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="4" fill="none">
            {/* Top Deck */}
            <path className="draw-stroke" d="M10 20h80" />
            {/* Railing */}
            <path className="draw-stroke" d="M15 20v-10h70v10" strokeWidth="2" />
            <path className="draw-stroke" d="M35 20v-10" strokeWidth="2" />
            <path className="draw-stroke" d="M55 20v-10" strokeWidth="2" />
        </g>
    </svg>
);

export const PebModificationsIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill">
            {/* Existing Building */}
            <path d="M30 70V40l20-15 20 15v30H30z" fill="none" stroke={secondary} strokeWidth="4" strokeLinejoin="round" />
            <path d="M50 25v45" stroke={secondary} strokeWidth="2" />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Modification Upgrade Arrow Left */}
            <path className="draw-stroke" d="M20 50C10 40 20 20 40 10" />
            <path className="draw-stroke" d="M35 5L40 10L35 15" />
            {/* Modification Upgrade Arrow Right */}
            <path className="draw-stroke" d="M80 50C90 60 80 80 60 90" />
            <path className="draw-stroke" d="M65 95L60 90L65 85" />
        </g>
    </svg>
);

export const SiteBarricadingIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill" fill="none" stroke={primary} strokeWidth="4">
            {/* Posts */}
            <path d="M20 20v60" />
            <path d="M50 20v60" />
            <path d="M80 20v60" />
            {/* Rails */}
            <path d="M10 35h80" stroke={secondary} />
            <path d="M10 65h80" stroke={secondary} />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {/* Cross Bracing */}
            <path className="draw-stroke" d="M20 35l30 30" />
            <path className="draw-stroke" d="M50 35l-30 30" />
            <path className="draw-stroke" d="M50 35l30 30" />
            <path className="draw-stroke" d="M80 35l-30 30" />
        </g>
    </svg>
);

export const PufInstallationIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill">
            {/* Base Layer */}
            <path d="M20 60l30 15 30-15v10L50 85 20 70z" fill={primary} />
            {/* Middle Insulation Layer */}
            <path d="M20 45l30 15 30-15v10L50 70 20 55z" fill={secondary} />
        </g>
        <g className="highlight" fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round">
            {/* Top Deck Sheet */}
            <path className="draw-stroke" d="M20 30l30 15 30-15-30-15z" fill={`${accent}33`} />
            {/* Corrugation lines */}
            <path className="draw-stroke" d="M25 32l25 12" />
            <path className="draw-stroke" d="M35 27l25 12" />
            <path className="draw-stroke" d="M45 22l25 12" />
        </g>
        {/* Floating particle */}
        <circle cx="50" cy="10" r="2" fill={accent} className="draw-stroke" />
    </svg>
);

export const IndustrialShedsIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill" stroke={primary} strokeWidth="4" strokeLinejoin="round" fill="none">
            {/* Factory Profile */}
            <path d="M10 80V40l15-10v10l15-10v10l15-10v10l15-10v30" />
            {/* Chimney */}
            <path d="M75 50v-20h10v30" stroke={secondary} />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round">
            <path className="draw-stroke" d="M20 80v-15h10v15" />
            {/* Smoke bubbles */}
            <circle className="draw-stroke" cx="80" cy="20" r="4" />
            <circle className="draw-stroke" cx="85" cy="10" r="3" />
            <circle className="draw-stroke" cx="75" cy="5" r="2" />
        </g>
    </svg>
);

export const MachineryPlatformsIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill" fill="none" stroke={primary} strokeWidth="4">
            {/* Foundation */}
            <path d="M20 80h60" strokeWidth="6" />
            {/* Columns */}
            <path d="M30 80V40" stroke={secondary} />
            <path d="M50 80V40" stroke={secondary} />
            <path d="M70 80V40" stroke={secondary} />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="5" fill="none" strokeLinejoin="round">
            {/* Heavy Duty Platform */}
            <path className="draw-stroke" d="M15 40h70v-10H15z" fill={`${accent}22`} />
            {/* Abstract Machinery on top */}
            <path className="draw-stroke" d="M30 30v-10h15v10" strokeWidth="3" />
            <circle className="draw-stroke" cx="60" cy="22" r="8" strokeWidth="3" />
        </g>
    </svg>
);

export const ShotBlastingIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill">
            {/* Metal gear/part */}
            <circle cx="60" cy="60" r="20" fill="none" stroke={primary} strokeWidth="6" />
            <circle cx="60" cy="60" r="8" fill="none" stroke={secondary} strokeWidth="4" />
            <path d="M60 35v5M60 80v5M35 60h5M80 60h5M42 42l4 4M74 74l4 4M42 78l4-4M74 42l4 4" stroke={primary} strokeWidth="4" />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round">
            {/* Blasting nozzle */}
            <path className="draw-stroke" d="M10 20l20 20" strokeWidth="6" />
            <path className="draw-stroke" d="M25 15l10 10" strokeWidth="4" />
            {/* Particles hitting the part */}
            <path className="draw-stroke" d="M35 45l10 5" strokeDasharray="2 4" />
            <path className="draw-stroke" d="M40 35l5 10" strokeDasharray="2 4" />
            <circle cx="45" cy="45" r="2" fill={accent} className="draw-stroke" />
            <circle cx="50" cy="38" r="1.5" fill={accent} className="draw-stroke" />
            <circle cx="38" cy="50" r="2" fill={accent} className="draw-stroke" />
        </g>
    </svg>
);

export const IndustrialPaintingIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill">
            {/* I-beam being painted */}
            <path d="M20 70h60v10H20z" fill={primary} />
            <path d="M40 30h20v40H40z" fill={secondary} />
            <path d="M30 30h40v10H30z" fill={primary} />
        </g>
        <g className="highlight" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Paint roller */}
            <path className="draw-stroke" d="M75 40v20" strokeWidth="8" />
            <path className="draw-stroke" d="M75 50h10v20" />
            {/* Paint stroke */}
            <path className="draw-stroke" d="M50 40h20" strokeWidth="6" stroke={accent} opacity="0.8" />
            <path className="draw-stroke" d="M50 50h15" strokeWidth="6" stroke={accent} opacity="0.8" />
        </g>
    </svg>
);

export const FacadeSolutionsIcon = () => (
    <svg {...svgProps}>
        <g className="main fade-fill" fill="none" stroke={primary} strokeWidth="4">
            {/* Building structure */}
            <path d="M20 20h60v70H20z" />
            {/* Grid lines */}
            <path d="M40 20v70" stroke={secondary} strokeWidth="2" />
            <path d="M60 20v70" stroke={secondary} strokeWidth="2" />
            <path d="M20 40h60" stroke={secondary} strokeWidth="2" />
            <path d="M20 60h60" stroke={secondary} strokeWidth="2" />
            <path d="M20 80h60" stroke={secondary} strokeWidth="2" />
        </g>
        <g className="highlight" fill="none" stroke={accent} strokeWidth="3">
            {/* Highlighted glass panels */}
            <path className="draw-stroke" d="M40 40h20v20H40z" fill={`${accent}33`} />
            <path className="draw-stroke" d="M20 60h20v20H20z" fill={`${accent}33`} />
            <path className="draw-stroke" d="M60 20h20v20H60z" fill={`${accent}33`} />
            {/* Sun reflection / shine */}
            <path className="draw-stroke" d="M45 55l10-10" strokeWidth="2" />
            <path className="draw-stroke" d="M52 57l3-3" strokeWidth="2" />
        </g>
    </svg>
);