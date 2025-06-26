import React from "react";
import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import ContactForm from "../../components/store/ContactForm/ContactForm";

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
