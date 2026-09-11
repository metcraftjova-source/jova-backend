import React from "react";
import { Rocket, ChevronRight } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="w-full bg-[#ffffff] py-16 px-4 md:px-12 relative overflow-hidden flex justify-center">
      {/* Background abstract waves/glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none flex justify-between">
        <div className="w-96 h-96 bg-orange-500/20 blur-[100px] rounded-full -ml-32"></div>
        <div className="w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full -mr-32"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1200px] w-full bg-gradient-to-r from-[#111] via-[#161616] to-[#111] border border-gray-800/60 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 shadow-2xl backdrop-blur-sm">
        {/* Left Icon + Text Container */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
          {/* Circular Icon Container */}
          <div className="w-20 h-20 rounded-full bg-black border border-gray-800 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] group">
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-full border border-orange-500/30 blur-[2px] transition-all group-hover:border-orange-500/60 group-hover:blur-[4px]"></div>

            <Rocket
              size={32}
              className="text-orange-500 relative z-10"
              strokeWidth={1.5}
            />
          </div>

          {/* Text Content */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Ready to shape tomorrow — together
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              Let's create something great together
            </p>
          </div>
        </div>

        {/* Call to Action Button */}
        <button className="group relative flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold py-3 md:py-4 px-8 rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] overflow-hidden shrink-0">
          <span className="relative z-10">Reach out</span>
          <ChevronRight
            size={18}
            className="relative z-10 group-hover:translate-x-1 transition-transform"
          />

          {/* Button highlight effect */}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
        </button>
      </div>
    </section>
  );
}
