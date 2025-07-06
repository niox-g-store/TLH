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
import Button from '../../Common/HtmlTags/Button';
import ResolveImage from '../../store/ResolveImage';
import GetTicketPrice from '../../store/GetTicketPricing';
import { ROLES } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import actions from "../../../actions";
import { withRouter } from '../../../withRouter';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoBack } from '../../../containers/goBack/inedx';

const statsFunc = (events) => {
  const statuses = {
    topTicket: 'Regular',
    total: 0,
  };
  for (const items of events) {
    if (Object.keys(statuses).includes(items.status)) {
      statuses[items.status] += 1;
    }
  }
  return statuses;
};

export const ManagerTicketHelper = (props) => {
  const { isLightMode, user, tickets, adminGoBack } = props;

  const navigate = useNavigate()

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
        {adminGoBack
          ?
          < GoBack text={"Go back"} navigate={navigate}/>
          :
          <Button onClick={() => navigate('/dashboard/tickets/add')} type={"third-btn"} text={"Create Ticket +"} />
        }
      </div>
      {
        user.role === ROLES.Admin && !adminGoBack &&
        <Button onClick={() => navigate("/dashboard/tickets/my-tickets")} cls={`${isLightMode ? 'bg-white p-black': 'bg-black p-white'} align-self-end`} type={"third-btn"} text={"My Tickets"}/>
      }

      <hr className={`${isLightMode ? 'p-black': 'p-white'}`}></hr>
      <div>
        {/* Ticket Stats Summary */}
        <CRow className="mb-4 g-2">
          <CCol sm={3}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
              <CCardBody>
                <CCardTitle>Most bought ticket type</CCardTitle>
                <CCardText>Regular</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
              <CCardBody>
                <CCardTitle>Total Tickets</CCardTitle>
                <CCardText>{tickets.length || 0}</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Ticket List */}
        <CRow className="gy-4">
          {currentTickets.map((ticket, idx) => (
            <CCol md={6} key={idx}>
            <Link to={`/dashboard/tickets/edit/${ticket._id}`}>
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden card-for-mobile`}>
                <CImage
                  src={ResolveImage(ticket.image, 'ticket')}
                  alt={ticket.type}
                  style={{ width: '40%', objectFit: 'cover' }}
                />
                <CCardBody style={{ padding: '.5em 0em .5em 1em', margin: '0' }}>
                  <CCardTitle style={{ width: 'fit-content', padding: '0' }} className="mb-2">{ticket.type}</CCardTitle>

                  <CCardText style={{ width: 'fit-content' }} as={'div'} className="mt-2">
                    <GetTicketPrice style={{ width: 'fit-content' }} ticket={ticket} />
                      <strong style={{ width: 'fit-content' }}>Coupons included: {ticket.coupons.length || 0}</strong><br />
                      <strong style={{ width: 'fit-content' }}>Sold:</strong> {ticket.quantitySold || 0}
                  </CCardText>
                </CCardBody>
              </CCard>
              </Link>
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
};

class ManagerTicket extends React.PureComponent {
  componentDidMount () {
    this.props.fetchTickets();
  }

  render () {
    return (
      <ManagerTicketHelper {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.ticket.tickets,
  ticketIsLoading: state.ticket.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(ManagerTicket));
