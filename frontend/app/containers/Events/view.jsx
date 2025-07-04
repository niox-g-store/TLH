
import React from 'react';
import { withRouter } from '../../withRouter';
import actions from '../../actions';
import { connect } from 'react-redux';
import FadeSlider from '../../components/store/FadeSlider';
import Row from '../../components/Common/Row';
import Col from '../../components/Common/Col';
import Button from '../../components/Common/HtmlTags/Button';
import { API_URL } from '../../constants';

const EventViewer = (props) => {
  const { event } = props;
 return (
    <div className="event-view bg-white">
      <h2 className="event-header">Event Details</h2>
      <Row>
        <Col xs="12" md="8" lg="6" className="mx-auto">
          <div className="event-card">
            <FadeSlider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              fade={true}
              autoplay={true}
              autoplaySpeed={3000}
              arrows={false}
              swipeToSlide={true}
            >
              {event.imageUrls?.map((url, idx) => (
                <div key={idx} className="event-image-wrapper">
                  <img src={`${API_URL}${url}`} alt={`event-${idx}`} className="event-image" />
                </div>
              ))}
            </FadeSlider>

            <div className="event-info">
              <h3 className="event-title">{event.name}</h3>
              <p className="event-location">{event.location}</p>
              <p className="event-date">
                From {event.startDate} to {event.endDate}
              </p>
              <div className="event-tickets">
                {event.tickets && event.tickets.length > 0 ? (
                  <ul>
                    {event.tickets.map((ticket) => (
                      <li key={ticket._id} className="ticket-item">
                        <strong>{ticket.type}</strong>: ₦{ticket.price}
                        {ticket.discount && ticket.discountPrice && (
                          <>
                            {' '}
                            <span className="text-danger">₦{ticket.discountPrice}</span>
                            <span className="badge badge-success">
                              {(
                                ((ticket.price - ticket.discountPrice) / ticket.price) *
                                100
                              ).toFixed(1)}
                              % off
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tickets available</p>
                )}
              </div>
              <Button text="View Details" style={{ marginTop: '10px' }} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};


class EventView extends React.Component {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    if (slug) {
      this.props.fetchEventSlug(slug);
    }
  }

  render() {
    const { event } = this.props;
    return (
        <EventViewer event={event}/>
    )
  }
}

const mapStateToProps = state => ({
  event: state.event.selectEvent,
  eventIsLoading: state.event.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(EventView));
