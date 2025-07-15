import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  CRow,
  CCol,
  CCard,
  CBadge,
  CCardBody,
  CCardTitle,
  CCardText,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import Input from '../../Common/HtmlTags/Input';
import actions from '../../../actions';
import LoadingIndicator from '../../store/LoadingIndicator';

const OrganizerList = (props) => {
  const { organizers = [], isLoading, isLightMode } = props;
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrganizers = organizers.filter(o =>
    o.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    o.email?.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrganizers.length / itemsPerPage);
  const currentItems = filteredOrganizers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Organizers</h2>
      <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>{organizers.length} Organizers</p>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      <Input
        type='search'
        placeholder='Search by name or email'
        value={search}
        onInputChange={(name, val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
      />

      {isLoading
        ? (
          <LoadingIndicator />
          )
        : (
          <CRow className='mt-4 gy-3'>
            {currentItems.map((org, i) => (
              <CCol md={6} key={org._id || i}>
                <Link to={`/dashboard/organizer/${org._id}`}>
                  <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
                    <CCardBody>
                      <CCardTitle className='fw-bold'>{org.companyName || 'N/A'}</CCardTitle>
                      <CCardText>
                        <strong>Email:</strong> {org.email}<br />
                        <strong>Phone:</strong> {org.phoneNumber || 'N/A'}<br />
                        <strong>Total Events:</strong> {org.eventCount || 0}<br />
                        <CBadge color={org.isActive ? 'success' : 'danger'}>
                        {org.isActive ? 'Active' : 'Suspended'}
                        {org.banned && ' And Banned'}
                        </CBadge>
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </Link>
              </CCol>
            ))}
          </CRow>
          )}

      {totalPages > 1 && (
        <CPagination align='center' className='mt-4'>
          {[...Array(totalPages)].map((_, idx) => (
            <CPaginationItem
              key={idx}
              active={currentPage === idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </CPaginationItem>
          ))}
        </CPagination>
      )}
    </div>
  );
};

class ManagerOrganizers extends React.PureComponent {
  componentDidMount () {
    this.props.fetchOrganizers();
  }

  render () {
    return (
      <OrganizerList {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  organizers: state.organizer.organizers,
  isLoading: state.organizer.loading,
  isLightMode: state.dashboard.isLightMode
});

export default connect(mapStateToProps, actions)(ManagerOrganizers);
