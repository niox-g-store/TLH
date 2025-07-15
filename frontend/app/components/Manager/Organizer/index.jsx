import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import Input from '../../Common/HtmlTags/Input';
import actions from '../../../actions';
import LoadingIndicator from '../../store/LoadingIndicator';

const OrganizerList = ({ organizers = [], isLoading, fetchOrganizers, isLightMode }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

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
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      <Input
        placeholder='Search by name or email'
        value={search}
        onInputChange={(name, val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
      />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <CRow className='mt-4 gy-3'>
          {currentItems.map((org, i) => (
            <CCol md={6} key={org._id || i}>
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
                <CCardBody>
                  <CCardTitle className='fw-bold'>{org.companyName || 'N/A'}</CCardTitle>
                  <CCardText>
                    <strong>Email:</strong> {org.email}<br />
                    <strong>Phone:</strong> {org.phoneNumber || 'N/A'}<br />
                    <strong>Total Events:</strong> {org.event?.length || 0}
                  </CCardText>
                  <Link to={`/dashboard/organizer/${org._id}`} className='btn btn-sm btn-outline-primary'>View Organizer</Link>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}

      {totalPages > 1 && (
        <CPagination align="center" className='mt-4'>
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

const mapStateToProps = (state) => ({
  organizers: state.organizer.organizers,
  isLoading: state.organizer.loading,
  isLightMode: state.dashboard.isLightMode,
});

export default connect(mapStateToProps, actions)(OrganizerList);
