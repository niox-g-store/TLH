import React from "react";
import actions from '../../../../actions';
import { withRouter } from "../../../../withRouter";
import { connect } from "react-redux";
import LoadingIndicator from "../../../store/LoadingIndicator";
import { CBadge } from '@coreui/react';
import Button from "../../../Common/HtmlTags/Button";
import TicketRevenueBreakdown from "../../../store/TicketRevenueBreakdown";
import { GoBack } from "../../../../containers/goBack/inedx";
import { useNavigate } from "react-router-dom";

const WithdrawViewer = ({ isLoading, isLightMode, withdrawal = {}, initialiseWithdrawal }) => {
  const statusColor = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    failed: 'danger',
  };
  const navigate = useNavigate();

  const bgClass = isLightMode ? 'bg-white p-black' : 'bg-black text-white';

  return (
    <div className={`p-4 ${bgClass} d-flex flex-column`}>
        {isLoading && <LoadingIndicator isLightMode={isLightMode} />}
        <div style={{ gap: '2em' }} className='d-flex justify-content-between'>
            <h3 className="mb-4">Withdrawal Details</h3>
            <GoBack text={"Go Back"} navigate={navigate}/>
        </div>

      <div className="mb-3">
        <strong>Status:</strong> <CBadge color={statusColor[withdrawal?.status] || 'secondary'}>{withdrawal?.status}</CBadge>
      </div>
      <div className="mb-3">
        <strong>Amount:</strong> ₦{withdrawal?.amount !== withdrawal?.commission ? `${(withdrawal?.amount).toLocaleString()} (This is an organizer expected payout you cannot withdraw this))` : `${(withdrawal?.amount || 0).toLocaleString()} (you can withdraw this)` }
      </div>
      <div className="mb-3">
        <strong>Commission:</strong> ₦{withdrawal?.amount !== withdrawal?.commission ? `${(withdrawal?.commission).toLocaleString()} (you can withdraw commission only)` : 0}
      </div>
      <div className="mb-3">
        <strong>Processed At:</strong> { withdrawal?.processedAt ? new Date(withdrawal?.processedAt).toLocaleString() : 'Not processed'}
      </div>
      <div className="mb-3">
        <strong>Bank:</strong> {withdrawal?.bankName || 'N/A'} ({withdrawal.bankAccountNumber || 'N/A'})<br/>
      </div>
      <div className="mb-3">
        <strong>Account Name:</strong> {withdrawal.bankAccountName}
      </div>

      {withdrawal?.status !== 'completed' &&
      <div className="mb-3">
        <Button onClick={() => initialiseWithdrawal(withdrawal._id,
                                                    withdrawal.order._id,
                                                    navigate,
                                                    withdrawal?.user?.organizer
                                                   )}
          text={"Withdraw"} />
      </div>
      }

      <hr className="my-4" />

      <h5 className="mb-3">Ticket Items</h5>
      {withdrawal?.order?.cart?.tickets?.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className={isLightMode ? 'table-light' : 'table-dark'}>
              <tr>
                <th>Event</th>
                <th>Ticket Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                {/*<th>Expected Payout (w commission)</th>*/}
                <th>Revenue Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {withdrawal?.order?.cart?.tickets?.map((ticket, idx) => {
                const p = ticket?.discount ? ticket.discountPrice : ticket?.price
                const commission = reverseExpectedPayout(p,
                                                         ticket?.expectedPayout,
                                                         ticket?.quantity, true)
                const getCommission = ((commission/(p * ticket?.quantity)) * 100).toFixed(2)
                return (
                <tr key={idx}>
                  <td>{ticket?.eventName}</td>
                  <td>{ticket?.ticketType}</td>
                  <td>{ticket?.quantity}</td>
                  <td>₦{ticket?.price?.toLocaleString()}</td>
                  <td>{ticket?.discount ? `₦${ticket.discountPrice?.toLocaleString()}` : 'None'}</td>
                  {/*<td>₦{ticket?.expectedPayout?.toLocaleString()}</td>*/}
                  <td>{<TicketRevenueBreakdown
                        price={p} showRevenue={false}
                        isLightMode={isLightMode}
                        commissionPercent={withdrawal?.amount !== withdrawal?.commission ? getCommission : 0}
                      />}
                  </td>
                </tr>
                )
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No tickets found for this withdrawal.</p>
      )}
    </div>
  );
};

const reverseExpectedPayout = (
    price, expectedPayout,
    quantity, isCalculatingCommission = false,
  ) => {
  let parsedPrice = parseFloat(price) || 0;
  const parsedExpected = parseFloat(expectedPayout) || 0;
  if (!isCalculatingCommission) {
    parsedPrice = parsedPrice * quantity
  }

  // Calculate Paystack fee
  let paystackFee = 0
  if (parsedPrice > 2500) {
    paystackFee = (1.5 / 100) * parsedPrice + 100;
  } else {
    paystackFee = (1.5 / 100) * parsedPrice;
  }
  if (paystackFee > 2000) paystackFee = 2000;
  if (isCalculatingCommission) {
    paystackFee *= quantity
  }

  let adminEarning = 0;
  if (isCalculatingCommission) {
  // get commission price from expectedPayout
    adminEarning = (parsedPrice * quantity) - parsedExpected - paystackFee
  } else {
    adminEarning = parsedPrice - paystackFee
  }

  return adminEarning;
}

class WithdrawView extends React.PureComponent {
  componentDidMount () {
    const withdrawalId = this.props.match.params.id;
    if (withdrawalId) {
      this.props.getWithdrawal(withdrawalId);
    }
  }

  render () {
    return <WithdrawViewer {...this.props} />;
  }
}

const mapStateToProps = state => ({
  withdrawal: state.withdraw.withdrawal,
  isLoading: state.withdraw.withdrawalIsLoading,
  isLightMode: state.dashboard.isLightMode,
  user: state.account.user,
});

export default connect(mapStateToProps, actions)(withRouter(WithdrawView));
