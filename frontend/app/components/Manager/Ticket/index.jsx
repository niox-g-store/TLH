import React, { useState } from 'react';
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
import { tickets } from '../../Data/ticketData';
import ResolveImage from '../../store/ResolveImage';
import AddTicket from './Add';
import GetTicketPrice from '../../store/GetTicketPricing';
import AdminTicket from './AdminTicket';
import { ROLES } from '../../../constants';

class ManagerTicket extends React.PureComponent {


  render() {
  const { isLightMode,
          stats = {
            topTicket: 'Regular',
            expired: 1,
            total: 4,
            available: 3
          },
          user
  } = this.props;

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = tickets.slice(startIndex, endIndex);

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black': 'p-white'}`}>Tickets</h2>
      <AddTicket />
      </div>
      {
        user.role === ROLES.Admin && <AdminTicket {...props}/>
      }
      <hr className={`${isLightMode ? 'p-black': 'p-white'}`}></hr>
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
          {currentTickets.map((ticket, idx) => (
            <CCol md={6} key={idx}>
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
                <CImage
                  src={ResolveImage(ticket.image, 'ticket')}
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
                  <CCardText as={'div'} className="mt-2">
                    <strong>Event:</strong> {ticket.event}<br />
                    <GetTicketPrice ticket={ticket} />
                    <strong>Sold:</strong> {ticket.quantitySold}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </div>

      <div className='mt-4'>
      <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
        <span className={`${isLightMode ? 'p-black': 'p-white'} fw-bold`}>
          Page {currentPage} of {totalPages} — Viewing {startIndex + 1}-{
            endIndex > tickets.length ? tickets.length : endIndex
          } of {tickets.length} entries
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
}
};

export default ManagerTicket;
