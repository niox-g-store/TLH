import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CImage,
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
  return (
    <div className='container-lg px-4 d-flex flex-column align-items-end mb-custom-5em'>
        <AddEvent />
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
        {events.map((event, idx) => (
          <CCol md={6} key={idx}>
            <CCard className="flex-row overflow-hidden">
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
      </div>
    </div>
  );
};

export default ManagerEvent;
