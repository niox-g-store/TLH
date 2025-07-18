import React, { useState } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import Input from '../../Common/HtmlTags/Input';
import { withRouter } from '../../../withRouter';
import actions from '../../../actions';
import { connect } from 'react-redux';
import ManagerPagination from '../Pagination';
import { formatDate } from '../../../utils/formatDate';
import LoadingIndicator from '../../store/LoadingIndicator';

const ManagerUserHelper = (props) => {
  const {
    isLightMode,
    users = [],
    isLoading
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 10;

  const handleSearch = (name, value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
        {isLoading && <LoadingIndicator /> }
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>Users</h2>
      </div>
      <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>{users.length} Users</p>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      <div className='mb-4'>
        <Input
          type='search'
          placeholder='Search users by name or email...'
          name='searchUsers'
          value={searchTerm}
          onInputChange={handleSearch}
        />
      </div>

      {currentUsers.length > 0 ? (
        <CRow className='gy-4'>
          {currentUsers.map((user, idx) => (
            <CCol md={6} key={idx}>
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
                <CCardBody>
                  <CCardTitle className='mb-2'>{user.name || 'No Name'}</CCardTitle>
                  <CCardText>
                    <strong>Email:</strong> {user.email || 'N/A'}<br />
                    <strong>Username:</strong> {user.userName || 'N/A'}<br />
                    <strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}<br />
                    <strong>Role:</strong> {user.role || 'N/A'}<br />
                    <strong>Provider:</strong> {user.provider || 'N/A'}<br />
                    <strong>Created At:</strong> {formatDate(user.createdAt)}<br />
                    <strong>Two-Factor Active:</strong> {user.isTwoFactorActive ? 'Yes' : 'No'}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      ) : (
        <div className={`text-center py-5 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <h3>No users found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      <ManagerPagination
        isLightMode={isLightMode}
        data={filteredUsers}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

class ManagerUsers extends React.PureComponent {
  componentDidMount () {
    this.props.fetchUsers();
  }

  render () {
    return <ManagerUserHelper {...this.props} />;
  }
}

const mapStateToProps = state => ({
  users: state.user.users,
  isLightMode: state.dashboard.isLightMode,
  isLoading: state.user.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(ManagerUsers));
