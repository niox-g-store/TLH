import React from 'react';
import { connect } from 'react-redux';
import actions from '../../../actions';
import FadeSlider from '../../../components/store/FadeSlider';
import { API_URL } from '../../../constants';
import ResolveImage from '../../../components/store/ResolveImage';
import { formatReadableDate } from '../../../components/store/Card/functions';
import { Link } from 'react-router-dom';
import Button from '../../../components/Common/HtmlTags/Button';
import LoadingIndicator from '../../../components/store/LoadingIndicator';

const CustomerDashboardHelper = (props) => {
  const { events = [], isLoading, isLightMode } = props;

  if (isLoading) {
    return <LoadingIndicator isLightMode={isLightMode} />;
  }

  const latestEvents = events.slice(0, 8);
  const gridEvents = events.slice(0, 6);

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
          <div className="events-slider">
            <FadeSlider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={4000}
              arrows={false}
            >
              {latestEvents.map((event, index) => (
                <div key={index} className="slider-event-card">
                  <Link to={`/event/${event.slug}`}>
                    <div className="event-slide">
                      <img
                        src={ResolveImage(`${API_URL}${event.imageUrls?.[0]}` || '')}
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
              <Link key={index} to={`/event/${event.slug}`} className="grid-event-card">
                <div className="grid-event-image">
                  <img
                    src={ResolveImage(`${API_URL}${event.imageUrls?.[0]}` || '')}
                    alt={event.name}
                  />
                </div>
                <div className="grid-event-content">
                  <h4 className="grid-event-title">{event.name}</h4>
                  <p className="grid-event-date">
                    {formatReadableDate(event.startDate).day}
                  </p>
                  <p className="grid-event-location">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="show-more-section">
            <Link to="/events">
              <Button 
                text="Show More Events" 
                style={{ padding: '12px 24px' }}
              />
            </Link>
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
  }

  render() {
    return <CustomerDashboardHelper {...this.props} />;
  }
}

const mapStateToProps = state => ({
  events: state.event.allEvents,
  isLoading: state.event.isLoading,
  isLightMode: state.dashboard.isLightMode
});

export default connect(mapStateToProps, actions)(CustomerDashboard);