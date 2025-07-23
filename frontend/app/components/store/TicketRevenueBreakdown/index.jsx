import React from 'react';

const TicketRevenueBreakdown = ({ price = 0, commissionPercent = 0 }) => {
  const parsedPrice = parseFloat(price) || 0;

  const commission = (commissionPercent / 100) * parsedPrice;

  let paystackFee = (1.5 / 100) * parsedPrice + 100;
  if (paystackFee > 2000) paystackFee = 2000;

  const revenue = parsedPrice - commission - paystackFee;

  const formatCurrency = (value) => {
    return value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '6px' }}>
      <h4>Revenue Breakdown</h4>
      <p>Your ticket price: <strong>₦{formatCurrency(parsedPrice)}</strong></p>
      <p>Our commission ({commissionPercent}%): <strong>₦{formatCurrency(commission)}</strong></p>
      <p>Paystack fee (1.5% + ₦100, capped at ₦2000): <strong>₦{formatCurrency(paystackFee)}</strong></p>
      <p><strong>Your expected revenue:</strong> ₦{formatCurrency(revenue)}</p>
    </div>
  );
};

export default TicketRevenueBreakdown;
