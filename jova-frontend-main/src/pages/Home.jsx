import React from "react";
import Hero from "../components/home/Hero";
import AboutSection from "../components/home/AboutSection";
// import FeaturedProjects from "../components/home/FeaturedProjects";
import CoreCapabilities from "../components/home/CoreCapabilities";
import OurProcess from "../components/home/OurProcess";
import IndustriesAndTech from "../components/home/IndustriesAndTech";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";
import ClientLogos from "../components/home/ClientLogos";
import ContactForm from "../components/contact/ContactForm";

const Home = () => {
  return (
    <main>
      <Hero />
      <AboutSection />
      {/* <FeaturedProjects /> */}
      <IndustriesAndTech />
      {/* <Testimonials /> */}
      <CallToAction />
      <CoreCapabilities />
      <OurProcess />
      <ContactForm />
      <ClientLogos />
    </main>
  );
};

export default Home;