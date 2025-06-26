import React from "react";
import "./HeroBannerAbt.css";
import HomeBanner from "../../../containers/HomePage/HomeBanner";
import VideoDevice from "../../Common/VideoDevice";

const HeroBannerAbt = () => {
  const about1 = "./assets/about/about_7.JPG";
  const about2 = "./assets/about/about_4.JPG";
  const about3 = "./assets/about/about_3.jpeg";
  const about4 = "./assets/about/about_1.jpeg";

  const aboutVideo = "./assets/about/about_video.MP4"

  return (
    <>
      <section className="hero-section about-us-one">
        <div className="container">
          <div className="hero-banner">
            <div className="col-hero-banner-h1" data-aos="fade-up">
              <h1>Welcome to The Link Hangouts</h1>
              <h4>We are a vibrant lifestyle company based in Lagos, Nigeria, dedicated to curating and orchestrating exceptional events, parties, and hangouts that bring people together to create lasting memories. As stewards of a burgeoning community of influencers and enthusiastic youths, we take pride in connecting like-minded individuals to explore the pulse of Lagos's cultural scene.</h4>
            </div>
            <div className="col-hero-banner-p">
                <VideoDevice video={aboutVideo} img={about4} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBannerAbt;
