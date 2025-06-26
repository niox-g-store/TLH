import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import BrandSection from "../../components/store/BrandSection/BrandSection";
import DevicePage from "../../components/store/DevicePage/DevicePage";
import Conference from "../../components/store/ConferenceSol/Conference";
import AllFeatures from "../../components/store/AllFeatures/AllFeatures";
import Benefits from "../../components/store/Benefits/Benefits";
import GettingMsg from "../../components/store/GettingMsg/GettingMsg";
import Setup from "../../components/store/Setup/Setup";
import PButton from "../../components/Common/HtmlTags/PrimaryButton/PButton";
import SButton from "../../components/Common/HtmlTags/SecondaryButton/SButton";
import HomeBanner from "./HomeBanner";


const Home = () => {
  // events images
  const event1 = "./assets/events/event_1.jpeg";
  const event2 = "./assets/events/event_2.jpeg";
  const event3 = "./assets/events/event_3.jpeg";
  const event4 = "./assets/events/event_4.jpeg";

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
