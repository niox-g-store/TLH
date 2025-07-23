import React, { useState } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CPagination,
  CPaginationItem,
  CBadge,
  CImage
} from '@coreui/react';
import { ROLES } from '../../../constants';
import actions from '../../../actions';
import { connect } from 'react-redux';
import Button from '../../Common/HtmlTags/Button';
import { API_URL } from '../../../constants';
import resolveImage from '../../store/ResolveImage';
import { formatDate } from '../../../utils/formatDate';
import { useNavigate, Link } from 'react-router-dom';

const Newsletter = (props) => {
  const { isLightMode, newsletters, userRole, events, subscribers } = props;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const newslettersPerPage = 10;

  const totalPages = Math.ceil(newsletters.length / newslettersPerPage);
  const startIndex = (currentPage - 1) * newslettersPerPage;
  const endIndex = startIndex + newslettersPerPage;
  const currentNewsletters = newsletters.slice(startIndex, endIndex);
  const activeEvents = events.filter(event => event.status !== 'Ended');

  return (
    <div className={`${isLightMode ? 'p-black' : 'p-white'} container-lg px-4 d-flex flex-column mb-custom-5em`}>
      <div className='d-flex justify-content-between'>
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Newsletter</h2>
        <Button
            className="third-btn mb-3"
            text="Create Campaign +"
            onClick={() => navigate("/dashboard/newsletter/add")}
          />
      </div>
        <h3 className={`${isLightMode ? 'p-black': 'p-white'}`}>Send reminders, newsletters, and campaign emails to users </h3>  
        {userRole === ROLES.Admin && 
          <p>As an admin, you can send campaign emails(newsletter) to subscribers, users, and organizers.</p>
        }
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />
      {userRole === ROLES.Admin && (
        <div className="admin-section">
          <div className='d-flex gap-3 mb-4 flex-wrap'>
            <Button text={`${subscribers?.members || 0} newsletter members`} />
            <Button text={`${subscribers?.subscribed || 0} newsletter subscribers`} />
            <Button text={`${newsletters?.length || 0} newsletter created`} />
          </div>
        </div>
      )}
      <CRow className='gy-4'>
      {currentNewsletters.length > 0 ? (
        currentNewsletters.map(newsletter => (
          <CCol md={6} key={newsletter._id}>
            <Link to={`/dashboard/newsletter/${newsletter._id}`} style={{ textDecoration: 'none' }}>
              <CCard
                className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}
                style={{ height: '95%' }}
              >
                {newsletter.imageUrls && newsletter.imageUrls.length > 0 && (
                  <CImage
                    src={resolveImage(`${API_URL}${newsletter.imageUrls[0]}`)}
                    alt={newsletter.title || 'Newsletter Image'}
                    style={{ width: '40%', objectFit: 'cover' }}
                  />
                )}
                <CCardBody className={`${isLightMode ? 'p-black' : 'p-white'}`}>
                  <CCardTitle className="mb-2">{newsletter.title}</CCardTitle>
                  <CCardText>
                    Created: {new Date(newsletter.createdAt).toLocaleDateString()}
                  </CCardText>
                  {newsletter.event && <CCardText>
                    Reminder for event: {newsletter.event.name}
                    </CCardText>
                  }
                  {newsletter?.sentDate &&
                  <CCardText>
                    Sent Date: {formatDate(newsletter.sentDate)}
                  </CCardText>
                  }
                  <CCardText>
                    {newsletter.sent ? `Sent to ${newsletter.sentTo} recipients` : 'Not yet sent'}
                  </CCardText>
                  <CCardText>
                    {newsletter.timeSent > 0 ? `This email has been sent ${newsletter.timeSent} times` : 'This campaign has not been sent'}
                  </CCardText>
                </CCardBody>
              </CCard>
            </Link>
          </CCol>
        ))
      ) : (
        <CCol xs={12}>
          <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>No newsletters found.</p>
        </CCol>
      )}
    </CRow>
      {/* Event List */}
      <CRow className='gy-4'>
        <p style={{ textAlign: 'center', marginTop: '3em' }}>You can choose from upcoming or ongoing events to send reminders.</p>
      {activeEvents.length > 0 ? (
        activeEvents.map((event) => {
          const attendeesCount = (event.registeredAttendees?.length || 0) + (event.unregisteredAttendees?.length || 0);
          return (
            <CCol md={6} key={event._id}>
              <Link to={`/dashboard/newsletter/add?eventId=${event._id}`} style={{ textDecoration: 'none' }}>
                <CCard
                  style={{ height: '95%' }}
                  className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}
                >
                  <CImage
                    src={event.imageUrls && event.imageUrls[0] ? `${API_URL}${resolveImage(event.imageUrls[0])}` : ''}
                    alt={event.title || 'Event Image'}
                    style={{ width: '40%', objectFit: 'cover' }}
                  />
                  <CCardBody>
                    <CCardTitle className='mb-2'>{event.name}</CCardTitle>
                    <CBadge
                      color={
                        event.status === 'Upcoming'
                          ? 'primary'
                          : event.status === 'Ongoing'
                          ? 'success'
                          : 'secondary' // Fallback for unexpected status
                      }
                    >
                      {event.status}
                    </CBadge>
                    <CCardText className='mt-2'>
                      <strong>Start Date:</strong> {formatDate(event.startDate)}
                      <br />
                      <strong>End Date:</strong> {formatDate(event.endDate)}
                      <br />
                      <strong>Venue:</strong> {event.location}
                      <br />
                      <strong>Tickets Sold:</strong> {event.attendees || 0}
                      <br />
                      <strong>Attendees:</strong> {attendeesCount}
                      <br />
                    </CCardText>
                  </CCardBody>
                </CCard>
              </Link>
            </CCol>
          );
        })
      ) : (
        <CCol xs={12}>
          <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>
            You have no ongoing or upcoming events to send reminders to attendees.
          </p>
        </CCol>
      )}
      </CRow>

      <div className='mt-4'>
        <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
          <span className={`${isLightMode ? 'p-black' : 'p-white'} fw-bold`}>
            Page {currentPage} of {totalPages} — Viewing {startIndex + 1}-{
              endIndex > newsletters.length ? newsletters.length : endIndex
            } of {newsletters.length} entries
          </span>
        </div>
        <CPagination align='center'>
          {[...Array(totalPages)].map((_, index) => (
            <CPaginationItem
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => {
                setCurrentPage(index + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ cursor: 'pointer' }}
            >
              {index + 1}
            </CPaginationItem>
          ))}
        </CPagination>
      </div>
    </div>
  );
};




class ManagerNewsletter extends React.PureComponent {
  componentDidMount() {
    this.props.fetchNewsletters();
    this.props.getUserEvent();
    if (this.props.userRole === ROLES.Admin) {
      this.props.fetchMailingListDetails();
    }
  }
  render () {
    return (
      <Newsletter {...this.props} />
    )
  }
}

const mapStateToProps = state => ({
  newsletters: state.newsletter.newsletters,
  events: state.event.userEvents,
  userRole: state.account.user.role,
  subscribers: state.newsletter.subscribers,
});

export default connect(mapStateToProps, actions)(ManagerNewsletter);