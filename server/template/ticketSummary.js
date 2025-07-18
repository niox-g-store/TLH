exports.renderTicketBreakdownHTML = (ticket) => {
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
  let lines = '';

  // Original price
  if (discount && discountPrice < price) {
    lines += `
      <div style="display: flex;">
        <div style="width: 100%; padding: 5px;">
          <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
            Original
            <span style="text-decoration: line-through; float: right; font-weight: bold; color: red">${Naira}${price.toLocaleString()}</span>
            </span>
          </p>
        </div>
      </div>
    `;
    total = discountPrice;
  } else {
    lines += `
      <div style="display: flex;">
        <div style="width: 100%; padding: 5px;">
          <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
            Price
            <span style="float: right; font-weight: bold; color: black;">
              ${Naira}${price.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    `;
  }

  // Discount line
  if (discount && discountAmount > 0) {
    lines += `
      <div style="display: flex;">
        <div style="width: 100%; padding: 5px;">
          <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
            Discount
            <span style="float: right; font-weight: bold; color: black;">
              -${Naira}${discountAmount.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    `;
  }

  // Coupon line
  if (coupon) {
    if (couponPercentage > 0) {
      lines += `
        <div style="display: flex;">
          <div style="width: 100%; padding: 5px;">
            <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
              Coupon (${couponPercentage}% OFF)
              <span style="float: right; font-weight: bold; color: black;">
                -${Naira}${couponDiscount.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      `;
      total -= couponDiscount;
    } else if (couponAmount > 0) {
      lines += `
        <div style="display: flex;">
          <div style="width: 100%; padding: 5px;">
            <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
              Coupon
              <span style="float: right; font-weight: bold; color: black;">
                -${Naira}${couponAmount.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      `;
      total -= couponAmount;
    }
  }

  if (total < 0) total = 0;

  // Final total
  lines += `
    <div style="display: flex; background-color: black;">
      <div style="width: 100%; padding: 5px;">
        <p style="margin: 0; padding: 8px; font-size: 14px; color: white;">
          Total
          <span style="float: right; font-weight: bold; color: white;">
            ${Naira}${total.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  `;

  return `<div>${lines}</div>`;
};
