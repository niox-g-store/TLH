import React from 'react';
import { connect } from 'react-redux';
import actions from '../../../actions';
import FadeSlider from '../../../components/store/FadeSliderTwo';
import { API_URL } from '../../../constants';
import resolveImage from '../../../components/store/ResolveImage';
import { formatReadableDate } from '../../../components/store/Card/functions';
import { Link } from 'react-router-dom';
import Button from '../../../components/Common/HtmlTags/Button';
import LoadingIndicator from '../../../components/store/LoadingIndicator';
import { IoLocationOutline } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';

const CustomerDashboardForm = (props) => {
  let { events = [], isLoading, isLightMode, guestEvents, myEvents } = props;
  const latestEvents = events.slice(0, 8);
  const gridEvents = events.slice(0, 6);
  const gridMyEvents = myEvents.slice(0, 6);
  const gridGuestEvents = guestEvents.slice(0, 6);

  isLightMode = false;
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>
        Welcome to Your Dashboard
      </h2>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      {/* Featured Events Slider */}
      {latestEvents.length > 0 && (
        <div className="featured-events-section mb-5">
          <h3 className={`${isLightMode ? 'p-black' : 'p-white'} mb-4`}>Latest Events</h3>
          <div data-aos="fade-up" className="events-slider">
            <FadeSlider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={3000}
              arrows={false}
            >
              {latestEvents.map((event, index) => (
                <div key={index} className="slider-event-card">
                  <Link to={`/event/${event.slug}`}>
                    <div className="event-slide">
                      <img
                        src={resolveImage(`${API_URL}${event.imageUrls?.[0]}` || '')}
                        alt={event.name}
                        className="slider-event-image"
                      />
                      <div className="event-slide-overlay">
                        <div className="event-slide-content">
                          <h3 className="event-slide-title">{event.name}</h3>
                          <p className="event-slide-date">
                            {formatReadableDate(event.startDate).day}
                          </p>
                          <p className="event-slide-location">{event.location}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </FadeSlider>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {gridEvents.length > 0 && (
        <div className="events-grid-section">
          <h3 className={`${isLightMode ? 'p-black' : 'p-white'} mb-4`}>Upcoming Events</h3>
          <div className="events-grid">
            {gridEvents.map((event, index) => (
              <Link data-aos="fade-up" key={index} to={`/event/${event.slug}`} className="grid-event-card">
                <div className="grid-event-image">
                  <img
                    src={resolveImage(`${API_URL}${event.imageUrls?.[0]}` || '')}
                    alt={event.name}
                  />
                </div>
                <div className="d-flex flex-column grid-event-content">
                  <h4 className="grid-event-title">{event.name}</h4>
                  <p className="grid-event-date">
                  <span className='event-view-icon'><LuCalendarDays size={20} color='white'/></span>
                    {formatReadableDate(event.startDate).day}
                  </p>
                  <p className="grid-event-location">
                  <span className='event-view-icon'><IoLocationOutline size={20} color='white'/></span>
                    {event.location}
                  </p>
                  <div className='view-event align-self-center'>
                    <Button type={"last"} text={"View event"} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div data-aos="fade-up" className="show-more-section">
            <Link to="/events">
              <Button 
                text="Show More Events" 
                style={{ padding: '12px 24px' }}
              />
            </Link>
          </div>
        </div>
      )}

      {/* My Events Grid */}
{gridMyEvents.length > 0 && (
  <div className="events-grid-section my-events-grid">
    <h3 className={`${isLightMode ? 'p-black' : 'p-white'} mb-4`}>
      Account-Based Purchases
    </h3>
    <div className="events-grid">
      {gridMyEvents.map((event, index) => (
        <Link data-aos="fade-up" key={index} to={`/event/${event.slug}`} className="grid-event-card">
          <div className="grid-event-image">
            <img
              src={resolveImage(`${API_URL}${event.imageUrls?.[0]}` || '')}
              alt={event.name}
            />
          </div>
          <div className="d-flex flex-column grid-event-content">
                  <h4 className="grid-event-title">{event.name}</h4>
                  <p className="grid-event-date">
                  <span className='event-view-icon'><LuCalendarDays size={20} color='white'/></span>
                    {formatReadableDate(event.startDate).day}
                  </p>
                  <p className="grid-event-location">
                  <span className='event-view-icon'><IoLocationOutline size={20} color='white'/></span>
                    {event.location}
                  </p>
                  <div className='view-event align-self-center'>
                    <Button type={"last"} text={"View event"} />
                  </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}

{/* Guest Events Grid */}
{gridGuestEvents.length > 0 && (
  <div className="events-grid-section my-guest-events-grid">
    <h3 className={`${isLightMode ? 'p-black' : 'p-white'} mb-4`}>
      Guest Purchase History
    </h3>
    <div className="events-grid">
      {gridGuestEvents.map((event, index) => (
        <Link data-aos="fade-up" key={index} to={`/event/${event.slug}`} className="grid-event-card">
          <div className="grid-event-image">
            <img
              src={resolveImage(`${API_URL}${event.imageUrls?.[0]}` || '')}
              alt={event.name}
            />
          </div>
          <div className="d-flex flex-column grid-event-content">
                  <h4 className="grid-event-title">{event.name}</h4>
                  <p className="grid-event-date">
                  <span className='event-view-icon'><LuCalendarDays size={20} color='white'/></span>
                    {formatReadableDate(event.startDate).day}
                  </p>
                  <p className="grid-event-location">
                  <span className='event-view-icon'><IoLocationOutline size={20} color='white'/></span>
                    {event.location}
                  </p>
                  <div className='view-event align-self-center'>
                    <Button type={"last"} text={"View event"} />
                  </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}


      {events.length === 0 && (
        <div className={`text-center py-5 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <h3>No events available</h3>
          <p>Check back later for exciting events!</p>
        </div>
      )}
    </div>
  );
};

class CustomerDashboard extends React.PureComponent {
  componentDidMount() {
    this.props.fetchAllEvents();
    this.props.fetchMyEvents();
    this.props.fetchMyGuestEvents();
  }

  render() {
    return <CustomerDashboardForm {...this.props} />;
  }
}

const mapStateToProps = state => ({
  events: state.event.allEvents,
  guestEvents: state.event.guestEvents,
  myEvents: state.event.myEvents,
  isLoading: state.event.isLoading,
  isLightMode: state.dashboard.isLightMode
});

export default connect(mapStateToProps, actions)(CustomerDashboard);