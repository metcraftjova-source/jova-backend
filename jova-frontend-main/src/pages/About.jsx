import React from 'react';
import ImageSequenceHero from '../components/about/ImageSequenceHero';

import VisionMission from '../components/about/VisionMission';
import Founders from '../components/about/Founders';

import AboutCTA from '../components/about/AboutCTA';

export default function About() {
  return (
    <div className="bg-black min-h-dvh text-white">
      <ImageSequenceHero />
      <VisionMission />
      <Founders />
      <AboutCTA />
    </div>
  );
}
