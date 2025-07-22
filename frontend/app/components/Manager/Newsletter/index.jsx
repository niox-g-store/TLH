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
import { Link } from 'react-router-dom';
import Button from '../../Common/HtmlTags/Button';
import { API_URL } from '../../../constants';
import resolveImage from '../../store/ResolveImage';
import { formatDate } from '../../../utils/formatDate';

const Newsletter = (props) => {
  const { isLightMode, newsletters, userRole, events } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const newslettersPerPage = 10;

  const totalPages = Math.ceil(newsletters.length / newslettersPerPage);
  const startIndex = (currentPage - 1) * newslettersPerPage;
  const endIndex = startIndex + newslettersPerPage;
  const currentNewsletters = newsletters.slice(startIndex, endIndex);

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Newsletter</h2>
      </div>
        <h3 className={`${isLightMode ? 'p-black': 'p-white'}`}>Send reminders, newsletters, and campaign emails to users </h3>  
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      {userRole === ROLES.Admin && (
        <div className="admin-section">
          <p>As an admin, you can send newsletters to subscribers, users, and organizers.</p>
          <Button
            className="primary"
            text="Create Newsletter"
            onClick={() => window.location.href = '/dashboard/newsletter/add'}
          />
        </div>
      )}
      {currentNewsletters.length > 0 ?
        currentNewsletters.map(newsletter => (
          <li key={newsletter.id}>
            <Link to={`/dashboard/newsletter/${newsletter.id}`}>{newsletter.title}</Link>
          </li>
      ))
      :
       <p style={{ textAlign: 'center' }}>You have not created any campaign</p>
      }
      {/* Event List */}
        <CRow className='gy-4'>
          <p style={{ textAlign: 'center' }} >You can choose from upcoming or ongoing events to send reminders</p>
          {events.map((event, idx) => (
            <CCol md={6} key={idx}>
              <Link to={`/dashboard/events/edit/${event._id}`}>
                <CCard style={{ height: '95%' }} className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
                  <CImage
                    src={resolveImage(event.imageUrls && event.imageUrls[0] ? `${API_URL}${event.imageUrls[0]}` : '')}
                    alt={event.title}
                    style={{ width: '40%', objectFit: 'cover' }}
                  />
                  <CCardBody>
                    <CCardTitle className='mb-2'>{event.name}</CCardTitle>
                    <CBadge color={ event.status === 'Ended'
                                    ? 'danger'
                                    : event.status === 'Upcoming'
                                    ? 'primary'
                                    : event.status === 'Ongoing'
                                    ? 'success'
                                    : 'secondary'
                                  }
                    >
                      {event.status}
                    </CBadge>
                    <CCardText className='mt-2'>
                      <strong>Start Date:</strong> {formatDate(event.startDate)}<br />
                      <strong>End Date:</strong> {formatDate(event.endDate)}<br />
                      <strong>Venue:</strong> {event.location}<br />
                      <strong>Tickets Sold:</strong> {event.attendees || 0}<br />
                      <strong>Attendees:</strong> {event?.registeredAttendees?.length + event?.unregisteredAttendees?.length || 0}<br />
                      </CCardText>
                  </CCardBody>
                </CCard>
              </Link>
            </CCol>
          ))}
        </CRow>

      {/*<CRow className='gy-4'>
        {currentNewsletters.map((subscriber, idx) => (
          <CCol md={6} key={idx}>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
              <CCardBody>
                <CCardTitle className='mb-2'>{subscriber.email}</CCardTitle>
                <CBadge color={subscriber.status === 'subscribed' ? 'success' : 'danger'} className='mb-2'>
                  {subscriber.status}
                </CBadge>
                <CCardText>
                  <strong>Subscribed At:</strong> {subscriber.subscribedAt}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>*/}

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
});

export default connect(mapStateToProps, actions)(ManagerNewsletter);
