const convertQRToBase64 = (qrBinary) => {
  if (!qrBinary) return null;

  const buffer = Buffer.isBuffer(qrBinary)
    ? qrBinary
    : Buffer.from(qrBinary.data || []);

  const base64String = buffer.toString('base64');
  return `data:image/png;base64,${base64String}`;
}

exports.invoiceGenerator = (data) => {
  const user = data.ownedBy;
  const name = user?.organizer ? user.organizer.companyName : user.name;
  const email = user.email;
  const price = data?.price?.toLocaleString();
  const eventName = data?.eventName;
  const ticketType = data?.ticketType;
  const orderId = data?.order;
  const qrCode = convertQRToBase64(data?.bytes);
  const code = data?.code;
  const date = new Date(data?.createdAt).toLocaleDateString();

  const discountPrice = data?.discountPrice?.toLocaleString();
  const hasCoupon = data.couponDiscount !== 0;
  const hasDiscount = data.discount;

  let couponPercentage = null;
  let couponAmount = null;
  let discountAmount = null;
  let cA = null;

  if (hasCoupon) {
    if (data?.couponPercentage > 0) {
      couponPercentage = data?.couponPercentage;
      couponAmount = (data?.price - (data?.price * (couponPercentage / 100))).toLocaleString();
    }
    if (data.couponAmount > 0) {
      couponAmount = (data?.price - data?.couponAmount).toLocaleString();
      cA = (data?.couponAmount).toLocaleString()
    }
  }

  if (hasDiscount && !hasCoupon) {
    discountAmount = (data?.discountAmount).toLocaleString();
  }

return `
  <div id="root" style="font-family: sans-serif; color: #fff; background-color: white; padding: 20px;">
    <div class="app">
      <div style="display: flex; flex-direction: column;" class="page invoice-wrapper">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 50%;">
            <div>
              <div style="margin-bottom: 5px" class="logo">
                <img style="max-width: 113px; border-radius: 10px;" src="https://thelinkhangout.com/black_logo.png" alt="logo"/>
              </div>
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">THE LINK HANGOUTS</p>
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">Entertainment Service.</p>
            </div>
          </div>
          <div style="width: 50%; text-align: right;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-size: 45px; font-weight: bold;">RECEIPT</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <div style="width: 55%;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">Billed To:</p>
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">${name}</p>
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">${email}</p>
          </div>
          <div style="width: 45%;">
            <div style="display: flex; margin-bottom: 5px;">
              <div style="width: 40%;">
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">Order#</p>
              </div>
              <div style="width: 60%;">
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">${orderId}</p>
              </div>
            </div>
            <div style="display: flex; margin-bottom: 5px;">
              <div style="width: 40%;">
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">Invoice Date</p>
              </div>
              <div style="width: 60%;">
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">${date}</p>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; background: black; margin-top: 30px; padding: 10px 0;">
          <div style="width: 46%; padding: 0 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold;">Event</p>
          </div>
          <div style="width: 12%; padding: 0 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Ticket</p>
          </div>
          <div style="width: 12%; padding: 0 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Qty</p>
          </div>
          <div style="width: 12%; padding: 0 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Sub Total</p>
          </div>
          <div style="width: 18%; padding: 0 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Total</p>
          </div>
        </div>

        <div style="display: flex; align-items: center; padding-bottom: 10px;">
          <div style="width: 46%; padding: 4px 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">${eventName}</p>
          </div>
          <div style="width: 12%; padding: 4px 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">${ticketType}</p>
          </div>
          <div style="width: 12%; padding: 4px 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">1</p>
          </div>
          <div style="width: 12%; padding: 4px 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">${price}</p>
          </div>
          <div style="width: 18%; padding: 4px 8px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold; text-align: right;">
              ${hasDiscount && !hasCoupon ? discountPrice : hasCoupon ? couponAmount : price}
            </p>
          </div>
        </div>


        <div style="margin-top: 10px; width: 50%;"></div>
        
        <div style="margin-top: 20px; width: 50%; align-self: end;">
            <div style="display: flex;">
                <div style="width: 50%; padding: 5px;">
                    <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">Sub Total</p>
                </div>
                <div style="width: 50%; padding: 5px;">
                    <span style="float: right; font-weight: bold; color: black">${price}</span>
                </div>
            </div>

            ${hasDiscount && !hasCoupon ?
            `<div style="display: flex;">
                <div style="width: 50%; padding: 5px;">
                    <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">Discount</p>
                </div>
                <div style="width: 50%; padding: 5px;">
                    <span style="float: right; font-weight: bold; color: red">-₦${discountAmount}</span>
                </div>
            </div>`
            :
            ''}

            ${hasCoupon ?
            `<div style="display: flex;">
                <div style="width: 50%; padding: 5px;">
                    <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">Coupon</p>
                </div>
                <div style="width: 50%; padding: 5px;">
                    <span style="float: right; font-weight: bold; color: red">${couponPercentage ? `${couponPercentage}% OFF` : `-₦${cA}`}</span>
                </div>
            </div>`
            :
            ''}

            <div style="display: flex; background-color: black; padding: 5px;">
                <div style="width: 50%; padding: 5px;">
                    <p style="margin: 0; padding: 8px; font-size: 14px; font-weight: bold; color: white">TOTAL</p>
                </div>
                <div style="width: 50%; padding: 5px; display: flex; align-items: center; justify-content: flex-end;">
                    <p style="margin: 0; padding: 8px; font-size: 14px; font-weight: bold; color: #333; margin-right: 10px;"></p>
                    <span style="font-weight: bold; color: white">₦ ${hasDiscount && !hasCoupon ? discountPrice : hasCoupon ? couponAmount : price}</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 20px;">
          <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">Thank you for your order</p>
        </div>

        <div style="margin-top: 20px;">
          <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">Scan the Qr code below at the event</p>
          <div style="width: 100%; height: 48px; color: #fff; border: none; border-radius: 4px; padding: 10px; font-size: 14px;">
            <img src="${qrCode}" alt="qr" style="height: 120px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">${code}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
`;
};
