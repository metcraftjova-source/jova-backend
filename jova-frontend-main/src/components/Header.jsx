import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoShield from '../assets/JM Logo Shield BGR.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [isScrollIdle, setIsScrollIdle] = useState(true);
  const location = useLocation();
  const idleTimerRef = useRef(null);

  // The dock only becomes active once the JOVA logo intro sequence in the
  // Hero has finished (Hero dispatches 'jova-intro-status' as it plays
  // through its scroll-driven frames). Every other page has no intro, so
  // it's active immediately.
  useEffect(() => {
    if (location.pathname !== '/') {
      setIntroDone(true);
      return;
    }

    setIntroDone(false);
    const handleIntroStatus = (e) => setIntroDone(!!e.detail?.done);
    window.addEventListener('jova-intro-status', handleIntroStatus);
    return () => window.removeEventListener('jova-intro-status', handleIntroStatus);
  }, [location.pathname]);

  // Hide the dock while the person is actively scrolling; bring it back
  // once scrolling stops for a moment.
  useEffect(() => {
    const markScrolling = () => {
      setIsScrollIdle(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsScrollIdle(true), 400);
    };

    window.addEventListener('wheel', markScrolling, { passive: true });
    window.addEventListener('touchmove', markScrolling, { passive: true });
    window.addEventListener('scroll', markScrolling, { passive: true });
    return () => {
      window.removeEventListener('wheel', markScrolling);
      window.removeEventListener('touchmove', markScrolling);
      window.removeEventListener('scroll', markScrolling);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  const isDockVisible = introDone && isScrollIdle;

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative transition-colors duration-200 hover:text-[var(--bronze)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${
      isActive(path) ? 'text-[var(--bronze)]' : 'text-white'
    }`;

  const mobileNavLinkClass = (path) =>
    `flex items-center gap-2 hover:text-[var(--bronze)] transition-colors pb-4 border-b border-gray-100 ${
      isActive(path) ? 'text-[var(--bronze)]' : 'text-gray-800'
    }`;

  return (
    <>
      {/* Desktop nav now lives in PremiumSidebar.jsx — this old side dock
          was removed to stop the duplicate/overlapping sidebar. Only the
          mobile tab + slide-out menu below remain, for small screens. */}

      {/* Mobile equivalent of the side dock: a small floating tab, since
          hover doesn't apply on touch — tapping toggles the mobile menu. */}
      <button
        style={{ borderRadius: '0 999px 999px 0 / 0 32px 32px 0' }}
        className={`fixed top-1/2 left-0 -translate-y-1/2 z-50 md:hidden flex items-center justify-center w-8 h-16 bg-black/50 backdrop-blur-xl border border-white/10 border-l-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ${
          isDockVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-full pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <span className="w-2 h-2 rounded-full bg-[var(--bronze)]" />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 xl:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl flex flex-col p-8 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-end mb-8">
            <button
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <nav className="flex flex-col space-y-6 text-lg font-bold tracking-wide">
            <Link to="/" className={mobileNavLinkClass('/')}>
              {isActive('/') && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bronze)] shrink-0" />}
              Home
            </Link>
            <Link to="/about" className={mobileNavLinkClass('/about')}>
              {isActive('/about') && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bronze)] shrink-0" />}
              About
            </Link>
            <Link to="/Product" className={mobileNavLinkClass('/Product')}>
              {isActive('/Product') && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bronze)] shrink-0" />}
              Product
            </Link>
            <Link to="/services" className={mobileNavLinkClass('/services')}>
              {isActive('/services') && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bronze)] shrink-0" />}
              Services
            </Link>
            <Link to="/contact" className={mobileNavLinkClass('/contact')}>
              {isActive('/contact') && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bronze)] shrink-0" />}
              Contact
            </Link>
          </nav>

          <div className="mt-auto">
            <button className="w-full bg-[var(--bronze)] text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 text-base font-display">
              Get started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 19L19 5M19 5v10M19 5H9"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;