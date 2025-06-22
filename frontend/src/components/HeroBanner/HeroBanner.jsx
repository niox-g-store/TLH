import React from "react";
import "../../../global.css";
import "../HeroBanner/HeroBanner.css";
import PropTypes from "prop-types";

const HeroBanner = (props) => {
  const maxWidth = props.imgMaxWidth;
  const { bannerImage } = props;

  return (
    <>
      <section className="hero-banner">
        <div className="container">
          <div className="row-wrapper-content-with-image">
            <div className="col-banner-content ">
              <h1 data-aos="fade-up">{props.heading}</h1>
              <p data-aos="fade-up" data-aos-delay="600">
                {props.desc}
              </p>
              <div
                className="row-banner-btns"
                data-aos="fade-up"
                data-aos-delay="400">
                {props.PButton}
                {props.SButton}
              </div>
            </div>
            <div className="col-banner-image" data-aos="fade-up">
              {bannerImage.map((element, index) => (
                <img className={`banner-image-${index}`} data-aos="fade-up" data-aos-delay="600" key={index} src={element} style={{ maxWidth }} alt="banner-image" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

HeroBanner.defaultProps = {
  heading: "Sorry Heading Not rendered ",
  desc: "Sorry the Description did not rendered ",
  bannerImage: "Image not rendered",
};
HeroBanner.propTypes = {
  heading: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};
export default HeroBanner;
