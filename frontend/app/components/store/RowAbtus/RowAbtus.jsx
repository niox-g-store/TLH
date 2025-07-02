import React from "react";
import "./RowAbtus.css";

const RowAbtus = () => {
  const about4 = "./assets/about/about_4.JPG"
  return (
    <>
      <section className="bg-white">
        <div className="container">
          <div className="row-wrapper-about-us">
            <div className="row-wrapper-about-us-text">
            <div className="col-about-us-h2" data-aos="fade-up">
              <p className="p-black">
                <strong className="p-black">About Us</strong>
              </p>
              <h2 data-aos="fade-up p-white" data-aos-delay="300">
                We provide services like:
              </h2>
            </div>
            <div
              className="col-about-us-p"
              data-aos-delay="300">
              <p data-aos="fade-right" className="p-black"> Exclusive Parties </p>
              <p data-aos="fade-right" className="p-black"> Networking </p>
              <p data-aos="fade-right" className="p-black"> Picnics </p>
              <p data-aos="fade-right" className="p-black"> Group Vacation </p>
              <p data-aos="fade-right" className="p-black"> Games Nights </p>
              <p data-aos="fade-right" className="p-black"> Group Trips </p>
              <p data-aos="fade-right" className="p-black"> Group Hangouts </p>
            </div>
            </div>

            <div data-aos="fade-up" className="row-about-us-img">
              <img src={about4}/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RowAbtus;
