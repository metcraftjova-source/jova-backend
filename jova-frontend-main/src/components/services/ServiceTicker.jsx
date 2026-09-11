import React from 'react';

const services = [
  "STEEL FABRICATIONS",
  "SHOT BLASTING",
  "INDUSTRIAL PAINTING & COATINGS",
  "FACADE SOLUTIONS",
];

const ServiceTicker = () => {
  // Duplicate services several times to create a seamless infinite loop
  const tickerItems = [...services, ...services, ...services, ...services];

  return (
    <div className="w-full bg-[#E34A12] py-4 overflow-hidden">
      <div className="flex w-max animate-marquee-lr items-center">
        {tickerItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="text-white text-sm md:text-sm font-bold tracking-[0.2em] whitespace-nowrap uppercase px-8 md:px-12">
              {item}
            </span>
            {/* Vertical Divider */}
            <div className="h-5 w-px bg-white/30"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTicker;
