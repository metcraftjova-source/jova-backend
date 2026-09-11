import React from 'react';
import { Link } from 'react-router-dom';
import logoFull from '../assets/JM Logo BGR.png';

const Footer = () => {
  return (
    <footer className="bg-white/20 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border-t border-white/50 relative z-20">
      <div className="relative z-20 py-16 px-8 md:px-16 lg:px-24 max-w-[1920px] mx-auto text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Logo Section */}
          <div className="flex flex-col items-start justify-center lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 mb-4 inline-block hover:scale-105 transition-transform duration-300">
              <img src={logoFull} alt="JOVA METCRAFT" className="h-16 md:h-20 object-contain" />
            </div>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">
              Where imagination meets infrastructure
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col">
            <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
            <ul className="space-y-4 text-[13px] font-semibold text-gray-300">
              <li><Link to="/" className="hover:text-[#FF6B00] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#FF6B00] transition-colors">About</Link></li>
              <li><Link to="/Product" className="hover:text-[#FF6B00] transition-colors">Product</Link></li>
              <li><Link to="/services" className="hover:text-[#FF6B00] transition-colors">Services</Link></li>
              <li><a href="/#contact" className="hover:text-[#FF6B00] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Contact Us</h4>
            <ul className="space-y-5 text-[13px] font-semibold text-gray-300">
              <li className="flex items-center space-x-3 group">
                <svg className="w-5 h-5 text-[#FF6B00] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <a href="mailto:info@jovametcraft.com" className="hover:text-white transition-colors">info@jovametcraft.com</a>
              </li>
              <li className="flex items-center space-x-3 group">
                <svg className="w-5 h-5 text-[#FF6B00] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 7397735106</a>
              </li>
              <li className="flex items-start space-x-3 group">
                <svg className="w-5 h-5 text-[#FF6B00] group-hover:text-[#D4AF37] transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="hover:text-white transition-colors cursor-default">Sy. No.47/2A1B, 47/3A2, Matham Agragaram,ESI Ring Road,Mookandapalli Post Opp.AVS Housing Colony, HOSUR-635 126</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Jova Metcraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;