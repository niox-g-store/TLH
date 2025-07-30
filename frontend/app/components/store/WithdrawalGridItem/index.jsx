import React, { useEffect, useState } from "react";
import formatCountdown from "../CountDown";
import { Link, useNavigate } from "react-router-dom";
import {
  CRow,
  CCol,
  CBadge,
  CCard
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import { ROLES } from "../../../constants";


const WithdrawalGridItem = ({ user, currentWithdrawals, isLightMode, initialiseWithdrawal }) => {
  const navigate = useNavigate();
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      currentWithdrawals.forEach(w => {
        if (w.canWithdrawDate) {
          newCountdowns[w._id] = formatCountdown(w.canWithdrawDate);
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentWithdrawals]);

  return (
    <div className="overflow-auto">
      <table className={`w-full table-auto text-sm w-100 ${isLightMode ? 'text-black' : 'text-white'}`}>
        <thead className={`${isLightMode ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <tr>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Ticket Qty</th>
            <th className="px-4 py-2 text-left">Available In</th>
            <th className="px-4 py-2 text-left">Processed At</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentWithdrawals.map((withdrawal) => (
            <tr key={withdrawal._id} className={`${isLightMode ? 'bg-white' : 'bg-gray-900'} border-b`}>
              <td className="px-4 py-2 font-semibold">₦{withdrawal.amount?.toLocaleString()}</td>
              <td className="px-4 py-2">
                <CBadge color={
                  withdrawal.status === 'completed' ? 'success' :
                  withdrawal.status === 'pending' ? 'warning' :
                  withdrawal.status === 'failed' ? 'danger' : 'secondary'
                }>
                  {withdrawal.status}
                </CBadge>
              </td>
              <td className="px-4 py-2 truncate">{withdrawal.order._id}</td>
              <td className="px-4 py-2">{withdrawal.ticketQuantity}</td>
              <td className="px-4 py-2">{countdowns[withdrawal._id] || 'Now'}</td>
              <td className="px-4 py-2">{withdrawal.processedAt ? formatDate(withdrawal.processedAt) : 'Not processed'}</td>
              {withdrawal?.status !== 'completed' ?
              <td className="px-4 py-2 space-x-2 d-flex gap-2">
                {withdrawal.canWithdraw === true &&
                <Button
                  style={{ padding: '8px', width: 'max-content' }}
                  onClick={() => initialiseWithdrawal(withdrawal._id,
                                                      withdrawal.order._id,
                                                      navigate, withdrawal?.user?.organizer
                                                    )}
                  text="Withdraw"
                />
                }
                {user?.role === ROLES.Admin &&
                <Link to={`/dashboard/withdrawal/${withdrawal._id}`}>
                  <Button
                    style={{ padding: '8px', width: 'max-content' }}
                    text="see details"
                  />
                </Link>
                }

                <Link to={`/dashboard/order/${withdrawal.order._id}`}>
                  <Button
                    style={{ padding: '8px', width: 'max-content' }}
                    text="View Order"
                  />
                  </Link>
              </td>
              :
              <td>No action needed</td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalGridItem;
