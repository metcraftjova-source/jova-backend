import React from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactForm from '../components/contact/ContactForm';
import ContactFooter from '../components/contact/ContactFooter';

const ContactPage = () => {
  return (
    <main>
      {/* 1. Hero banner — headline, badges & image panels */}
      <ContactHero />

      {/* 2. Form section — address, map & message form */}
      <ContactForm />

      {/* 3. Footer strip — 4 feature cards */}
      <ContactFooter />
    </main>
  );
};

export default ContactPage;
