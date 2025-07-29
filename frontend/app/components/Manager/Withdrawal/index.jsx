import React, { useState } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import { ROLES } from '../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
import Input from '../../Common/HtmlTags/Input';
import { connect } from 'react-redux';
import actions from '../../../actions';
import ManagerPagination from '../Pagination';
import ChartDoughnutAndPie from '../../store/Core/donughtAndPieChart';
import LoadingIndicator from '../../store/LoadingIndicator';
import AssetDistribution from '../../store/AssetDistribution';
import WithdrawalInformation from '../../store/WithdrawalInformation';

const ManagerWithdrawForm = (props) => {
  const {
    isLightMode,
    user,
    withdrawals = [],
    withdrawIsLoading,
    earnings,
    withdrawnAmount,
    commission,
    withdrawalPaginated,
    withdrawalPage,
    withdrawalPageCount,
    fetchWithdrawals
  } = props;

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const eventsPerPage = 10;

  const filteredWithdrawals = withdrawals.filter(w =>
    w?.order?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (withdrawalPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

  const handleSearch = (name, value) => {
    setSearchTerm(value);
  };

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em withdrawal'>
      {withdrawIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div style={{ gap: '2em' }} className='d-flex justify-content-between'>
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Withdrawals</h2>
        {user.role === ROLES.Admin && (
          <Button style={{ fontSize: '13px' }} onClick={() => navigate('/dashboard/withdrawals/organizers')} type='third-btn' text='View Organizers Withdrawals' />
        )}
      </div>

      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      <CRow className='mb-4 g-2'>
        <CCol className='col'>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <AssetDistribution {...props}/>
          </CCard>
        </CCol>
      </CRow>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search withdrawals by order ID..."
          name="searchWithdrawals"
          value={searchTerm}
          onInputChange={handleSearch}
        />
      </div>

      {currentWithdrawals.length > 0 ? (
        <CRow className="gy-4">
          {currentWithdrawals.map((withdrawal, idx) => (
            <CCol md={6} key={idx}>
                <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-column`}>
                    <WithdrawalInformation isLightMode={isLightMode} withdrawal={withdrawal}/>
                </CCard>
            </CCol>
          ))}
        </CRow>
      ) : (
        <div className={`text-center py-5 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <h3>No withdrawals found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      <ManagerPagination
        isLightMode={isLightMode}
        data={withdrawalPaginated}
        totalPages={withdrawalPageCount}
        onPageChange={fetchWithdrawals}
      />
    </div>
  );
};

class ManagerWithdraw extends React.PureComponent {
  componentDidMount () {
    this.props.fetchWithdrawals();
  }

  render () {
    return <ManagerWithdrawForm {...this.props} />;
  }
}

const mapStateToProps = state => ({
  withdrawals: state.withdraw.withdrawals,
  withdrawIsLoading: state.withdraw.isLoading,
  earnings: state.withdraw.earnings,
  withdrawnAmount: state.withdraw.withdrawnAmount,
  commission: state.withdraw.commission,
  withdrawalPage: state.withdraw.withdrawalPage,
  withdrawalPageCount: state.withdraw.withdrawalPageCount,
  withdrawalPaginated: state.withdraw.withdrawalPaginated,
  user: state.account.user,
});

export default connect(mapStateToProps, actions)(ManagerWithdraw);