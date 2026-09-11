import React from 'react';
import { ArrowRight } from 'lucide-react';
import VideoLoop from '../common/VideoLoop';

const ServiceHero = () => {
  return (
    <div
      className="relative w-full h-[80dvh] min-h-[600px] flex flex-col lg:flex-row bg-[#111315] overflow-hidden"
    >
      {/* Left Content (50%) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10 relative">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-white tracking-wide uppercase leading-tight mb-2">
            Built once,<br />
            <span className="text-[#FF5722]">trusted forever</span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-xl leading-relaxed">
            We engineer precision steel fabrication and industrial solutions that deliver unmatched strength, superior quality, and long-term reliability for every project.
          </p>
        </div>
      </div>

      {/* Right Image Sequence (50%) */}
      <div className="w-full lg:w-1/2 h-full relative overflow-hidden hidden lg:block">
        {/* Subtle gradient to blend left side with right side */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#111315] to-transparent z-10"></div>
        <VideoLoop
          src="/frame_5.mp4"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default ServiceHero;
