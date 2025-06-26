import React from "react";
import "./Setup.css";
import { Link } from "react-router-dom";

const Setup = () => {
  return (
    <>
      <section className="setup">
        <div className="container">
          <div className="setup-row-wrapper" data-aos="fade-up">
            <div className="col-setup-content">
              <h2 className="h2-all-features" data-aos="fade-up">
                Hosting an event soon?
              </h2>
              <p className="p-all-features h2-all-features" data-aos="fade-up">
                Host and manage your events with us!
              </p>
            </div>
            <div className="col-setup-buttons">
              <div className="row-banner-btns">
                <Link to={"/organizer-signup"} className="button" data-aos="fade-up" data-aos-delay="300">Create Event</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Setup;
