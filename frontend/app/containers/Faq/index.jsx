import React from "react";
import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import Accordian from "../../components/store/Accordian/Accordian";

const FAQs = () => {
  const faq = "./assets/faq.png";
  return (
    <>
      <div className="faq-section">
        <HeroBanner
          heading="What can we help you find?"
          desc="Welcome to The Link Hangouts Help Center"
          bannerImage={[faq]}
        />
        <Accordian />
      </div>
    </>
  );
};

export default FAQs;
