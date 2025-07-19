import React from "react";
import "./HeroBanner.css";
import PropTypes from "prop-types";

const HeroBanner = (props) => {
  const { bannerImage = [],
          desc = "Sorry the Description did not rendered",
          heading = "Sorry Heading Not rendered",
          imgMaxWidth, PButton, SButton, className, heroBannerBg
  } = props;
  const maxWidth = imgMaxWidth;

  return (
    <>
      <section style={heroBannerBg ? { background: `url(${heroBannerBg})` }: { display: "flex" }} className="hero-banner">
        <div className="container">
          <div className="row-wrapper-content-with-image">
            <div className="col-banner-content ">
              <h1 className={`${className} p-white`} data-aos="fade-up">{heading}</h1>
              <p className={`p-info p-white text-justify`} data-aos="fade-up" data-aos-delay="300">
                {desc}
              </p>
              <div
                className="row-banner-btns"
                data-aos="fade-up"
                data-aos-delay="300"
                style={{ padding: 0, margin: 0, height: 'fit-content' }}>
                {PButton}
                {SButton}
              </div>
            </div>
            <div className="col-banner-image" data-aos="fade-up">
              {bannerImage.map((element, index) => (
                <img loading="lazy" className={`banner-image-${index} ${className}`} data-aos="fade-up" data-aos-delay="300" key={index} src={element} style={{ maxWidth }} alt="banner-image" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/*HeroBanner.propTypes = {
  heading: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  bannerImage: PropTypes.arrayOf(PropTypes.string),
  imgMaxWidth: PropTypes.string,
  PButton: PropTypes.node,
  SButton: PropTypes.node,
};*/
export default HeroBanner;
