import HeroBanner from "../components/HeroBanner/HeroBanner";
import BrandSection from "../components/BrandSection/BrandSection";
import DevicePage from "../components/DevicePage/DevicePage";
import Conference from "../components/ConferenceSol/Conference";
import AllFeatures from "../components/AllFeatures/AllFeatures";
import Benefits from "../components/Benefits/Benefits";
import GettingMsg from "../components/GettingMsg/GettingMsg";
import Setup from "../components/Setup/Setup";
import bannerImage from "../assets/hero-banner-image.svg.png";
import PButton from "../../src/components/PrimaryButton/PButton";
import SButton from "../../src/components/SecondaryButton/SButton";
import HomeBanner from "../components/HomeBanner";

const Home = () => {
  return (
    <>
    <HomeBanner />
      <HeroBanner
        heading="Discover The Link Hangouts Experience"
        desc="Your plug for premium hangouts, parties, and good times."
        bannerImage={bannerImage}
        PButton={<PButton content="View Events" />}
        SButton={<SButton content="Gallery" />}
      />

      <BrandSection />
      <DevicePage />
      <Conference />
      <AllFeatures />
      <Benefits />
      <GettingMsg />
      <Setup />
    </>
  );
};

export default Home;
