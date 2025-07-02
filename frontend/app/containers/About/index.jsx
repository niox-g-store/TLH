import React from "react";
import HeroBannerAbt from "../../components/store/HeroBannerAbt/HeroBannerAbt";
import RowAbtus from "../../components/store/RowAbtus/RowAbtus";
import RowOurTeam from "../../components/store/RowOurTeam/RowOurTeam";
import Image from "../../components/store/ImgSection";
import GettingMsg from "../../components/store/GettingMsg/GettingMsg";
import Setup from "../../components/store/Setup/Setup";

const About = () => {
  return (
    <>
      <HeroBannerAbt />
      {/*<Image />*/}
      <RowAbtus />
      <RowOurTeam />
      <GettingMsg />
      <Setup />
    </>
  );
};

export default About;
