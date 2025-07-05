import Card from "../Card";
import "./EventsWrap.css";
import Pagination from "../Pagination";
import Input from "../../Common/HtmlTags/Input";

const EventsWrap = (props) => {
  const { events } = props;
  return (
    <>
    {events.length > 0 ?
      <div className="container">
        <div className="event-heading">
          <h2 className="head1" data-aos="fade-up">Discover our Events</h2>

          <Input placeholder={"Search events by name"} type={"search"} />
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
      :
      <div className="container">
        <div className="event-heading">
          <h2 className="head1" data-aos="fade-up">Discover our Events</h2>
          <h2 style={{ textAlign: 'center', padding: '1em 0em' }} className="font-size-25">No events to show</h2>
        </div>
      </div>
     }
    </>
  );
};

export default EventsWrap;
