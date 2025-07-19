import React, { useState } from 'react';
import Button from "../../../Common/HtmlTags/Button";
import actions from "../../../../actions";
import { withRouter } from "../../../../withRouter";
import { connect } from "react-redux";

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
import resolveImage from '../../../store/ResolveImage';
import { ROLES, API_URL } from '../../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../../../../utils/formatDate';
import { GoBack } from '../../../../containers/goBack/inedx';

const statsFunc = (events) => {
  const statuses = {
    topSelling: 'Bash Party',
    Upcoming: 0,
    Ended: 0,
    Ongoing: 0
  };
  for (const items of events) {
    if (Object.keys(statuses).includes(items.status)) {
      statuses[items.status] += 1;
    }
  }
  return statuses;
};

const AdminEventView = (props) => {
  const {
    isLightMode,
    user,
    events = [],
    fetchEvents
  } = props;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);
  const stats = statsFunc(events);

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex flex-column'>
        <div className='align-self-end'>
            <GoBack navigate={navigate} text={"go back"}/>
        </div>
        {/* Event Stats Summary */}
        <CRow className='mb-4 g-2'>
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
                <CCardText>{stats.Upcoming || 0}</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
              <CCardBody>
                <CCardTitle>Expired Events</CCardTitle>
                <CCardText>{stats.Ended || 0}</CCardText>
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
        <CRow className='gy-4'>
          {currentEvents.map((event, idx) => (
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
                      </CCardText>
                  </CCardBody>
                </CCard>
              </Link>
            </CCol>
          ))}
        </CRow>

        <div className='mt-4'>
          <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
            <span className={`${isLightMode ? 'p-black' : 'p-white'} fw-bold`}>
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

class AdminEvent extends React.PureComponent {
    componentDidMount() {
        this.props.getUserEvent();
    }
    render () {
        const { userEvents, isLightMode } = this.props;
        return (
            <>
            <AdminEventView {...this.props}/>
            </>
        )
    }
}

const mapStateToProps = state => ({
  eventIsLoading: state.event.isLoading,
  events: state.event.userEvents,
  isLightMode: state.dashboard.isLightMode,
});

export default connect(mapStateToProps, actions)(withRouter(AdminEvent));
