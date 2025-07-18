const { getCartPriceSummary } = require('./cartSummary');
const { renderTicketBreakdownHTML } = require('./ticketSummary');

const convertQRToBase64 = (qrBinary) => {
  if (!qrBinary) return null;

  const buffer = Buffer.isBuffer(qrBinary)
    ? qrBinary
    : Buffer.from(qrBinary.data || []);

  const base64String = buffer.toString('base64');
  return `data:image/png;base64,${base64String}`;
};

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

  const { subTotal, total } = getCartPriceSummary(data);
  const breakdownHTML = renderTicketBreakdownHTML(data);

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
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Price</p>
            </div>
            <div style="width: 18%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Paid</p>
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
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">₦${subTotal.toLocaleString()}</p>
            </div>
            <div style="width: 18%; padding: 4px 8px;">
              <p style="padding: 4px 0px 4px 0; margin-bottom: 1px; color: black; font-weight: bold; text-align: right;">
                ₦${total.toLocaleString()}
              </p>
            </div>
          </div>

          <div style="margin-top: 20px; width: 50%; align-self: end;">
            ${breakdownHTML}
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
