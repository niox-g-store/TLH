import { formatDate } from '../../../utils/formatDate';
import { useNavigate } from 'react-router-dom';
import Button from '../../Common/HtmlTags/Button';
import {
  CCard,
  CCardBody,
  CCardText,
  CBadge,
} from '@coreui/react';

const WithdrawalInformation = ({ withdrawal, isLightMode }) => {
    const navigate = useNavigate();
    return (
        <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-column`}>
            <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold">₦{withdrawal.amount?.toLocaleString()}</h5>
                        <CBadge color={
                            withdrawal.status === 'completed' ? 'success' :
                            withdrawal.status === 'pending' ? 'warning' :
                            withdrawal.status === 'failed' ? 'danger' : 'secondary'
                        }>
                            {withdrawal.status}
                        </CBadge>
                </div>
        <CCardText as="div" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5em 1em', fontSize: '16px' }}>
            <div style={{ marginBottom: '0.5em', display: 'flex', alignItems: 'center' }}><strong>Order ID:</strong> {withdrawal.order._id}
                <Button style={{ padding: '5px', fontSize: '11px', marginLeft: '1em', borderRadius: '5px' }} onClick={() => navigate(`/dashboard/order/${withdrawal.order._id}`) } text="View order details"/>
            </div>
            <p style={{ marginBottom: '0.5em' }}><strong>Bank:</strong> {withdrawal.bankName || 'To be updated after withdrawal'}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>Account Name:</strong> {withdrawal.bankAccountName || 'To be updated after withdrawal'}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>Account Number:</strong> {withdrawal.bankAccountNumber || 'To be updated after withdrawal'}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>Commission:</strong> ₦{withdrawal.commission?.toLocaleString()}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>Ticket Qty:</strong> {withdrawal.ticketQuantity}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>Can Withdraw On:</strong> {formatDate(withdrawal.canWithdrawDate)}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>Processed At:</strong> {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : 'Not processed'}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>User:</strong> {withdrawal.user?.name || withdrawal.user?.companyName || withdrawal.user?.email}</p>
            <p style={{ marginBottom: '0.5em' }}><strong>Event:</strong> {withdrawal.event?.name || 'N/A'}</p>
            <div style={{ gridColumn: '1 / -1', marginTop: '0.5em' }}>
                <Button onClick={() => navigate(`/dashboard/withdrawal/${withdrawal._id}`) } text="Make withdrawal"/>
            </div>
        </CCardText>
        </CCardBody>
        </CCard>
    )
}

export default WithdrawalInformation;