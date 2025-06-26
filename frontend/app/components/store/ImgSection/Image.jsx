import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Image = () => {
  const about1 = "./assets/about/about_8.JPG"
  let settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    arrows: false,
    speed: 20000,
    pauseOnHover: false,
    cssEase: "linear",
  };
  return (
    <>
      <section id="image-section">
        <Slider {...settings}>
          <img src={about1} alt="About-1-image" width="100%" height="100%" />
          <img src={about1} alt="About-1-image" width="100%" height="100%" />
        </Slider>
      </section>
    </>
  );
};

export default Image;
