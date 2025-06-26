import React from "react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import ContactForm from "../../components/ContactForm/ContactForm";

const ContactUs = () => {
  const contactus = "./assets/contactus.png";
  return (
    <>
      <HeroBanner
        heading="Get in Touch !!"
        desc="Let's start a converstaion"
        bannerImage={contactus}
      />
      <ContactForm />
    </>
  );
};

export default ContactUs;
