import React from 'react';
import { ScrollReveal } from '../home/ScrollReveal';

/* ─── Hero badge data ─────────────────────────────────── */
const badges = [
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

const Contact = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO BANNER SECTION
      ══════════════════════════════════════════════════════ */}
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
          {/* ── LEFT: Text ───────────────────────────────────── */}
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
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  id={badge.id}
                  className="flex items-center gap-2.5 group cursor-default select-none"
                >
                  {/* Icon circle */}
                  <div className="w-10 h-10 rounded-full border border-[#FF6B00]/35 bg-[#FF6B00]/8 flex items-center justify-center text-[#FF6B00] shrink-0 group-hover:bg-[#FF6B00]/18 group-hover:border-[#FF6B00]/60 transition-all duration-300">
                    {badge.icon}
                  </div>
                  {/* Label */}
                  <span className="text-gray-300 text-[11px] font-semibold uppercase tracking-wide leading-tight max-w-[72px]">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Decorative image panels ──────────────── */}
          <div className="hidden lg:flex items-stretch gap-[5px] w-[44%] py-5 shrink-0">

            {/* Panel 1 — dark steel / construction */}
            <div className="flex-1 rounded-lg overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-700"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />
              {/* Top accent line */}
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
              {/* Top gold accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* Bottom divider glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/25 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTACT FORM SECTION (existing)
      ══════════════════════════════════════════════════════ */}
      <section id="contact" className="w-full bg-[#111315] py-24 px-4 md:px-8 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-[#FF6B00]/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] aspect-square rounded-full bg-[#D4AF37]/10 blur-[100px]" />
        </div>

        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal delay={0.1}>
              <h4 className="text-[#FF6B00] text-sm font-bold uppercase tracking-wider mb-2">Get In Touch</h4>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide">Contact Us</h2>
            </ScrollReveal>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* Left Column — Address & Map */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <ScrollReveal delay={0.3}>
                <div>
                  <h3 className="text-2xl font-bold mb-6">Our Headquarters</h3>
                  <div className="space-y-6 mb-8 text-gray-300">
                    <a
                      href="#google-map"
                      onClick={(e) => {
                        e.preventDefault();
                        const mapEl = document.getElementById('google-map');
                        if (mapEl) {
                          mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          mapEl.classList.add('ring-4', 'ring-[#FF6B00]', 'scale-[1.02]');
                          setTimeout(() => mapEl.classList.remove('ring-4', 'ring-[#FF6B00]', 'scale-[1.02]'), 1000);
                        }
                      }}
                      className="flex items-start space-x-4 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-[#FF6B00] group-hover:bg-[#FF6B00]/10 group-hover:border-[#FF6B00]/30 transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1 text-lg group-hover:text-[#FF6B00] transition-colors">Address</h5>
                        <p className="leading-relaxed">Sy. No.47/2A1B, 47/3A2, Matham Agragaram, ESI Ring Road,<br /> Mookandapalli Post Opp.AVS Housing Colony,<br /> HOSUR-635 126</p>
                      </div>
                    </a>

                    <a href="tel:+917397735106" className="flex items-start space-x-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-[#FF6B00] group-hover:bg-[#FF6B00]/10 group-hover:border-[#FF6B00]/30 transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1 text-lg group-hover:text-[#FF6B00] transition-colors">Phone</h5>
                        <p className="leading-relaxed">+91 7397735106</p>
                      </div>
                    </a>

                    <a href="mailto:contact@jova.com" className="flex items-start space-x-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-[#FF6B00] group-hover:bg-[#FF6B00]/10 group-hover:border-[#FF6B00]/30 transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1 text-lg group-hover:text-[#FF6B00] transition-colors">Email</h5>
                        <p className="leading-relaxed">contact@jova.com</p>
                      </div>
                    </a>
                  </div>
                </div>
              </ScrollReveal>

              {/* Google Maps Embed */}
              <ScrollReveal delay={0.4}>
                <div className="relative group rounded-3xl z-10 flex items-center justify-center p-[2px] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="w-[200%] aspect-square rounded-full animate-[spin_4s_linear_infinite] conic-glow opacity-50 blur-3xl group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square animate-[spin_4s_linear_infinite] conic-glow z-0" />
                  <div id="google-map" className="w-full h-72 md:h-80 rounded-[calc(1.5rem-2px)] overflow-hidden relative bg-[#111315] z-10 transition-all duration-500">
                    <div className="absolute inset-0 bg-[#FF6B00]/20 mix-blend-overlay pointer-events-none group-hover:opacity-0 transition-opacity duration-700 z-20" />
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.6177440888473!2d77.78912007515017!3d12.738341919949262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae71004d3c2af7%3A0xd663478bd01e130f!2sJOVA%20METCKAFT!5e0!3m2!1sen!2sus!4v1783577046430!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="relative z-10 w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column — Form */}
            <div className="w-full lg:w-1/2 relative">
              <ScrollReveal delay={0.4} className="h-full">
                <div className="absolute top-10 right-10 w-64 h-64 bg-[#FF6B00]/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#D4AF37]/30 rounded-full blur-[60px] pointer-events-none mix-blend-screen" />

                <div className="bg-white/10 backdrop-blur-[50px] border border-white/40 border-t-white/60 border-l-white/60 border-b-white/10 border-r-white/10 rounded-[2rem] p-8 md:p-10 shadow-[15px_15px_40px_rgba(0,0,0,0.4)] relative overflow-hidden h-full flex flex-col group/form">
                  <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shine_8s_infinite] pointer-events-none" />

                  <h3 className="text-2xl font-bold mb-8 text-white relative z-10">Send us a message</h3>

                  <form className="space-y-6 relative z-10 flex-grow flex flex-col" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative pt-6">
                        <input type="text" id="first_name" className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 focus:bg-white/30 relative z-10" placeholder="First Name" />
                        <label htmlFor="first_name" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">First Name</label>
                      </div>
                      <div className="relative pt-6">
                        <input type="text" id="last_name" className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 focus:bg-white/30 relative z-10" placeholder="Last Name" />
                        <label htmlFor="last_name" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">Last Name</label>
                      </div>
                    </div>

                    <div className="relative pt-6">
                      <input type="email" id="email_address" className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 focus:bg-white/30 relative z-10" placeholder="Email Address" />
                      <label htmlFor="email_address" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">Email Address</label>
                    </div>

                    <div className="relative pt-6 flex-grow flex flex-col">
                      <textarea id="message" className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 flex-grow resize-none focus:bg-white/30 relative z-10" placeholder="Message" rows="5" />
                      <label htmlFor="message" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">Message</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-bold tracking-widest uppercase py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(255,107,0,0.3)] transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Submit Request
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>

        <style>{`
          @keyframes shine {
            0%   { left: -100%; }
            15%  { left: 200%;  }
            100% { left: 200%;  }
          }
          @keyframes gradientMove {
            0%   { background-position: 0% 50%;   }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%;   }
          }
          .conic-glow {
            background: conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              #FF6B00 70deg,
              transparent 70deg,
              transparent 180deg,
              #D4AF37 250deg,
              transparent 250deg,
              transparent 360deg
            );
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURE STRIP SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        id="contact-features"
        className="relative w-full bg-[#0d0e10] border-t border-white/5 overflow-hidden"
      >
        {/* Subtle orange glow center */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B00]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">

            {/* Card 1 — Expert Support */}
            <div id="feature-expert" className="group flex items-start gap-4 bg-[#0d0e10] px-6 py-7 hover:bg-[#FF6B00]/5 transition-colors duration-300 cursor-default">
              <div className="shrink-0 w-12 h-12 rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00]/20 group-hover:border-[#FF6B00]/60 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-[#FF6B00] transition-colors duration-300">Expert Support</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Dedicated team ready to assist you</p>
              </div>
            </div>

            {/* Card 2 — Quality Assured */}
            <div id="feature-quality" className="group flex items-start gap-4 bg-[#0d0e10] px-6 py-7 hover:bg-[#FF6B00]/5 transition-colors duration-300 cursor-default">
              <div className="shrink-0 w-12 h-12 rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00]/20 group-hover:border-[#FF6B00]/60 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.723 3.065 3.745 3.745 0 01-3.065.723A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.065-.723 3.745 3.745 0 01-.723-3.065A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.723-3.065 3.746 3.746 0 013.065-.723A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.065.723 3.746 3.746 0 01.723 3.065A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-[#FF6B00] transition-colors duration-300">Quality Assured</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Precision in every project we deliver</p>
              </div>
            </div>

            {/* Card 3 — On-Time Delivery */}
            <div id="feature-delivery" className="group flex items-start gap-4 bg-[#0d0e10] px-6 py-7 hover:bg-[#FF6B00]/5 transition-colors duration-300 cursor-default">
              <div className="shrink-0 w-12 h-12 rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00]/20 group-hover:border-[#FF6B00]/60 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-[#FF6B00] transition-colors duration-300">On-Time Delivery</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Committed to your timelines</p>
              </div>
            </div>

            {/* Card 4 — Long-Term Partnership */}
            <div id="feature-partnership" className="group flex items-start gap-4 bg-[#0d0e10] px-6 py-7 hover:bg-[#FF6B00]/5 transition-colors duration-300 cursor-default">
              <div className="shrink-0 w-12 h-12 rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00]/20 group-hover:border-[#FF6B00]/60 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-[#FF6B00] transition-colors duration-300">Long-Term Partnership</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Building relationships that last</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
