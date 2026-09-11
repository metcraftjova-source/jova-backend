import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const GlassIcon = ({ children, className = '' }) => {
    const containerRef = useRef(null);
    const glassRef = useRef(null);
    const svgWrapperRef = useRef(null);
    const glowRef = useRef(null);

    const [isHovered, setIsHovered] = useState(false);

    useGSAP(() => {
        // Idle animation
        const idleCtx = gsap.context(() => {
            // Gentle float
            gsap.to(glassRef.current, {
                y: -4,
                rotationZ: 0.5,
                duration: 3 + Math.random(),
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
            });

            // Ambient glow pulse
            gsap.to(glowRef.current, {
                opacity: 0.15,
                scale: 1.05,
                duration: 4 + Math.random(),
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
            });
        }, containerRef);

        return () => idleCtx.revert();
    }, { scope: containerRef });

    const handleMouseMove = (e) => {
        if (!containerRef.current || !glassRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on cursor position
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
        const rotateY = ((x - centerX) / centerX) * 15;

        gsap.to(glassRef.current, {
            rotateX,
            rotateY,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 1000,
        });

        // Move reflection
        const highlight = glassRef.current.querySelector('.glass-highlight');
        if (highlight) {
            gsap.to(highlight, {
                x: (x / rect.width) * 100 - 50 + '%',
                y: (y / rect.height) * 100 - 50 + '%',
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);

        gsap.to(glassRef.current, {
            scale: 1.08,
            z: 20,
            duration: 0.5,
            ease: 'back.out(1.5)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.7), 0 30px 60px rgba(227, 74, 18, 0.25)',
        });

        gsap.to(glowRef.current, {
            opacity: 0.25,
            scale: 1.15,
            duration: 0.3,
        });

        gsap.to(svgWrapperRef.current, {
            z: 30, // push SVG forward
            scale: 1.1,
            duration: 0.5,
            ease: 'back.out(2)',
        });

        // Trigger stroke animation in children if they have the specific classes
        if (svgWrapperRef.current) {
            const paths = svgWrapperRef.current.querySelectorAll('.draw-stroke');
            if (paths.length > 0) {
                gsap.fromTo(paths,
                    { strokeDasharray: 300, strokeDashoffset: 300 },
                    { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out', stagger: 0.1 }
                );
            }

            const fills = svgWrapperRef.current.querySelectorAll('.fade-fill');
            if (fills.length > 0) {
                gsap.fromTo(fills,
                    { opacity: 0.4, scale: 0.95, transformOrigin: '50% 50%' },
                    { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
                );
            }
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);

        gsap.to(glassRef.current, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            z: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5), 0 10px 30px rgba(0,0,0,0.05)',
            transformPerspective: 1000,
        });

        gsap.to(glowRef.current, {
            opacity: 0.1,
            scale: 1,
            duration: 0.7,
        });

        gsap.to(svgWrapperRef.current, {
            z: 0,
            scale: 1,
            duration: 0.5,
        });

        const highlight = glassRef.current.querySelector('.glass-highlight');
        if (highlight) {
            gsap.to(highlight, {
                x: '0%',
                y: '0%',
                duration: 0.7,
                ease: 'power2.out'
            });
        }
    };

    const handleClick = () => {
        gsap.timeline()
            .to(glassRef.current, {
                scale: 0.95,
                z: -10,
                duration: 0.1,
                ease: 'power1.inOut'
            })
            .to(glassRef.current, {
                scale: (isHovered ? 1.08 : 1),
                z: (isHovered ? 20 : 0),
                duration: 0.4,
                ease: 'back.out(2)'
            });

        // Pulse highlight on click
        const highlight = glassRef.current.querySelector('.glass-highlight');
        if (highlight) {
            gsap.timeline()
                .to(highlight, { opacity: 0.9, duration: 0.1 })
                .to(highlight, { opacity: 0.5, duration: 0.4 });
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 cursor-pointer ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ perspective: '1000px' }}
        >
            {/* Ambient shadow/glow beneath */}
            <div
                ref={glowRef}
                className="absolute inset-2 rounded-3xl bg-slate-900 blur-[24px] opacity-10 translate-y-3 pointer-events-none"
            />

            {/* Glass Container */}
            <div
                ref={glassRef}
                className="absolute inset-0 rounded-[28px] border border-white/60 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5), 0 10px 30px rgba(0,0,0,0.05)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform'
                }}
            >
                {/* Dynamic Highlight */}
                <div
                    className="glass-highlight absolute -inset-[150%] bg-gradient-to-br from-white/80 via-white/10 to-transparent opacity-50 blur-xl pointer-events-none rounded-full transition-opacity duration-300"
                    style={{ transform: 'translate(0%, 0%)' }}
                />

                {/* SVG Wrapper */}
                <div
                    ref={svgWrapperRef}
                    className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};