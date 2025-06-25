import React from "react";
import "./RowAbtus.css";

const RowAbtus = () => {
  return (
    <>
      <section>
        <div className="container">
          <div className="row-wrapper-about-us">
            <div className="col-about-us-h2" data-aos="fade-up">
              <p className="p-black">
                <strong className="p-black">About Us</strong>
              </p>
              <h2 data-aos="fade-up" data-aos-delay="300">
                We provide services like:
              </h2>
            </div>
            <div
              className="col-about-us-p"
              data-aos="fade-up"
              data-aos-delay="300">
              <p className="p-black"> Exclusive Parties </p>
              <p className="p-black"> Networking </p>
              <p className="p-black"> Picnics </p>
              <p className="p-black"> Group Vacation </p>
              <p className="p-black"> Games Nights </p>
              <p className="p-black"> Group Trips </p>
              <p className="p-black"> Group Hangouts </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RowAbtus;
