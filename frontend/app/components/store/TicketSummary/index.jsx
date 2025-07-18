import React from 'react';

export function renderTicketBreakdown(ticket, isLightMode = true) {
  const Naira = "₦";

  const {
    price,
    discount,
    discountAmount,
    discountPrice,
    coupon,
    couponAmount = 0,
    couponPercentage = 0,
    couponDiscount = 0,
  } = ticket;

  let total = price;
  const lines = [];
  let keyIndex = 0;

  const colorClass = isLightMode ? 'p-black' : 'p-white';

  // Original price (show strikethrough if discounted)
  if (discount && discountPrice < price) {
    lines.push(
      <p
        key={`original-${keyIndex++}`}
        className={`mb-1 text-muted ${colorClass}`}
        style={{ textDecoration: 'line-through' }}
      >
        Original: {Naira}{price.toLocaleString()}
      </p>
    );
    total = discountPrice;
  } else {
    lines.push(
      <p key={`price-${keyIndex++}`} className={`mb-1 ${colorClass}`}>
        Price: {Naira}{price.toLocaleString()}
      </p>
    );
  }

  // Discount line
  if (discount && discountAmount > 0) {
    lines.push(
      <p key={`discount-${keyIndex++}`} className={`mb-1 text-danger ${colorClass}`}>
        Discount: -{Naira}{discountAmount.toLocaleString()}
      </p>
    );
  }

  // Coupon line
  if (coupon) {
    if (couponPercentage > 0) {
      lines.push(
        <p key={`coupon-percent-${keyIndex++}`} className={`mb-1 p-purple ${colorClass}`}>
          Coupon: {couponPercentage}% OFF (-{Naira}{couponDiscount.toLocaleString()})
        </p>
      );
      total -= couponDiscount;
    } else if (couponAmount > 0) {
      lines.push(
        <p key={`coupon-amount-${keyIndex++}`} className={`mb-1 p-purple ${colorClass}`}>
          Coupon: -{Naira}{couponAmount.toLocaleString()}
        </p>
      );
      total -= couponAmount;
    }
  }

  if (total < 0) total = 0;

  lines.push(
    <p key={`total-${keyIndex++}`} className={`mb-0 fw-bold text-success ${colorClass}`}>
      Total: {Naira}{total.toLocaleString()}
    </p>
  );

  return <div>{lines}</div>;
}
