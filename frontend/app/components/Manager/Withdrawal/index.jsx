import React, { useState } from 'react';
import {
  CRow,
  CCol,
  CBadge,
  CCard
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import { ROLES } from '../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../Common/HtmlTags/Input';
import { connect } from 'react-redux';
import actions from '../../../actions';
import ManagerPagination from '../Pagination';
import LoadingIndicator from '../../store/LoadingIndicator';
import AssetDistribution from '../../store/AssetDistribution';
import WithdrawalGridItem from '../../store/WithdrawalGridItem';

const ManagerWithdrawForm = (props) => {
  const {
    isLightMode,
    user,
    withdrawals = [],
    withdrawIsLoading,
    earnings,
    withdrawnAmount,
    canWithdrawAmount,
    commission,
    withdrawalPaginated = [],
    withdrawalPage,
    withdrawalPageCount,
    fetchWithdrawals,
    initialiseWithdrawal
  } = props;

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const withdrawalsPerPage = 10;

  const filteredWithdrawals = withdrawals.filter(w =>
    w?.order?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const startIndex = (withdrawalPage - 1) * withdrawalsPerPage;
  // const endIndex = startIndex + withdrawalsPerPage;
  const startIndex = 0;
  const endIndex = withdrawalsPerPage;
  const currentWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

  const canWithdraw = currentWithdrawals.filter(w => w.canWithdraw === true && ['failed', 'pending'].includes(w.status));
  const cannotWithdraw = currentWithdrawals.filter(w => w.canWithdraw === false)

  const canWithdrawIds = canWithdraw.map(i => i._id);

  const handleSearch = (name, value) => {
    setSearchTerm(value);
  };

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em withdrawal'>
      {withdrawIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      {user.role === ROLES.Admin ? (
        <>
          <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Admin Withdrawals</h2>
            <div style={{ gap: '2em' }} className='d-flex justify-content-between'>
              <Link to={'/dashboard/withdrawals/organizers'}>
                <Button style={{ fontSize: '16px' }} type='third-btn' text='View Organizers Withdrawals' />
              </Link>
              <Link to={'/dashboard/withdrawals/history'}>
                <Button style={{ fontSize: '16px' }} type='third-btn' text='View Withdrawal history' />
              </Link>
            </div>
        </>
      )
      :
      (
        <>
          <div style={{ gap: '2em' }} className='d-flex justify-content-between'>
            <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Withdrawals</h2>
            <Button style={{ fontSize: '13px' }} onClick={() => navigate('/dashboard/withdrawals/history')} type='third-btn' text='Withdrawal history' />
          </div>
        </>
      )
      }

      <hr className={`${isLightMode ? 'p-black' : 'p-white'} my-4`} />

      <CRow className='mb-4 g-2'>
        <CCol className='col'>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-black'} text-white`}>
            <AssetDistribution {...props}/>
          </CCard>
        </CCol>
      </CRow>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search withdrawals by order ID..."
          name="searchWithdrawals"
          value={searchTerm}
          onInputChange={handleSearch}
        />
      </div>

      {currentWithdrawals.length > 0 ? (
        <div style={{ gap: '3em' }} className='withdrawals-group d-flex flex-column'>
        {canWithdraw.length > 0 &&
          <div className='can-withdraw-withdrawals'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Ready for withdraw</h3>
              <Button onClick={() => initialiseWithdrawal(canWithdrawIds, null, navigate)}
                style={{ padding: '10px 20px' }}
                text={"withdraw all"}
              />
            </div>
            <WithdrawalGridItem
              user={user}
              isLightMode={isLightMode}
              currentWithdrawals={canWithdraw}
              initialiseWithdrawal={initialiseWithdrawal}
            />
          </div>
        }

        {cannotWithdraw.length > 0 &&
          <div className='can-withdraw-withdrawals'>
            <h3 className={`text-center py-12 ${isLightMode ? 'p-black' : 'p-white'}`}>Not Ready for withdraw</h3>
            <WithdrawalGridItem
              user={user}
              isLightMode={isLightMode}
              currentWithdrawals={cannotWithdraw}
            />
          </div>
        }
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
        onPageChange={(v) => fetchWithdrawals(false, v)}
        startIndex={startIndex}
      />
    </div>
  );
};

class ManagerWithdraw extends React.PureComponent {
  componentDidMount () {
    this.props.resetWithdrawal();
    this.props.fetchWithdrawals();
  }

  render () {
    return <ManagerWithdrawForm {...this.props} />;
  }
}

const mapStateToProps = state => ({
  withdrawals: state.withdraw.withdrawals,
  withdrawIsLoading: state.withdraw.withdrawalIsLoading,
  earnings: state.withdraw.earnings,
  withdrawnAmount: state.withdraw.withdrawnAmount,
  canWithdrawAmount: state.withdraw.canWithdrawAmount,
  commission: state.withdraw.commission,
  withdrawalPage: state.withdraw.withdrawalPage,
  withdrawalPageCount: state.withdraw.withdrawalPageCount,
  withdrawalPaginated: state.withdraw.withdrawalPaginated,
  user: state.account.user,
});

export default connect(mapStateToProps, actions)(ManagerWithdraw);
