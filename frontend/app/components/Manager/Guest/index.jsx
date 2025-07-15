import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText
} from '@coreui/react';
import Input from '../../Common/HtmlTags/Input';
import { formatDate } from '../../../utils/formatDate';
import { connect } from 'react-redux';
import actions from '../../../actions';
import ManagerPagination from '../Pagination';
import { withRouter } from '../../../withRouter';
import LoadingIndicator from '../../store/LoadingIndicator';

const ManagerGuestHelper = (props) => {
  const {
    isLightMode,
    guests = [],
    isLoading
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const guestsPerPage = 10;

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);
  const startIndex = (currentPage - 1) * guestsPerPage;
  const endIndex = startIndex + guestsPerPage;
  const currentGuests = filteredGuests.slice(startIndex, endIndex);

  const handleSearch = (name, value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
        {isLoading && <LoadingIndicator/>}
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>Guests</h2>
      </div>
      <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>{guests.length} Guests</p>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search guests by name or email..."
          name="searchGuests"
          value={searchTerm}
          onInputChange={handleSearch}
        />
      </div>

      {currentGuests.length > 0 ? (
        <CRow className='gy-4'>
          {currentGuests.map((guest, idx) => (
            <CCol md={6} key={idx}>
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
                <CCardBody>
                  <CCardTitle>{guest.name}</CCardTitle>
                  <CCardText>
                    <strong>Email:</strong> {guest.email}<br />
                    <strong>Event:</strong> {guest.eventId.name}<br />
                    <strong>Ticket:</strong> {guest.ticketId.type}<br />
                    <strong>Checked In:</strong> {guest.checkedIn ? 'Yes' : 'No'}<br />
                    <strong>Date:</strong> {formatDate(guest.createdAt)}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      ) : (
        <div className={`text-center py-5 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <h3>No guests found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      <ManagerPagination
        isLightMode={isLightMode}
        data={filteredGuests}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

class ManagerGuests extends React.PureComponent {
  componentDidMount () {
    this.props.fetchGuests();
  }

  render () {
    return <ManagerGuestHelper {...this.props} />;
  }
}

const mapStateToProps = state => ({
  guests: state.guest.guests,
  isLightMode: state.dashboard.isLightMode,
  isLoading: state.guest.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(ManagerGuests));
