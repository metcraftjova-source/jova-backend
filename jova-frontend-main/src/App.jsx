import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import PremiumSidebar from './components/PremiumSidebar'

gsap.registerPlugin(ScrollTrigger);

// Lazy load route components
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Product = lazy(() => import('./pages/Product'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))


const API_BASE = import.meta.env.VITE_JOVA_API_URL || 'http://localhost:5001';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);

    // Fire-and-forget anonymous visit ping — never blocks rendering, never
    // shows an error to the visitor if it fails (e.g. backend asleep).
    // See server/models/Visit.js for exactly what is stored (no IPs, no
    // cookies, auto-expires after 180 days).
    fetch(`${API_BASE}/api/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || '' }),
    }).catch(() => {});
  }, [pathname]);
  return null;
}

// A simple loading fallback
const PageLoader = () => (
  <div className="min-h-dvh flex items-center justify-center bg-black">
    <div className="w-8 h-8 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-10 right-10 z-[100] p-4 rounded-full bg-[#ff6b00] text-white shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-110 hover:bg-[#ff8533] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-50 pointer-events-none'
        }`}
      aria-label="Scroll to top"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  // The loading screen now waits for a REAL signal — the hero video's
  // first frame actually being decoded and paintable — instead of a fake
  // fixed-duration timer. This is what fixes the "loading screen finishes
  // but the hero is still blank" problem on slower connections.
  useEffect(() => {
    const handleReady = () => setHeroReady(true);
    window.addEventListener('jova-hero-ready', handleReady);

    // Safety net: if the hero video somehow never becomes ready (blocked
    // asset, very slow/broken connection), don't leave the visitor stuck
    // on the loading screen forever — reveal the page after 6s regardless.
    const failSafe = setTimeout(() => setHeroReady(true), 6000);

    return () => {
      window.removeEventListener('jova-hero-ready', handleReady);
      clearTimeout(failSafe);
    };
  }, []);

  // Sync GSAP ScrollTrigger with Lenis
  useLenis(ScrollTrigger.update);

  return (
    <>
      {loading && <LoadingScreen ready={heroReady} onComplete={() => setLoading(false)} />}
      <ReactLenis root>
        <div className="min-h-dvh bg-black font-sans">
          <ScrollToTop />
          <PremiumSidebar />
          <Header />
          <div>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/Product" element={<Product />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />

              </Routes>
            </Suspense>
            <Footer />
          </div>
          <ScrollToTopButton />
        </div>
      </ReactLenis>
    </>
  )
}

export default App