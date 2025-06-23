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

// events images
import event1 from "../assets/events/event_1.jpeg";
import event2 from "../assets/events/event_2.jpeg";
import event3 from "../assets/events/event_3.jpeg";
import event4 from "../assets/events/event_4.jpeg";

const Home = () => {
  const eventImages =  [event1, event2, event3, event4];
  return (
    <>
    <HomeBanner />
      <HeroBanner
        heading="Discover The Link Hangouts Experience"
        desc="Host events with The Link Hangouts. Create events, sell tickets, and connect your audience to unforgettable experiences."
        bannerImage={eventImages}
        PButton={<PButton content="Discover Events" />}
        SButton={<SButton content="See Gallery" />}
      />

      <BrandSection />
      <DevicePage />
      {/*<Conference />*/}
      <AllFeatures />
      <Benefits />
      <GettingMsg />
      <Setup />
    </>
  );
};

export default Home;
