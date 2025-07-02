import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./style.css"

const Image = () => {
  const about1 = "./assets/about/about_8.JPG"
  const about2 = "./assets/about/about_2.jpeg"
  const about3 = "./assets/about/about_5.JPG"
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
          <img className="slider-img" src={about1} alt="About-1-image" />
          <img className="slider-img" src={about2} alt="About-1-image" />
          <img className="slider-img" src={about3} alt="About-1-image" />
        </Slider>
      </section>
    </>
  );
};

export default Image;
