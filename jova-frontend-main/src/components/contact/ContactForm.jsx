import React, { useState } from 'react';
import { ScrollReveal } from '../home/ScrollReveal';

const API_BASE = import.meta.env.VITE_JOVA_API_URL || 'http://localhost:5001';

const ContactForm = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle | loading | success | error

  const handleChange = (e) => {
    const { id, value } = e.target;
    const key = id === 'first_name' ? 'firstName' : id === 'last_name' ? 'lastName' : id === 'email_address' ? 'email' : id;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong.');
      }
      setStatus({ state: 'success', message: "Thanks! We'll be in touch shortly." });
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Failed to send message.' });
    }
  };

  return (
    <section id="contact-form" className="w-full bg-[#111315] py-24 px-4 md:px-8 text-white relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-[#FF6B00]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] aspect-square rounded-full bg-[#D4AF37]/10 blur-[100px]" />
      </div>

      <div className="max-w-screen-xl mx-auto relative z-10">

        {/* Section heading */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <h4 className="text-[#FF6B00] text-sm font-bold uppercase tracking-wider mb-2">Get In Touch</h4>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide">Contact Us</h2>
          </ScrollReveal>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* ── Left Column: Address & Map ── */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <ScrollReveal delay={0.3}>
              <div>
                <h3 className="text-2xl font-bold mb-6">Our Headquarters</h3>
                <div className="space-y-6 mb-8 text-gray-300">

                  {/* Address */}
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

                  {/* Phone */}
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

                  {/* Email */}
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

          {/* ── Right Column: Message Form ── */}
          <div className="w-full lg:w-1/2 relative">
            <ScrollReveal delay={0.4} className="h-full">
              <div className="absolute top-10 right-10 w-64 h-64 bg-[#FF6B00]/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#D4AF37]/30 rounded-full blur-[60px] pointer-events-none mix-blend-screen" />

              <div className="bg-white/10 backdrop-blur-[50px] border border-white/40 border-t-white/60 border-l-white/60 border-b-white/10 border-r-white/10 rounded-[2rem] p-8 md:p-10 shadow-[15px_15px_40px_rgba(0,0,0,0.4)] relative overflow-hidden h-full flex flex-col group/form">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shine_8s_infinite] pointer-events-none" />

                <h3 className="text-2xl font-bold mb-8 text-white relative z-10">Contact us to upgrade yourself</h3>

                <form className="space-y-6 relative z-10 flex-grow flex flex-col" onSubmit={handleSubmit}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative pt-6">
                      <input type="text" id="first_name" value={formData.firstName} onChange={handleChange} required className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 focus:bg-white/30 relative z-10" placeholder="First Name" />
                      <label htmlFor="first_name" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">First Name</label>
                    </div>
                    <div className="relative pt-6">
                      <input type="text" id="last_name" value={formData.lastName} onChange={handleChange} className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 focus:bg-white/30 relative z-10" placeholder="Last Name" />
                      <label htmlFor="last_name" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">Last Name</label>
                    </div>
                  </div>

                  <div className="relative pt-6">
                    <input type="email" id="email_address" value={formData.email} onChange={handleChange} required className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 focus:bg-white/30 relative z-10" placeholder="Email Address" />
                    <label htmlFor="email_address" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">Email Address</label>
                  </div>

                  <div className="relative pt-6 flex-grow flex flex-col">
                    <textarea id="message" value={formData.message} onChange={handleChange} required className="peer w-full bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 border-t-white/50 border-l-white/40 border-b-white/10 border-r-white/10 rounded-xl px-5 py-4 text-white placeholder-transparent focus:outline-none focus:border-[#FF6B00]/80 transition-all duration-300 flex-grow resize-none focus:bg-white/30 relative z-10" placeholder="Message" rows="5" />
                    <label htmlFor="message" className="absolute left-6 top-10 text-[11px] text-gray-200 uppercase tracking-widest font-bold drop-shadow-sm transition-all duration-500 transform origin-left -translate-y-9 scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-300 peer-focus:-translate-y-9 peer-focus:scale-90 peer-focus:text-[#FF6B00] peer-focus:drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-20 pointer-events-none">Message</label>
                  </div>

                  {status.state === 'success' && (
                    <p className="text-emerald-400 text-sm font-semibold">{status.message}</p>
                  )}
                  {status.state === 'error' && (
                    <p className="text-red-400 text-sm font-semibold">{status.message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status.state === 'loading'}
                    className="w-full mt-4 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-bold tracking-widest uppercase py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(255,107,0,0.3)] transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status.state === 'loading' ? 'Sending...' : 'Submit Request'}
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
  );
};

export default ContactForm;
