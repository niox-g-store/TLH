import React from "react";
import "./Setup.css";

const Setup = () => {
  return (
    <>
      <section className="setup">
        <div className="container">
          <div className="setup-row-wrapper" data-aos="fade-up">
            <div className="col-setup-content">
              <h2 className="h2-all-features" data-aos="fade-up">
                ARE YOU AN EVENT ORGANIZER?
              </h2>
              <p className="p-all-features h2-all-features" data-aos="fade-up">
                Host and manage your events with us!
              </p>
            </div>
            <div className="col-setup-buttons">
              <div className="row-banner-btns">
                <a
                  href="#"
                  className="button"
                  data-aos="fade-up"
                  data-aos-delay="300">
                  Create Event
                </a>
                <a
                  href="#"
                  className="button--secondary"
                  data-aos="fade-up"
                  data-aos-delay="500">
                  Join The Chat Room{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Setup;
