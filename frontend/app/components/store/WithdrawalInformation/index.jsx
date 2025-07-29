import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardText,
  CBadge,
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import AssetDistribution from '../AssetDistribution';

const WithdrawalInformation = ({ withdrawal, isLightMode }) => {

    return (
        <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-column`}>
            <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold">{withdrawal?.organizer?.companyName}</h5>
                </div>
                <CCardText as="div" style={{ display: 'grid', gap: '0.5em 1em', fontSize: '16px' }}>
                    <AssetDistribution
                      isLightMode={isLightMode}
                      earnings={withdrawal?.earnings}
                      canWithdrawAmount={withdrawal?.canWithdrawAmount}
                    />
                    <p style={{ marginBottom: '0.5em' }}><strong>Bank:</strong> {withdrawal?.organizer?.bankName || 'Not set in profile'}</p>
                    <p style={{ marginBottom: '0.5em' }}><strong>Account Name:</strong> {withdrawal?.organizer?.bankAccountName || 'Not set in profile'}</p>
                    <p style={{ marginBottom: '0.5em' }}><strong>Account Number:</strong> {withdrawal?.organizer?.bankAccountNumber || 'Not set in profile'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1em' }}>
                        <Link to={`/dashboard/withdrawals/organizer/${withdrawal?.organizer?._id}`}>
                          <Button style={{ fontSize: '13px', padding: '10px' }} text="View Organizer withdrawals"/>
                        </Link>
                        <Link to={`/dashboard/organizer/${withdrawal?.organizer?.organizer}`}>
                          <Button style={{ fontSize: '13px', padding: '10px' }} text="View Organizer details"/>
                        </Link>
                    </div>
                </CCardText>
            </CCardBody>
        </CCard>
    )
}

export default WithdrawalInformation;