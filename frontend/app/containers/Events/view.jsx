import React, { useRef, useEffect, useState } from 'react';
import { withRouter } from '../../withRouter';
import actions from '../../actions';
import { connect } from 'react-redux';
import FadeSlider from '../../components/store/FadeSlider';
import Row from '../../components/Common/Row';
import Col from '../../components/Common/Col';
import Button from '../../components/Common/HtmlTags/Button';
import { API_URL } from '../../constants';
import resolveImage from '../../components/store/ResolveImage';
import { formatReadableDate } from '../../components/store/Card/functions';
import { MdOutlineAddShoppingCart, MdShoppingCart } from 'react-icons/md';
import Page404 from '../Page404';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import Cart from '../Cart';
import { IoLocationOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { RxLapTimer } from "react-icons/rx";
import { AiOutlineTags } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { CModal, CModalBody, CModalHeader, CButton } from '@coreui/react';
import { FaFacebook } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaSquareInstagram } from "react-icons/fa6";
import { MdPhone } from "react-icons/md";
import MapEmbed from '../../components/store/MapEmbed';

const EventViewer = (props) => {
  const {
    event = {},
    eventIsLoading,
    eventSlugChange,
    addToCart,
    selectedTickets
  } = props;

  // --- ALL HOOKS MUST BE DECLARED HERE, AT THE TOP LEVEL ---
  const videoRefs = useRef([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [showTicketDescriptionModal, setShowTicketDescriptionModal] = useState(false);
  const [selectedTicketWithDescription, setSelectedTicketWithDescription] = useState(null);

  // Helper to determine if the URL is a video
  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.flv', '.wmv'];
    const lowerCaseUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
  };

  // Function to handle slide changes in FadeSlider
  const handleBeforeChange = (oldIndex, newIndex) => {
    setCurrentSlideIndex(newIndex); // Update the current slide index

    // Pause the video that is leaving the view
    if (videoRefs.current[oldIndex]) {
      videoRefs.current[oldIndex].pause();
    }
  };

  // Effect to play the video when the slide becomes active
  useEffect(() => {
    // Only attempt to play if there's a video at the current slide index
    // Also, ensure event.imageUrls exists before trying to access it
    if (event.imageUrls && videoRefs.current[currentSlideIndex] && isVideo(event.imageUrls[currentSlideIndex])) {
      const playPromise = videoRefs.current[currentSlideIndex].play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Autoplay started!
        })
          .catch(error => {
          // Autoplay was prevented.
          // This can happen if the user hasn't interacted with the document yet.
          // You might want to show a play button here.
          });
      }
    }
  }, [currentSlideIndex, event.imageUrls]); // Re-run when currentSlideIndex or imageUrls change

  // Clear videoRefs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      videoRefs.current = [];
    };
  }, []);
  // --- END OF HOOK DECLARATIONS ---

  // Now you can place your conditional returns
  if (eventIsLoading) {
    return <LoadingIndicator />;
  }

  if (eventSlugChange) {
    return (
      <Page404 text="Oops, the event you're looking for has changed" />
    );
  }

  const isEventSelect = Object.keys(event).length > 0; // This can be placed here

  if (isEventSelect) {
    return (
      <>
        <div style={{ paddingTop: '10em' }} className='event-view bg-white'>
          <div className='lg-view-event'>
            <div className='event-card'>
              <FadeSlider
                dots={!!(event && event?.imageUrls?.length > 1)}
                infinite
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                fade
                autoplay
                autoplaySpeed={2000}
                arrows={false}
                swipeToSlide
                beforeChange={handleBeforeChange}
              >
                {event && event?.imageUrls?.map((url, idx) => (
                  <div key={idx} className='event-image-wrapper'>
                    {isVideo(url)
                      ? (
                        <video
                          ref={el => (videoRefs.current[idx] = el)}
                          muted
                          playsInline
                          loop
                          className='event-image'
                        >
                          <source src={`${API_URL}${url}`} type='video/mp4' />
                          Your browser does not support the video tag.
                        </video>
                        )
                      : (
                        <img src={resolveImage(`${API_URL}${url}`)} alt={`event-${idx}`} className='event-image' />
                        )}
                  </div>
                ))}
              </FadeSlider>
            </div>

            <div className='event-info w-100'>
              <h2 className='event-title text-wrap text-break w-100 overflow-hidden'>{event && event.name}</h2>
              <p className='event-location p-black'>
                <span className='event-view-icon'><IoLocationOutline size={20} color='white'/></span>
                {event && event.location}
              </p>
              <p className='event-location p-black'>
                <span className='event-view-icon'><AiOutlineTags size={20} color='white'/></span>
                {event && event.category}</p>
              <p className='event-date p-black mb-0'>
                <span className='event-view-icon'><LuCalendarDays size={20} color='white'/></span>
                {formatReadableDate(event && event.startDate).day}
              </p>
              <p className='event-date p-black'>
                <span className='event-view-icon'><RxLapTimer size={20} color='white'/></span>
                {formatReadableDate(event && event.startDate).time}
              </p>

        <div style={{ cursor: 'pointer' }} className='host-des' onClick={() => setShowOrganizerModal(true)}>
          <p>your host</p>
          <img src={resolveImage(API_URL + event?.user?.imageUrl, 'profile')} style={{ borderRadius: '50%', width: '5%', height: '3em' }} />
          &nbsp; &nbsp; &nbsp; <span className='p-purple'>{event?.user?.companyName}</span>
        </div>

        {/* Modal with Organizer Details */}
        <CModal visible={showOrganizerModal} onClose={() => setShowOrganizerModal(false)} alignment="center">
          <CModalHeader>
            <h5>Organizer Details</h5>
          </CModalHeader>
          <CModalBody style={{ background: 'white' }}>
            <div className='text-center'>
              <img src={resolveImage(API_URL + event?.user?.imageUrl)} alt='Organizer' style={{ width: '100px', height: '100px', borderRadius: '10px' }} />
              <p className='mt-2'><CgProfile /> {event?.user?.companyName}</p>
              {event?.user?.contactEmail?.length > 3 && (
                <p><MdEmail /> {event.user.contactEmail}</p>
              )}
              {event?.user?.phoneNumber?.length > 3 && (
                <p><MdPhone /> {event.user.phoneNumber}</p>
              )}
              <div className='d-flex g-2' style={{ width: 'fit-content', gap: '2em', justifySelf: 'center' }}>
              {event?.user?.instagram?.length > 3 && (
                <p><a href={event.user.instagram}> <FaSquareInstagram size={30}/> </a></p>
              )}
              {event?.user?.facebook?.length > 3 && (
                <p><a href={event.user.facebook}><FaFacebook size={30}/></a></p>
              )}
              {event?.user?.tiktok?.length > 3 && (
                <p><a href={event.user.tiktok}><AiFillTikTok size={32}/></a></p>
              )}
              </div>
              {event?.user?.bio?.length > 3 && (
                <>
                <p>About this profile</p>
                <p style={{ fontSize: '13px' }}>{event.user.bio}</p>
                </>
              )}
            </div>
          </CModalBody>
        </CModal>
              <h3 style={{ fontSize: '23px' }}>About this event</h3>
              <p className='font-size-15 text-wrap text-break w-100 overflow-hidden event-description' dangerouslySetInnerHTML={{ __html: event.description }} />
              <h3 style={{ fontSize: '23px' }}>Tickets</h3>
              {event && event.status !== 'Ended'
                ? <div className='event-tickets'>
                  {event && event.tickets && event.tickets.length > 0
                    ? (
                      <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className='view-event-ticket view-event-ticket-lg'>
                        {event && event.tickets.map((ticket) => {
                          const isSelected = selectedTickets.includes(ticket._id);
                          if (!isSelected) {
                            return (
                              <li
                                key={ticket._id}
                                className={`ticket-item ${ticket.quantity <= 0 ? 'sold-out' : ''}`}
                                onClick={() => {
  if (ticket.quantity > 0) {
    if (ticket.description?.trim()?.length > 0) {
      setSelectedTicketWithDescription(ticket);
      setShowTicketDescriptionModal(true);
    } else {
      addToCart({
        ticketId: ticket._id,
        eventId: event._id,
        eventName: event.name,
        ticketType: ticket.type,
        price: ticket.price,
        discount: ticket.discount,
        discountPrice: ticket.discountPrice,
        ticketQuantity: ticket.quantity
      });
    }
  }
}}
                                style={{ height: 'fit-content' }}
                              >
                                {!ticket.discount && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                      <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                    </div>
                                      <span className='font-size-20'>₦{ticket.price.toLocaleString()}</span>
                                  </div>
                                )}
                                {ticket.discount && ticket.discountPrice && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                      <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                    </div>
                                    <p style={{ margin: '0' }}><span style={{ fontSize: '15px', textDecoration: 'line-through', color: 'black' }}>₦{ticket.price.toLocaleString()}</span>&nbsp;&nbsp;
                                    <span className='font-size-20'>₦{ticket.discountPrice.toLocaleString()}</span>
                                    </p>
                                  </div>
                                )}
                              </li>
                            );
                          } else {
                            return (
                              <li key={ticket._id} className='ticket-item sold-out'>
                                {!ticket.discount && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                    <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label-selected'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                  </div>
                                  <span className='font-size-20'>₦{ticket.price.toLocaleString()}</span>
                                  <span className='text-left sold-out font-size-15 p-gray'>This ticket has been selected</span>
                                </div>
                                )}
                                {ticket.discount && ticket.discountPrice && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                      <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label-selected'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                    </div>
                                    <p style={{ margin: '0' }}><span style={{ fontSize: '15px', textDecoration: 'line-through', color: 'black' }}>₦{ticket.price.toLocaleString()}</span>&nbsp;&nbsp;
                                    <span className='font-size-20'>₦{ticket.discountPrice.toLocaleString()}</span>
                                    </p>
                                    <span className='text-left sold-out font-size-15 p-gray'>This ticket has been selected</span>
                                  </div>
                                )}
                              </li>
                            );
                          }
                        })}
                      </ul>
                      )
                    : (
                      <p className='font-size-20'>No tickets available</p>
                      )}
                  </div>
                : <p className='text-center font-size-20 p-gray'>Sold out</p>}
                <MapEmbed location={event.location}/>
            </div>
          </div>






















          <div className='event-card d-lg-none mobile-view-event'>
            <FadeSlider
              dots={!!(event && event?.imageUrls?.length > 1)}
              infinite
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              fade
              autoplay
              arrows={false}
              swipeToSlide
              beforeChange={handleBeforeChange}
            >
              {event && event?.imageUrls?.map((url, idx) => (
                <div key={idx} className='event-image-wrapper'>
                  {isVideo(url)
                    ? (
                      <video
                        ref={el => (videoRefs.current[idx] = el)}
                        muted
                        playsInline
                        loop
                        className='event-image'
                      >
                        <source src={`${API_URL}${url}`} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                      )
                    : (
                      <img src={resolveImage(`${API_URL}${url}`)} alt={`event-${idx}`} className='event-image' />
                      )}
                </div>
              ))}
            </FadeSlider>

            <div className='event-info'>
              <h2 className='event-title text-wrap text-break w-100 overflow-hidden'>{event && event.name}</h2>
              <p className='event-location p-black'>
                <span className='event-view-icon'><IoLocationOutline size={20} color='white'/></span>
                {event && event.location}
              </p>              
              <p className='event-location p-black'>
                <span className='event-view-icon'><AiOutlineTags size={20} color='white'/></span>
                {event && event.category}</p>
              <p className='event-date p-black mb-0'>
                <span className='event-view-icon'><LuCalendarDays size={20} color='white'/></span>
                {formatReadableDate(event && event.startDate).day}
              </p>
              <p className='event-date p-black'>
                <span className='event-view-icon'><RxLapTimer size={20} color='white'/></span>
                {formatReadableDate(event && event.startDate).time}
              </p>
        <div style={{ cursor: 'pointer' }} className='host-des' onClick={() => setShowOrganizerModal(true)}>
          <p>your host</p>
          <img src={resolveImage(API_URL + event?.user?.imageUrl, 'profile')} style={{ borderRadius: '50%', width: '14%', height: '3em' }} />
          &nbsp; &nbsp; &nbsp; <span className='p-purple'>{event?.user?.companyName}</span>
        </div>

        {/* Modal with Organizer Details */}
        <CModal visible={showOrganizerModal} onClose={() => setShowOrganizerModal(false)} alignment="center">
          <CModalHeader>
            <h5>Organizer Details</h5>
          </CModalHeader>
          <CModalBody style={{ background: 'white' }}>
            <div className='text-center'>
              <img src={resolveImage(API_URL + event?.user?.imageUrl, 'profile')} alt='Organizer' style={{ width: '100px', height: '100px', borderRadius: '10px' }} />
              <p className='mt-2'><CgProfile /> {event?.user?.companyName}</p>
              {event?.user?.contactEmail?.length > 3 && (
                <p><MdEmail /> {event.user.contactEmail}</p>
              )}
              {event?.user?.phoneNumber?.length > 3 && (
                <p><MdPhone /> {event.user.phoneNumber}</p>
              )}
              <div className='d-flex g-2' style={{ width: 'fit-content', gap: '2em', justifySelf: 'center' }}>
              {event?.user?.instagram?.length > 3 && (
                <p><a href={event.user.instagram}> <FaSquareInstagram size={30}/> </a></p>
              )}
              {event?.user?.facebook?.length > 3 && (
                <p><a href={event.user.facebook}><FaFacebook size={30}/></a></p>
              )}
              {event?.user?.tiktok?.length > 3 && (
                <p><a href={event.user.tiktok}><AiFillTikTok size={32}/></a></p>
              )}
              </div>
              {event?.user?.bio?.length > 3 && (
                <>
                <p>About this profile</p>
                <p style={{ fontSize: '13px' }}>{event.user.bio}</p>
                </>
              )}
            </div>
          </CModalBody>
        </CModal>
              <hr />
              <h3 style={{ fontSize: '23px' }}>About this event</h3>
              <p className='font-size-15 text-wrap text-break w-100 overflow-hidden event-description' dangerouslySetInnerHTML={{ __html: event.description }} />
              <h3 style={{ fontSize: '23px' }}>Tickets</h3>
              {event && event.status !== 'Ended'
                ? <div className='event-tickets'>
                  {event && event.tickets && event.tickets.length > 0
                    ? (
                      <ul className='view-event-ticket'>
                        {event && event.tickets.map((ticket) => {
                          const isSelected = selectedTickets.includes(ticket._id);
                          if (!isSelected) {
                            return (
                              <li
                                key={ticket._id}
                                className={`ticket-item ${ticket.quantity <= 0 ? 'sold-out' : ''}`}
                                onClick={() => {
  if (ticket.quantity > 0) {
    if (ticket.description?.trim()?.length > 0) {
      setSelectedTicketWithDescription(ticket);
      setShowTicketDescriptionModal(true);
    } else {
      addToCart({
        ticketId: ticket._id,
        eventId: event._id,
        eventName: event.name,
        ticketType: ticket.type,
        price: ticket.price,
        discount: ticket.discount,
        discountPrice: ticket.discountPrice,
        ticketQuantity: ticket.quantity
      });
    }
  }
}}
                              >
                                {!ticket.discount && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                      <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                    </div>
                                      <span className='font-size-20'>₦{ticket.price.toLocaleString()}</span>
                                  </div>
                                )}
                                {ticket.discount && ticket.discountPrice && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                      <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                    </div>
                                    <p style={{ margin: '0' }}><span style={{ fontSize: '15px', textDecoration: 'line-through', color: 'black' }}>₦{ticket.price.toLocaleString()}</span>&nbsp;&nbsp;
                                    <span className='font-size-20'>₦{ticket.discountPrice.toLocaleString()}</span>
                                    </p>
                                  </div>
                                )}
                              </li>
                            );
                          } else {
                            return (
                              <li key={ticket._id} className='ticket-item sold-out'>
                                {!ticket.discount && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                    <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label-selected'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                  </div>
                                  <span className='font-size-20'>₦{ticket.price.toLocaleString()}</span>
                                  <span className='text-left sold-out font-size-15 p-gray'>This ticket has been selected</span>
                                </div>
                                )}
                                {ticket.discount && ticket.discountPrice && (
                                  <div className='d-flex flex-column w-100 text-start'>
                                    <div style={{ position: 'relative' }} className='d-flex'>
                                      <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                                      <span className='ticket-label-selected'>{ticket.quantity > 0 ? `${ticket.quantity} Remaining` : 'Sold Out'}</span>
                                    </div>
                                    <p style={{ margin: '0' }}><span style={{ fontSize: '15px', textDecoration: 'line-through', color: 'black' }}>₦{ticket.price.toLocaleString()}</span>&nbsp;&nbsp;
                                    <span className='font-size-20'>₦{ticket.discountPrice.toLocaleString()}</span>
                                    </p>
                                    <span className='text-left sold-out font-size-15 p-gray'>This ticket has been selected</span>
                                  </div>
                                )}
                              </li>
                            );
                          }
                        })}

                      </ul>
                      )
                    : (
                      <p className='font-size-20'>No tickets available</p>
                      )}
                  </div>
                : <p className='text-center font-size-20 p-gray'>Sold out</p>}
                <MapEmbed location={event.location}/>
            </div>
          </div>
        </div>
        <Cart />

        <CModal visible={showTicketDescriptionModal} onClose={() => setShowTicketDescriptionModal(false)} alignment="center">
  <CModalHeader>
    <h5>Ticket Description</h5>
  </CModalHeader>
  <CModalBody>
    <p className='font-size-15 text-wrap text-break' dangerouslySetInnerHTML={{ __html: selectedTicketWithDescription?.description || '' }} />
  </CModalBody>
  <CModalBody className="d-flex justify-content-center">
    <Button
      text={"Add to Cart"}
      className="linear-grad p-white"
      onClick={() => {
        const t = selectedTicketWithDescription;
        addToCart({
          ticketId: t._id,
          eventId: event._id,
          eventName: event.name,
          ticketType: t.type,
          price: t.price,
          discount: t.discount,
          discountPrice: t.discountPrice,
          ticketQuantity: t.quantity
        });
        setShowTicketDescriptionModal(false);
      }}
    >
    </Button>
  </CModalBody>
</CModal>

      </>
    );
  }
  // If isEventSelect is false, return null or a loading state if needed.
  return null;
};

class EventView extends React.Component {
  componentDidMount () {
    const slug = this.props.match.params.slug;
    if (slug) {
      this.props.fetchEventSlug(slug);
    }
  }

  componentWillUnmount () {
    this.props.vewingEventToggler(false);
    this.props.resetEventSlugChange();
  }

  render () {
    const { event, isLoading, eventSlugChange } = this.props;
    return (
      <EventViewer {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  event: state.event.selectEvent,
  eventIsLoading: state.event.isLoading,
  eventSlugChange: state.event.eventSlugChange,

  selectedTickets: state.cart.selectedTickets
});

export default connect(mapStateToProps, actions)(withRouter(EventView));
