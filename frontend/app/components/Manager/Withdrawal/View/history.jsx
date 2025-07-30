import React, { useState } from 'react';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import ManagerPagination from '../../Pagination';
import WithdrawalGridItem from '../../../store/WithdrawalGridItem';
import Input from '../../../Common/HtmlTags/Input';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';
import { useNavigate } from 'react-router-dom';
import AssetDistribution from '../../../store/AssetDistribution';

const HistoryWithdrawalsForm = (props) => {
  const {
    withdrawals = [],
    isLightMode,
    user,
    withdrawIsLoading,
    withdrawalPaginated,
    withdrawalPage,
    withdrawalPageCount,
    fetchWithdrawalsHistory,
    withdrawnAmount
  } = props;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const withdrawalsPerPage = 10;
  const handleSearch = (name, value) => {
    setSearchTerm(value);
  };

  const filtered = withdrawals.filter(w =>
    w?.order?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // const startIndex = (withdrawalPage - 1) * withdrawalsPerPage;
  // const endIndex = startIndex + withdrawalsPerPage;
  const startIndex = 0;
  const endIndex = withdrawalsPerPage;

  const currentWithdrawals = filtered.slice(startIndex, endIndex);

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em withdrawal-history'>
      {withdrawIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div style={{ gap: '2em' }} className='d-flex justify-content-between'>
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Withdrawal History</h2>
        <GoBack text={"Go Back"} navigate={navigate}/>
      </div>

      <AssetDistribution isLightMode={isLightMode} withdrawnAmount={withdrawnAmount}/>

      <div className="my-4">
        <Input
          type="search"
          placeholder="Search withdrawals by order ID..."
          name="searchWithdrawals"
          value={searchTerm}
          onInputChange={handleSearch}
        />
      </div>

      {currentWithdrawals.length > 0 ? (
        <WithdrawalGridItem
          user={user}
          isLightMode={isLightMode}
          currentWithdrawals={currentWithdrawals}
        />
      ) : (
        <div className={`text-center py-12 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <h3 className="text-2xl font-semibold mb-2">No completed withdrawals found</h3>
        </div>
      )}

      <ManagerPagination
        isLightMode={isLightMode}
        data={withdrawalPaginated}
        totalPages={withdrawalPageCount}
        onPageChange={(v) => fetchWithdrawalsHistory(user._id, v)}
        startIndex={startIndex}
      />
    </div>
  );
};

class HistoryWithdrawals extends React.PureComponent {
  componentDidMount () {
    this.props.resetWithdrawal();
    this.props.fetchWithdrawalsHistory();
  }

  render () {
    return <HistoryWithdrawalsForm {...this.props} />;
  }
}

const mapStateToProps = state => ({
  withdrawals: state.withdraw.withdrawals,
  isLightMode: state.dashboard.isLightMode,
  user: state.account.user,
  withdrawIsLoading: state.withdraw.withdrawalIsLoading,
  withdrawalPage: state.withdraw.withdrawalPage,
  withdrawalPageCount: state.withdraw.withdrawalPageCount,
  withdrawalPaginated: state.withdraw.withdrawalPaginated,
  withdrawnAmount: state.withdraw.withdrawnAmount
});

export default connect(mapStateToProps, actions)(HistoryWithdrawals);


