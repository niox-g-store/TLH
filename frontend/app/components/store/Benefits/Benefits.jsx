import React from "react";
import "./Benefits.css";

const Benefits = () => {
  const benefitsIMG = "./assets/events/event_7.jpeg";
  return (
    <>
      <section className="benefits">
        <div className="container">
          <div className="benefits-row-wrapper">
            <div className="col-benefits-image" data-aos="fade-up">
              <img className="border-10" src={benefitsIMG} alt="benefits-image" />
            </div>
            <div className="col-benefits-content">
              <p className="p-content p-all-features" data-aos="fade-up">
                <strong className="p-white">Why It Works for You</strong>
              </p>
              <h2 className="h2-content h2-all-features" data-aos="fade-up">
                Stress Free Events, Happy Attendees, Real Results
              </h2>
              <p className="p-content p-all-features p-white" data-aos="fade-up">
                We don’t just give you tools, we help you save time, sell more, and keep your audience coming back. Here’s what makes The Link Hangouts the smarter choice for creators like you
              </p>
              <ul>
                <li data-aos="fade-right">Privacy & ticket security</li>
                <li data-aos="fade-right">Engagement tools</li>
                <li data-aos="fade-right">Easy last-minute updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Benefits;
