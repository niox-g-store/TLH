import { useState } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CImage,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { events } from './eventData';
import ResolveImage from '../../store/ResolveImage';
import AddEvent from './Add';

const ManagerEvent = (props) => {
    const { stats = { topSelling: 'Bash Party',
                      upcoming: 5,
                      expired: 2,
                      total: 12
                    },
            isLightMode
          } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;
    
    const totalPages = Math.ceil(events.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = events.slice(startIndex, endIndex);
    
  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black': 'p-white'}`}>Events</h2>
        <AddEvent />
      </div>
      <hr className={`${isLightMode ? 'p-black': 'p-white'}`}></hr>
        <div>
      {/* Event Stats Summary */}
      <CRow className="mb-4 g-2">
        <CCol sm={3}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Top Selling</CCardTitle>
              <CCardText>{stats.topSelling || 'Bash Party'}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Upcoming Events</CCardTitle>
              <CCardText>{stats.upcoming || 0}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Expired Events</CCardTitle>
              <CCardText>{stats.expired || 0}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Total Events</CCardTitle>
              <CCardText>{stats.total || events.length}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Event List */}
      <CRow className="gy-4">
        {currentEvents.map((event, idx) => (
          <CCol md={6} key={idx}>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
              <CImage
                src={ResolveImage(event.image)}
                alt={event.title}
                style={{ width: '40%', objectFit: 'cover' }}
              />
              <CCardBody> 
                <CCardTitle className="mb-2">{event.title}</CCardTitle>
<CBadge color={
  event.status === 'expired' ? 'danger' :
  event.status === 'upcoming' ? 'primary' :
  event.status === 'ongoing' ? 'success' :
  'secondary'
}>
  {event.status}
</CBadge>
                <CCardText className="mt-2">
                  <strong>Date:</strong> {event.date}<br />
                  <strong>Venue:</strong> {event.venue}<br />
                  <strong>Tickets Sold:</strong> {event.ticketsSold}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

<div className='mt-4'>
      <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
        <span className={`${isLightMode ? 'p-black': 'p-white'} fw-bold`}>
          Page {currentPage} of {totalPages} — Viewing {startIndex + 1}-{
            endIndex > events.length ? events.length : endIndex
          } of {events.length} entries
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
    </div>
  );
};

export default ManagerEvent;
