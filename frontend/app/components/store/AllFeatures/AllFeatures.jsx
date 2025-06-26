import React from "react";
import "./AllFeatures.css";

const AllFeatures = () => {
  const features = "./assets/events/event_6.jpg";
  return (
    <>
      <section className="all-featuers">
        <div className="container">
          <div className="all-features-row-wrapper">
            <div className="col-features-content">
              <p className="p-info p-all-features ff h6" data-aos="fade-up">
                All Features
              </p>
              <h2 className="h2-content h2-all-features" data-aos="fade-up">
                Everything You Need to Host Events
              </h2>
              <p className="p-info p-all-features" data-aos="fade-up">
                From ticketing to promotion, we give you all the tools to host events that sell out and stand out.
              </p>
              <div className="list-tags">
                <ul className="ul-all-features p-all-features">
                  <li data-aos="fade-right">
                    <p className="p-white"> Create Custom Tickets</p>
                  </li>
                  <li data-aos="fade-right">
                    <p className="p-white"> Low Commission Rate </p>
                  </li>
                  <li data-aos="fade-right">
                    <p className="p-white"> Secure Online Payments</p>
                  </li>
                </ul>
                <ul className="ul-all-features">
                  <li data-aos="fade-right">
                    <p className="p-white"> On-Site Ticket Scanning</p>
                  </li>
                  <li data-aos="fade-right">
                    <p className="p-white"> Send real-time updates, reminders, directly to registered attendees.</p>
                  </li>
                  <li data-aos="fade-right">
                    <p className="p-white"> Create custom discount codes And Coupons To Reward Your Audience </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-features-image" data-aos="fade-up">
              <img className="border-10" src={features} alt="features-image" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllFeatures;
