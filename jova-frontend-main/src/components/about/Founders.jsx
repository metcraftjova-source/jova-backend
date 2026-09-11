import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Linkedin = ({ size = 24, fill = "none", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const foundersData = [
  {
    id: 1,
    name: "Arun Mehta",
    role: "Co-Founder & CEO",
    description:
      "Visionary leader with 20+ years of experience in engineering and manufacturing.",
    image: "/images/founder_arun.png",
  },
  {
    id: 2,
    name: "Neha Sharma",
    role: "Co-Founder & COO",
    description:
      "Operations expert focused on process excellence and business growth.",
    image: "/images/founder_neha.png",
  },

];

export default function Founders() {
  return (
    <section className="w-full bg-[#ffffff] py-20 px-4 md:px-12 relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <h4 className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-3">
          OUR FOUNDERS
        </h4>
        <h2 className="text-4xl md:text-5xl font-bold text-black">
          The People Behind Our <span className="text-orange-500">Success</span>
        </h2>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 max-w-[900px] mx-auto w-full relative z-10">
        {foundersData.map((founder) => {
          return (
            <div
              key={founder.id}
              className="w-full max-w-[340px] cursor-default"
            >
              <div className="w-full bg-gradient-to-br from-[#181818] to-[#0a0a0a] rounded-3xl overflow-hidden border border-gray-800 relative group shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
                {/* Subtle orange glow at bottom left */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/20 blur-2xl rounded-full transition-opacity group-hover:bg-orange-500/40"></div>

                <div className="flex flex-col h-[400px]">
                  {/* Image Section */}
                  <div className="w-full h-[200px] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="px-8 pb-8 flex flex-col justify-end relative z-20 w-full flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {founder.name}
                    </h3>
                    <p className="text-orange-500 text-sm font-semibold mb-4">
                      {founder.role}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {founder.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
