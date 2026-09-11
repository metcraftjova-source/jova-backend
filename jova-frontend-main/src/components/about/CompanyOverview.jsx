import React from 'react';
import { Award, Briefcase, Users, Globe, ChevronRight } from 'lucide-react';

export default function CompanyOverview() {
  return (
    <section className="w-full bg-[#ffffff] py-20 px-8 md:px-24 flex flex-col lg:flex-row items-center justify-between gap-16">
      {/* Left Content */}
      <div className="flex-1 max-w-xl">
        <h4 className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-4 flex items-center gap-2">
          COMPANY OVERVIEW <span className="w-8 h-[1px] bg-orange-500 inline-block"></span>
        </h4>
        <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
          Engineering <br />
          a Better Future
        </h2>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Our company specializes in high-quality manufacturing solutions built on innovation, precision engineering, and customer trust. From design to production, every product reflects our commitment to quality, efficiency, and continuous improvement.
        </p>

        <button className="px-6 py-3 bg-[#111] hover:bg-[#222] border border-gray-800 rounded-full text-white font-medium transition-all flex items-center gap-3">
          Learn More About Us
          <span className="text-orange-500">
            <ChevronRight size={18} />
          </span>
        </button>
      </div>

      {/* Right Content - Stats Card */}
      <div className="flex-1 w-full max-w-2xl">
        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#111111] rounded-3xl p-8 md:p-12 border border-gray-600/30 shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-105 hover:from-[#333333] hover:to-[#1a1a1a] hover:border-orange-500/30 cursor-default">
          {/* Subtle glowing background effect inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8">
            {/* Stat 1 */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-black/50 border border-gray-800 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,107,0,0.1)] shrink-0">
                <Award className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-orange-500 mb-1">20+</h3>
                <p className="text-gray-400 text-sm font-medium">Years Experience</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-black/50 border border-gray-800 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,107,0,0.1)] shrink-0">
                <Briefcase className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-orange-500 mb-1">500+</h3>
                <p className="text-gray-400 text-sm font-medium">Projects Completed</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-black/50 border border-gray-800 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,107,0,0.1)] shrink-0">
                <Users className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-orange-500 mb-1">100+</h3>
                <p className="text-gray-400 text-sm font-medium">Employees</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-black/50 border border-gray-800 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,107,0,0.1)] shrink-0">
                <Globe className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-orange-500 mb-1">30+</h3>
                <p className="text-gray-400 text-sm font-medium">Countries Served</p>
              </div>
            </div>

          </div>

          {/* Grid Separators */}
          <div className="hidden sm:block absolute top-1/2 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent -translate-y-1/2"></div>
          <div className="hidden sm:block absolute left-1/2 top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-gray-800 to-transparent -translate-x-1/2"></div>
        </div>
      </div>
    </section>
  );
}
