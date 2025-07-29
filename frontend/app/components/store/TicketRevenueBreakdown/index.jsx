import React from 'react';
import Row from '../../Common/Row';

const TicketRevenueBreakdown = ({ price = 0, commissionPercent = 0, showRevenue = true, isLightMode = true }) => {
  const parsedPrice = parseFloat(price) || 0;

  const commission = (commissionPercent / 100) * parsedPrice;

  let paystackFee = 0;
  if (price > 2500) {
    paystackFee = (1.5 / 100) * parsedPrice + 100;
  } else {
    paystackFee = (1.5 / 100) * parsedPrice;
  }
  if (paystackFee > 2000) paystackFee = 2000;

  const revenue = parsedPrice - commission - paystackFee;

  const formatCurrency = (value) => {
    return value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Row>
    <div style={{ background: `${isLightMode ? '#f9f9f9' : '#000000'}`, padding: '1rem', borderRadius: '10px', width: 'fit-content' }}>
      {showRevenue && <h4>Revenue Breakdown</h4>}
      <p>Your ticket price: <strong>₦{formatCurrency(parsedPrice)}</strong></p>
      <p>Our commission ({commissionPercent}%): <strong>₦{formatCurrency(commission)}</strong></p>
      <p>₦100 fee waived for transactions under ₦2,500<br/>
        Paystack fee (1.5% + ₦100, capped at ₦2,000): <strong>₦{formatCurrency(paystackFee)}</strong></p>
      <p><strong>Your expected revenue:</strong> ₦{formatCurrency(revenue)}</p>
    </div>
    </Row>
  );
};

export default TicketRevenueBreakdown;
