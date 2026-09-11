import React from 'react';

const stats = [
  { value: '1', symbol: '+', label: 'YEARS OF EXPERIENCE' },
  { value: '50', symbol: '+', label: 'PROJECTS DELIVERED' },
  { value: '6', symbol: '+', label: 'TIER 1 CLIENTS' },
  { value: '100', symbol: '%', label: 'ON-TIME EXECUTION' },
];

const ServiceStats = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-gray-200">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center py-20 px-8 text-center border-r border-gray-200 last:border-r-0 bg-white hover:bg-[#F2F4F7] transition-colors duration-300"
        >
          <div className="text-6xl md:text-7xl font-bold text-[#1a1f2c] mb-3 flex items-baseline tracking-tight">
            {stat.value}
            <span className="text-[#E34A12]">{stat.symbol}</span>
          </div>
          <div className="text-[#8e95a5] text-xs md:text-[13px] font-bold tracking-[0.15em] uppercase">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceStats;
