import React from "react";
import HeroBanner from "../../components/HeroBanner/HeroBanner";

import EventsWrap from "../../components/EventsWrap/EventsWrap";
import { mockEvents } from "./data";

const Events = () => {
  const events = mockEvents
  return (
    <section className="events">
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
