import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ProductHero from '../components/product/ProductHero';
import ProductRange from '../components/product/ProductRange';

const Product = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    // Page load fade-in transition
    gsap.fromTo(pageRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
    );
  }, []);

  return (
    <div ref={pageRef} className="min-h-dvh bg-[#070707] font-sans">
      <ProductHero />
      <ProductRange />
    </div>
  );
};

export default Product;
