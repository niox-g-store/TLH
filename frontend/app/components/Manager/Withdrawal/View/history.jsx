import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../../../withRouter';
import actions from '../../../../actions';
import ManagerPagination from '../Pagination';
import LoadingIndicator from '../../store/LoadingIndicator';
import WithdrawalGridItem from '../../../store/WithdrawalGridItem';

import React, { useState } from 'react';
import WithdrawalGridItem from '../../../store/WithdrawalGridItem';
import Input from '../../../Common/HtmlTags/Input';
import LoadingIndicator from '../../../store/LoadingIndicator';

const HistoryWithdrawalsForm = (props) => {
  const {
    withdrawals = [],
    isLightMode,
    user,
    withdrawIsLoading,
    withdrawalPaginated,
    withdrawalPage,
    withdrawalPageCount,
    fetchWithdrawalsHistory
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const eventsPerPage = 10;

  const handleSearch = (name, value) => {
    setSearchTerm(value);
  };

  const filtered = withdrawals.filter(w =>
    w?.order?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (withdrawalPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentWithdrawals = filtered.slice(startIndex, endIndex);

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em withdrawal'>
      {withdrawIsLoading && <LoadingIndicator isLightMode={isLightMode} />}

      <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Withdrawal History</h2>

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
    const userId = this.props.match.params.id || this.props?.user?._id;
    if (userId) {
      this.props.fetchWithdrawalsHistory(userId);
    }
  }

  render () {
    return <HistoryWithdrawalsForm {...this.props} />;
  }
}

const mapStateToProps = state => ({
  withdrawals: state.withdraw.withdrawals,
  isLightMode: state.dashboard.isLightMode,
  user: state.account.user,
  withdrawIsLoading: state.withdraw.isLoading,
  withdrawalPage: state.withdraw.withdrawalPage,
  withdrawalPageCount: state.withdraw.withdrawalPageCount,
  withdrawalPaginated: state.withdraw.withdrawalPaginated
});

export default connect(mapStateToProps, actions)(withRouter(HistoryWithdrawals));


