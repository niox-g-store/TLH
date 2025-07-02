import React from "react";
import HeroBanner from "../../components/store/HeroBanner/HeroBanner";

import EventsWrap from "../../components/store/EventsWrap/EventsWrap";
import { mockEvents } from "./data";

const Events = () => {
  const events = mockEvents
  return (
    <section className="events bg-white">
      <HeroBanner
        heading="Our Events"
        desc="Discover our events"
        bannerImage={[]}
      />

      <EventsWrap events={events}/>
    </section>
  );
};

export default Events;
