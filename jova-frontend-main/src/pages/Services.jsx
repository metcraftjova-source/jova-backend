import React from 'react';
import ServiceHero from '../components/services/ServiceHero';
import ServiceTicker from '../components/services/ServiceTicker';
import ServiceStats from '../components/services/ServiceStats';
import ServiceGrid from '../components/services/ServiceGrid';
import ManufacturingProcess from '../components/about/ManufacturingProcess';
const Services = () => {
  return (
    <div className="bg-white min-h-dvh">
      <ServiceHero />
      <ServiceTicker />
      <ServiceStats />
      <ServiceGrid />
      <ManufacturingProcess />
    </div>
  );
};

export default Services;
