import React, { useState } from 'react';
import { ScrollReveal } from './ScrollReveal';

const testimonialsData = [
  {
    quote: "Jova Metacraft delivered our project with exceptional quality and on time. Their professionalism and attention to detail are commendable.",
    name: "Rajesh Sharma",
    title: "Project Manager, L&T",
    logo: "L&T"
  },
  {
    quote: "Excellent craftsmanship and durability. Jova Metacraft is our go-to partner for all our complex engineering projects.",
    name: "Alka Verma",
    title: "Director, Shapoorji Pallonji",
    logo: "Shapoorji Pallonji"
  },
  {
    quote: "Their advanced technology and quality standards are truly impressive. Great experience working with Jova Metacraft.",
    name: "Vikram Mehta",
    title: "Head of Engineering, Godrej",
    logo: "Godrej"
  },
  {
    quote: "Reliable, efficient, and innovative. Jova Metacraft is our trusted manufacturing partner.",
    name: "Neha Kapoor",
    title: "Procurement Head, Tata Projects",
    logo: "TATA"
  }
];

const QuoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500 mb-6">
    <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.694 20 8.016V9.006H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.694 6 8.016V9.006H10V18H0Z" fill="currentColor" />
  </svg>
);

const Testimonials = () => {
  const [activeCard, setActiveCard] = useState(null);

  // Duplicate array for seamless marquee effect
  const repeatedData = [...testimonialsData, ...testimonialsData, ...testimonialsData];

  return (
    <section className="py-20 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <ScrollReveal delay={0.1}>
            <h4 className="text-orange-500 font-semibold tracking-wider uppercase text-sm mb-2">Testimonials</h4>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold">Trusted by Businesses Across Industries </h2>
          </ScrollReveal>
        </div>
      </div>

      <div className="relative w-full">
        <ScrollReveal delay={0.4}>
          {/* Marquee Container */}
          <div className="flex w-max animate-marquee-lr gap-6 px-4 pb-8 hover:animation-play-state-paused">
            {repeatedData.map((testimonial, index) => (
              <div
                key={index}
                onClick={() => setActiveCard(index)}
                className={`w-[320px] md:w-[350px] flex-shrink-0 cursor-pointer bg-white/5 backdrop-blur-md rounded-xl p-8 flex flex-col justify-between h-[300px] border transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] ${activeCard === index
                  ? 'border-orange-500 scale-105 z-10 shadow-lg shadow-orange-500/20 bg-white/10'
                  : 'border-white/10 hover:border-white/30 hover:scale-[1.02] hover:bg-white/10'
                  }`}
              >
                <div>
                  <QuoteIcon />
                  <p className="text-black text-sm leading-relaxed mb-8">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <h5 className="font-semibold text-orange-500  text-sm">{testimonial.name}</h5>
                    <p className="text-black text-xs mt-1">{testimonial.title}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="font-bold text-gray-400 text-lg tracking-tighter">
                      {testimonial.logo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;
