const { getCartPriceSummary } = require('./cartSummary');

exports.productInvoiceGenerator = (order) => {
  const user = order.user || order.guest;
  const name = user?.organizer ? user.organizer.companyName : user.name;
  const email = order.billingEmail;
  const orderId = order._id;
  const date = new Date(order.createdAt).toLocaleDateString();
  const productItems = order.cart.items.filter(item => item.type === 'product');

  const calculateTotal = () => {
    return productItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  };

  const total = calculateTotal();

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
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">Entertainment Service & Products.</p>
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
            <div style="width: 40%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold;">Product</p>
            </div>
            <div style="width: 15%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Qty</p>
            </div>
            <div style="width: 20%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Price</p>
            </div>
            <div style="width: 25%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Total</p>
            </div>
          </div>

          ${productItems.map(product => `
            <div style="display: flex; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              <div style="width: 40%; padding: 4px 8px;">
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">${product.productName}</p>
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-size: 12px;">
                  ${product.needsDelivery ? '🚚 Delivery' : '📍 Pickup at event'}
                </p>
              </div>
              <div style="width: 15%; padding: 4px 8px;">
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">${product.quantity}</p>
              </div>
              <div style="width: 20%; padding: 4px 8px;">
                <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">₦${product.finalPrice.toLocaleString()}</p>
              </div>
              <div style="width: 25%; padding: 4px 8px;">
                <p style="padding: 4px 0px 4px 0; margin-bottom: 1px; color: black; font-weight: bold; text-align: right;">
                  ₦${(product.finalPrice * product.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          `).join('')}

          <div style="margin-top: 20px; width: 50%; align-self: end;">
            <div style="display: flex; background-color: black;">
              <div style="width: 100%; padding: 5px;">
                <p style="margin: 0; padding: 8px; font-size: 14px; color: white;">
                  Total
                  <span style="float: right; font-weight: bold; color: white;">
                    ₦${total.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div style="margin-top: 20px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">Thank you for your order!</p>
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">
              ${productItems.some(p => p.needsDelivery) ? 'Items marked for delivery will be shipped to your address.' : ''}
              ${productItems.some(p => !p.needsDelivery) ? 'Items for pickup will be available at our next event.' : ''}
            </p>
          </div>

        </div>
      </div>
    </div>
  `;
};