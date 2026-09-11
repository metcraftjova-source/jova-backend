import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Podium-style icon: the glyph floats above a glowing circular base with a
// soft reflection beneath it, a slowly rotating dashed ring around the
// base, and a strong colored glow — approximating the neon 3D-render look
// with pure CSS/SVG rather than actual rendered image assets. `color`,
// `hoverColor`, `glow` are the same per-step props OurProcess.jsx already
// passes in.
//
// Pass `illustration` for full-color vector icons (multiple fills/colors
// inside one <svg>) — this skips the single-color stroke-extrusion effect
// below (which is built for monochrome line glyphs and would otherwise
// flatten every color in the illustration down to one forced stroke
// color) and just renders the icon's own colors directly, at a larger
// size so the detail actually reads.
const GlassIcon = ({
    icon,
    imageSrc,
    imageAlt = '',
    id,
    index,
    color = '#9ca3af',
    hoverColor = '#fb923c',
    glow = 'rgba(249,115,22,0.9)',
    illustration = false,
}) => {
    const containerRef = useRef(null);
    const iconRef = useRef(null);
    const ringRef = useRef(null);
    const svgRef = useRef(null);

    const yTo = useRef();

    useGSAP(() => {
        // Gentle continuous float, staggered by index so the row doesn't
        // bob in unison. (Visibility/draw-in of the icon itself is handled
        // entirely by OurProcess.jsx's scroll-triggered timeline, which
        // queries .icon-svg path/circle/rect/polyline — duplicating that
        // setup here caused the two to race and leave icons stuck hidden.)
        yTo.current = gsap.to(iconRef.current, {
            y: -8,
            duration: 2.4 + index * 0.25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    }, { scope: containerRef });

    // Full-color illustration: render the icon's own fills/strokes as
    // authored, untouched. Only ref + className are added (for the
    // draw-in animation hook and sizing) — no forced stroke color.
    const illustrationIcon = React.isValidElement(icon)
        ? React.cloneElement(icon, {
            ref: svgRef,
            className: 'icon-svg icon-svg-illustration',
        })
        : null;

    const enhancedIcon = React.isValidElement(icon)
        ? React.cloneElement(icon, {
            ref: svgRef,
            className: 'icon-svg',
            strokeWidth: '1.5',
        })
        : null;

    // Build the extrusion: 6 copies of the same glyph, each pushed back in
    // Z and offset slightly down-right, darkening from the bright front
    // color toward a near-black back color. Rendered inside a
    // preserve-3d/rotateY container, this reads as a genuinely solid
    // extruded block turning in space, not a flat plane. Monochrome
    // line-icon mode only — see `illustration` above for full-color icons.
    const EXTRUSION_DEPTH = 6;
    const extrusionLayers = !illustration && React.isValidElement(icon)
        ? Array.from({ length: EXTRUSION_DEPTH }).map((_, i) => {
            const t = i / (EXTRUSION_DEPTH - 1); // 0 = back, 1 = front
            const isFront = i === EXTRUSION_DEPTH - 1;
            return (
                <div
                    key={i}
                    className="podium-icon-layer"
                    style={{
                        transform: `translateZ(${(i - EXTRUSION_DEPTH + 1) * 2.4}px) translate(${(EXTRUSION_DEPTH - 1 - i) * 0.9}px, ${(EXTRUSION_DEPTH - 1 - i) * 0.9}px)`,
                    }}
                >
                    {React.cloneElement(icon, {
                        className: 'icon-svg',
                        strokeWidth: '1.5',
                        stroke: isFront ? color : `color-mix(in srgb, ${color} ${20 + t * 40}%, black)`,
                        ref: isFront ? svgRef : undefined,
                    })}
                </div>
            );
        })
        : null;

    return (
        <div
            ref={containerRef}
            className="glass-icon-container podium-icon"
            style={{ '--podium-color': color, '--podium-hover': hoverColor, '--podium-glow': glow }}
        >
            <style>{`
                .podium-icon {
                    position: relative;
                    width: 110px;
                    height: 130px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                }
                .podium-number {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    border: 1px solid var(--podium-color);
                    color: var(--podium-color);
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0a0a0a;
                    box-shadow: 0 0 10px var(--podium-glow);
                    z-index: 3;
                }
                .podium-icon-float {
                    position: relative;
                    z-index: 3;
                    margin-bottom: 14px;
                    perspective: 300px;
                }
                .podium-icon-spin {
                    position: relative;
                    transform-style: preserve-3d;
                    animation: podium-icon-rotate 9s linear infinite;
                    width: 34px;
                    height: 34px;
                    filter:
                        drop-shadow(0 0 6px var(--podium-glow))
                        drop-shadow(0 0 16px var(--podium-glow));
                }
                .podium-icon-illustration-wrap {
                    width: 48px;
                    height: 48px;
                    filter:
                        drop-shadow(0 0 6px var(--podium-glow))
                        drop-shadow(0 6px 10px rgba(0,0,0,0.45));
                    animation: podium-icon-tilt 6s ease-in-out infinite;
                    transition: transform 0.3s ease;
                }
                .podium-icon:hover .podium-icon-illustration-wrap {
                    transform: scale(1.08);
                }
                .podium-icon-image {
                    width: 84px;
                    height: 84px;
                    object-fit: contain;
                    filter:
                        drop-shadow(0 0 10px var(--podium-glow))
                        drop-shadow(0 8px 14px rgba(0,0,0,0.5));
                    animation: podium-icon-tilt 6s ease-in-out infinite;
                }
                /* Real rendered PNGs / full-color illustrations already
                   look dimensional — a full 360 spin would just flip them
                   through their mirror image, so these get a gentler
                   back-and-forth tilt instead, which reads as the object
                   rocking in place. */
                @keyframes podium-icon-tilt {
                    0%, 100% { transform: rotateY(-14deg) rotateX(4deg); }
                    50%      { transform: rotateY(14deg) rotateX(-2deg); }
                }
                @keyframes podium-icon-rotate {
                    from { transform: rotateY(0deg); }
                    to   { transform: rotateY(360deg); }
                }
                /* Extrusion layers — stacked copies of the same glyph,
                   offset diagonally and darkened toward the back, so the
                   icon reads as a solid extruded block rather than a flat
                   plane. The front-most (brightest) layer sits last. */
                .podium-icon-layer {
                    position: absolute;
                    inset: 0;
                }
                .podium-icon .icon-svg {
                    width: 34px;
                    height: 34px;
                    fill: none;
                    transition: stroke 0.3s ease;
                }
                .podium-icon .icon-svg-illustration {
                    width: 48px;
                    height: 48px;
                    fill: revert;
                    stroke: revert;
                }
                .podium-icon:hover .icon-svg:not(.icon-svg-illustration) {
                    stroke: var(--podium-hover);
                }
                .podium-base {
                    position: relative;
                    width: 64px;
                    height: 16px;
                    z-index: 2;
                }
                .podium-ring {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    border-radius: 50%;
                    border: 1.5px solid var(--podium-color);
                    opacity: 0.6;
                    transform: translate(-50%, -50%) rotateX(70deg);
                }
                .podium-ring-outer {
                    width: 64px;
                    height: 64px;
                    animation: podium-spin 10s linear infinite;
                    border-style: dashed;
                }
                .podium-ring-inner {
                    width: 44px;
                    height: 44px;
                    animation: podium-spin 7s linear infinite reverse;
                    opacity: 0.9;
                }
                @keyframes podium-spin {
                    from { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(0deg); }
                    to { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(360deg); }
                }
                .podium-glow-core {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 30px;
                    height: 30px;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(circle, var(--podium-glow) 0%, transparent 70%);
                    border-radius: 50%;
                    filter: blur(4px);
                }
                .podium-reflection {
                    display: block;
                    margin-top: 6px;
                    width: 70px;
                    height: 14px;
                    background: radial-gradient(ellipse, var(--podium-glow) 0%, transparent 75%);
                    opacity: 0.35;
                    filter: blur(3px);
                    border-radius: 50%;
                }
            `}</style>

            <span className="podium-number">{id}</span>

            <div ref={iconRef} className="podium-icon-float">
                {imageSrc ? (
                    <img src={imageSrc} alt={imageAlt} className="podium-icon-image" />
                ) : illustration ? (
                    <div className="podium-icon-illustration-wrap">
                        {illustrationIcon}
                    </div>
                ) : (
                    <div className="podium-icon-spin">
                        {extrusionLayers}
                    </div>
                )}
            </div>

            <div ref={ringRef} className="podium-base">
                <span className="podium-ring podium-ring-outer" />
                <span className="podium-ring podium-ring-inner" />
                <span className="podium-glow-core" />
            </div>

            <span className="podium-reflection" />
        </div>
    );
};

export default GlassIcon;