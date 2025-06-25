import HeroBanner from "../../components/HeroBanner/HeroBanner";
import BrandSection from "../../components/BrandSection/BrandSection";
import DevicePage from "../../components/DevicePage/DevicePage";
import Conference from "../../components/ConferenceSol/Conference";
import AllFeatures from "../../components/AllFeatures/AllFeatures";
import Benefits from "../../components/Benefits/Benefits";
import GettingMsg from "../../components/GettingMsg/GettingMsg";
import Setup from "../../components/Setup/Setup";
import bannerImage from "../../../public/assets/hero-banner-image.svg.png";
import PButton from "../../components/Common/HtmlTags/PrimaryButton/PButton";
import SButton from "../../components/Common/HtmlTags/SecondaryButton/SButton";
import HomeBanner from "./HomeBanner";
import Button from "../../components/Common/HtmlTags/Button";

// events images
import event1 from "../../../public/assets/events/event_1.jpeg";
import event2 from "../../../public/assets/events/event_2.jpeg";
import event3 from "../../../public/assets/events/event_3.jpeg";
import event4 from "../../../public/assets/events/event_4.jpeg";

const Home = () => {
  const eventImages =  [event1, event3, event2, event4];
  return (
    <>
    <HomeBanner />
      <HeroBanner
        heading="Discover The Link Hangouts Experience"
        desc="We are a vibrant lifestyle company based in Lagos, Nigeria, dedicated to curating and orchestrating exceptional events, parties, and hangouts that bring people together to create lasting memories."
        bannerImage={eventImages}
        PButton={<PButton link={"/events"} content="Discover Events" />}
        SButton={<SButton link={"/gallery"} content="See Gallery" />}
        className={"border-10"}
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
