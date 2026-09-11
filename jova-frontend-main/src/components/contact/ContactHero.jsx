import React from 'react';

const heroBadges = [
  {
    id: 'hero-badge-trusted',
    label: 'Trusted Engineering Partner',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 'hero-badge-quick',
    label: 'Quick Response',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'hero-badge-precision',
    label: 'Precision in Every Detail',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const ContactHero = () => {
  return (
    <section
      id="contact-hero"
      className="relative w-full bg-[#0d0e10] overflow-hidden border-b border-white/5"
      style={{ minHeight: '200px' }}
    >
      {/* Ambient orange glow — left side */}
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#FF6B00]/10 to-transparent pointer-events-none" />

      <div
        className="relative z-10 max-w-screen-xl mx-auto flex items-stretch px-6 md:px-10 lg:px-16"
        style={{ minHeight: '200px' }}
      >
        {/* LEFT: Text */}
        <div className="flex flex-col justify-center py-10 flex-1 pr-8 lg:pr-16">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-7 h-[2px] bg-[#FF6B00]" />
            <span className="text-[#FF6B00] text-[11px] font-bold uppercase tracking-[0.22em]">
              Contact Our Team
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[1.9rem] md:text-[2.4rem] lg:text-[2.6rem] font-extrabold text-white leading-[1.12] mb-4 tracking-tight">
            Let&apos;s Build Something<br />
            Exceptional Together.
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-xs">
            Share your requirements and our team will get back to you within 24&nbsp;hours.
          </p>

          {/* Badge pills */}
          <div className="flex flex-wrap gap-4 mt-7">
            {heroBadges.map((badge) => (
              <div
                key={badge.id}
                id={badge.id}
                className="flex items-center gap-2.5 group cursor-default select-none"
              >
                <div className="w-10 h-10 rounded-full border border-[#FF6B00]/35 bg-[#FF6B00]/8 flex items-center justify-center text-[#FF6B00] shrink-0 group-hover:bg-[#FF6B00]/18 group-hover:border-[#FF6B00]/60 transition-all duration-300">
                  {badge.icon}
                </div>
                <span className="text-gray-300 text-[11px] font-semibold uppercase tracking-wide leading-tight max-w-[72px]">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Decorative image panels */}
        <div className="hidden lg:flex items-stretch gap-[5px] w-[44%] py-5 shrink-0">

          {/* Panel 1 — dark steel / construction */}
          <div className="flex-1 rounded-lg overflow-hidden relative">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-700"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6B00] via-[#FF6B00]/60 to-transparent" />
          </div>

          {/* Panel 2 — engineering precision */}
          <div className="flex-1 rounded-lg overflow-hidden relative">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-700"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1565043666747-69f6646db940?w=500&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
          </div>

          {/* Panel 3 — textured metal mesh */}
          <div className="flex-[0.65] rounded-lg overflow-hidden relative">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-700"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Bottom divider glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/25 to-transparent" />
    </section>
  );
};

export default ContactHero;
