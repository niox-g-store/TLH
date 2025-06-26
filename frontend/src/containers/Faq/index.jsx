import React from "react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import Accordian from "../../components/Accordian/Accordian";

const FAQs = () => {
  const faq = "./assets/faq.png";
  return (
    <>
      <div className="faq-section">
        <HeroBanner
          heading="What can we help you find?"
          desc="Welcome to EventUp Help Center"
          bannerImage={faq}
        />
        <Accordian />
      </div>
    </>
  );
};

export default FAQs;
