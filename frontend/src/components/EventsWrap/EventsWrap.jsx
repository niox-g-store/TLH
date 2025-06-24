import React from "react";
import Card from "../Card";
import "./EventsWrap.css";
import Pagination from "../Pagination";

const EventsWrap = (props) => {
  const { events } = props;
  return (
    <>
      <div className="container">
        <div className="event-heading">
          <h2 className="head1" data-aos="fade-up">Discover our Events</h2>
        </div>

        <div className="events-list-wrapper">
          <div className="upcoming-events">
            <Pagination
              items={events}
              itemsPerPage={12}
              renderItem={(event, index) => <Card event={event} key={index} />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsWrap;
