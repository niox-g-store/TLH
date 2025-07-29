import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CBadge,
  CCard
} from '@coreui/react';
import Button from '../../../Common/HtmlTags/Button';
import { ROLES } from '../../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../Common/HtmlTags/Input';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import ManagerPagination from '../../Pagination';
import LoadingIndicator from '../../../store/LoadingIndicator';
import AssetDistribution from '../../../store/AssetDistribution';
import WithdrawalInformation from '../../../store/WithdrawalInformation';
import { GoBack } from '../../../../containers/goBack/inedx';

const OrganizersManagerWithdrawForm = (props) => {
  const {
    isLightMode,
    user,
    withdrawals = [],
    withdrawIsLoading,
    earnings,
    withdrawnAmount,
    canWithdrawAmount,
    commission,
    withdrawalPaginated,
    withdrawalPage,
    withdrawalPageCount,
    fetchWithdrawals
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()
  const eventsPerPage = 10;

  const filteredWithdrawals = withdrawals.filter(w => {
    const name = w?.organizer?.companyName?.toLowerCase() || '';
    const email = w?.organizer?.email?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  const startIndex = (withdrawalPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

  const handleSearch = (name, value) => {
    setSearchTerm(value);
  };

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em withdrawal'>
      {withdrawIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      {user.role === ROLES.Admin &&
        <div style={{ gap: '2em' }} className='d-flex justify-content-between'>
          <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Organizers Withdrawals</h2>
          <GoBack text={"Go back"} navigate={navigate}/>
        </div>
      }

      <hr className={`${isLightMode ? 'p-black' : 'p-white'} my-4`} />

      <CRow className='mb-4 g-2'>
        <CCol className='col'>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <AssetDistribution org={true} {...props}/>
          </CCard>
        </CCol>
      </CRow>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="search by company name or email..."
          name="searchWithdrawals"
          value={searchTerm}
          onInputChange={handleSearch}
        />
      </div>

      {currentWithdrawals.length > 0 ? (
        <div style={{ gap: '3em' }} className='withdrawals-group d-flex flex-column'>
            {currentWithdrawals.map((withdraw, index) => (
                <div className='organizer-withdrawals' key={index}>
                    <WithdrawalInformation isLightMode={isLightMode} withdrawal={withdraw}/>
                </div>
            ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <h3 className="text-2xl font-semibold mb-2">No withdrawals found</h3>
        </div>
      )}

      <ManagerPagination
        isLightMode={isLightMode}
        data={withdrawalPaginated}
        totalPages={withdrawalPageCount}
        onPageChange={(v) => fetchWithdrawals(true, v)}
        startIndex={startIndex}
      />
    </div>
  );
};

class OrganizersManagerWithdraw extends React.PureComponent {
  componentDidMount () {
    this.props.fetchWithdrawals(true);
  }

  render () {
    return <OrganizersManagerWithdrawForm {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    withdrawals: state.withdraw.withdrawals,
    withdrawIsLoading: state.withdraw.isLoading,
    earnings: state.withdraw.earnings,
    withdrawnAmount: state.withdraw.withdrawnAmount,
    canWithdrawAmount: state.withdraw.canWithdrawAmount,
    commission: state.withdraw.commission,
    withdrawalPage: state.withdraw.withdrawalPage,
    withdrawalPageCount: state.withdraw.withdrawalPageCount,
    withdrawalPaginated: state.withdraw.withdrawalPaginated,
    user: state.account.user,
  }
};

export default connect(mapStateToProps, actions)(OrganizersManagerWithdraw);
