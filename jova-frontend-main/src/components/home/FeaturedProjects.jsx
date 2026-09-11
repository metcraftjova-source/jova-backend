import React, { useRef, useEffect } from 'react';
import steelImage from '../../assets/steel_fabrication.png'; // Placeholder for project images
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 1,
    title: 'Commercial Complex',
    category: 'Commercial',
    location: 'Delhi, India',
    details: 'Structural Steel, Glass Facade',
  },
  {
    id: 2,
    title: 'Corporate Office Tower',
    category: 'Commercial',
    location: 'Pune, India',
    details: 'Aluminium Facade, Glass',
  },
  {
    id: 3,
    title: 'Industrial Manufacturing Plant',
    category: 'Industrial',
    location: 'Chennai, India',
    details: 'Steel Structure, Cladding',
  },
  {
    id: 4,
    title: 'Luxury Residential Project',
    category: 'Residential',
    location: 'Bengaluru, India',
    details: 'Aluminium Systems, Glass',
  }
];

const FeaturedProjects = () => {
  const containerRef = useRef(null);
  const projectsRef = useRef([]);

  // To allow pushing refs correctly without duplicates on re-renders
  projectsRef.current = [];

  const addToRefs = el => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el);
    }
  };

  useGSAP(() => {
    // Animate heading in
    gsap.fromTo(".projects-heading",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    projectsRef.current.forEach((projectEl, index) => {
      if (!projectEl) return;
      const ball = projectEl.querySelector('.falling-ball');
      const revealWrapper = projectEl.querySelector('.project-reveal-wrapper');
      const imgContainer = projectEl.querySelector('.project-img-container');
      const meta = projectEl.querySelector('.project-meta');
      const title = projectEl.querySelector('.project-title');
      const desc = projectEl.querySelector('.project-desc');
      const btn = projectEl.querySelector('.project-btn');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: projectEl,
          start: "top 50%", // Trigger when the top of the project reaches the middle of the viewport
          toggleActions: "play reverse play reverse", // Play forward on scroll down, reverse on scroll up
        }
      });

      // Select all the inner content elements
      const contentElements = projectEl.querySelectorAll('.project-img-container, .project-meta, .project-title, .project-desc, .project-btn');

      // 1. Ball falls from above
      tl.fromTo(ball,
        { y: '-50vh', scale: 1, backgroundColor: "#ff6b00" },
        { y: 0, duration: 0.6, ease: "bounce.out" }
      )
        // 2. Ball scales up to massively cover the screen and turns white-ish
        .to(ball, {
          scale: 80, // 50px * 80 = 4000px diameter
          backgroundColor: "#f9f9f9",
          duration: 0.8,
          ease: "power2.inOut"
        })
        // 3. Content inside fades and slides up in a staggered sequence
        .fromTo(contentElements,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
          "-=0.4" // Start slightly before the ball finishes expanding
        );

      // Add a subtle parallax to the image itself as user continues scrolling
      const img = projectEl.querySelector('.project-parallax-img');
      if (img) {
        gsap.to(img, {
          y: '10%',
          ease: "none",
          scrollTrigger: {
            trigger: projectEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-[#ffffff] text-white border-t border-white/5 py-24 lg:py-32 overflow-hidden">

      {/* Header Content */}
      <div className="projects-heading flex flex-col lg:flex-row justify-between items-start lg:items-end w-full max-w-[1600px] mx-auto mb-24 px-4 md:px-10 lg:px-12 z-10 relative">
        <div>
          <span className="text-[#ff6b00] font-bold text-[11px] tracking-widest uppercase mb-4 block">
            PROJECT PORTFOLIO
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold leading-[1.1] text-black">
            Delivering Excellence. <br />
            Creating <span className="text-[#ff6b00]">Lasting Value.</span>
          </h2>
        </div>

        <button className="mt-10 lg:mt-0 flex items-center gap-3 border border-[#ff6b00] text-[#ff6b00] bg-transparent hover:bg-[#ff6b00] hover:text-white transition-colors duration-300 text-[11px] font-bold py-4 px-8 rounded-full border-opacity-50">
          VIEW ALL PROJECTS
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Projects List */}
      <div className="w-full flex flex-col">
        {projectsData.map((project, idx) => (
          <div
            key={project.id}
            ref={addToRefs}
            className="relative w-full h-dvh overflow-hidden flex items-center justify-center bg-[#ffffff]"
          >
            {/* The ball that scales up to become the background */}
            <div className="falling-ball absolute left-1/2 top-1/2 w-[50px] h-[50px] -ml-[25px] -mt-[25px] rounded-full bg-[#ff6b00] z-10 shadow-[0_0_20px_rgba(255,107,0,0.5)]"></div>

            {/* Revealed Project Content */}
            <div className="inner-content relative z-20 w-full h-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

              {/* Image Section */}
              <div className={`project-img-container w-full lg:w-3/5 h-[40dvh] lg:h-[70dvh] rounded-[30px] overflow-hidden relative shadow-2xl bg-[#111111] ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <img
                  src={steelImage}
                  alt={project.title}
                  className="project-parallax-img w-full h-[120%] object-cover absolute top-[-10%] left-0"
                />
                <div className="absolute top-6 left-6 lg:top-8 lg:left-8 bg-[#ff6b00] text-white text-[12px] font-bold px-5 py-2 rounded-full uppercase tracking-widest z-10">
                  {project.category}
                </div>
              </div>

              {/* Content Section */}
              <div className={`w-full lg:w-2/5 flex flex-col justify-center ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div className="project-meta flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#ff6b00]"></span>
                  <span className="text-black font-medium tracking-wide uppercase text-sm">
                    {project.location}
                  </span>
                </div>

                <h3 className="project-title text-black font-semibold text-3xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                  {project.title}
                </h3>

                <p className="project-desc text-gray-600 text-lg lg:text-xl leading-relaxed mb-10">
                  {project.details}. We fuse architectural vision with structural integrity to deliver outstanding properties that redefine spaces.
                </p>

                <button className="project-btn self-start relative group text-black font-semibold flex items-center gap-4 hover:text-[#ff6b00] transition-colors duration-300">
                  <span className="text-sm uppercase tracking-widest font-bold">Explore Project</span>
                  <span className="w-12 h-[2px] bg-black group-hover:bg-[#ff6b00] group-hover:w-16 transition-all duration-300"></span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedProjects;
