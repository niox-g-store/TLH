import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CImage
} from '@coreui/react';
import { tickets } from './ticketData';
import ResolveImage from '../../store/ResolveImage';
import AddTicket from './Add';

const ManagerTicket = ({ isLightMode, stats = {
  topTicket: 'Regular',
  expired: 1,
  total: 4,
  available: 3
} }) => {
  return (
    <div className='container-lg px-4 d-flex flex-column align-items-end'>
      <AddTicket />
      <div>
        {/* Ticket Stats Summary */}
        <CRow className="mb-4 g-2">
          <CCol sm={3}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
              <CCardBody>
                <CCardTitle>Most bought ticket type</CCardTitle>
                <CCardText>{stats.topTicket}</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
              <CCardBody>
                <CCardTitle>Available Tickets</CCardTitle>
                <CCardText>{stats.available}</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
              <CCardBody>
                <CCardTitle>Expired Tickets</CCardTitle>
                <CCardText>{stats.expired}</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
              <CCardBody>
                <CCardTitle>Total Tickets</CCardTitle>
                <CCardText>{stats.total}</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Ticket List */}
        <CRow className="gy-4">
          {tickets.map((ticket, idx) => (
            <CCol md={6} key={idx}>
              <CCard className="flex-row overflow-hidden">
                <CImage
                  src={ResolveImage('ticket', ticket.image)}
                  alt={ticket.type}
                  style={{ width: '40%', objectFit: 'cover' }}
                />
                <CCardBody>
                  <CCardTitle className="mb-2">{ticket.type}</CCardTitle>
                  <CBadge color={
                    ticket.status === 'expired' ? 'danger' :
                    ticket.status === 'available' ? 'success' :
                    'secondary'
                  }>
                    {ticket.status}
                  </CBadge>
                  <CCardText className="mt-2">
                    <strong>Event:</strong> {ticket.event}<br />
                    <strong>Price:</strong> ₦{ticket.price}<br />
                    <strong>Sold:</strong> {ticket.quantitySold}
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

export default ManagerTicket;
