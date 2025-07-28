exports.productInvoiceGenerator = (order, product) => {
  const name = order?.name;
  const email = order?.billingEmail;
  const orderId = order?._id;
  const date = new Date(order.createdAt).toLocaleDateString();
  const Naira = "₦";

  // Determine delivery information and fee more robustly
  const deliveryInfo = product.needsDelivery ? product.deliveryInfo : null;
  const actualDeliveryFee = deliveryInfo?.address?.deliveryFee || 0; // Default to 0 if not defined or if no delivery
  
  // Calculate total: product finalPrice + actualDeliveryFee if delivery is needed
  const total = ((product.finalPrice * product.quantity) + (product.needsDelivery ? actualDeliveryFee : 0));

  // Format deliveryFee using actualDeliveryFee
  const formattedDeliveryFee = `${Naira}${actualDeliveryFee.toLocaleString()}`;

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
              <p style="padding: 0px 12px 0px 0; margin-bottom: 1px; color: black;">${name}</p>
              <p style="padding: 0px 12px 0px 0; margin-bottom: 1px; color: black;">${email}</p>
              ${product.needsDelivery ? `
              <p style="padding: 0px 12px 0px 0; margin-bottom: 1px; color: black;">${deliveryInfo.phoneNumber}</p>
              <p style="padding: 0px 12px 0px 0; margin-bottom: 1px; color: black;">${deliveryInfo.address.street || ''} ${deliveryInfo.address.city || ''} ${deliveryInfo.address.state}</p>
              <p style="padding: 0px 12px 0px 0; margin-bottom: 1px; color: black;">${deliveryInfo.address.island ? 'Island' : 'Mainland'} Delivery</p>
              ` : ' <p style="padding: 0px 12px 0px 0; margin-bottom: 1px; color: black;">Pickup at event</p>'}
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
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold;">Product</p>
            </div>
            <div style="width: 12%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Qty</p>
            </div>
            <div style="width: 12%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Price</p>
            </div>
            <div style="width: 12%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Delivery Fee</p>
            </div>
            <div style="width: 12%; padding: 0 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: white; font-weight: bold; text-align: right;">Paid</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; padding-bottom: 10px;">
            <div style="width: 46%; padding: 4px 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">${product.productName}</p>
              ${product.selectedSize ? `<p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-size: 12px;">Size: ${product.selectedSize}</p>` : ''}
              ${product.selectedColor ? `<p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-size: 12px;">Color: ${product.selectedColor}</p>` : ''}
            </div>
            <div style="width: 12%; padding: 4px 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">${product.quantity}</p>
            </div>
            <div style="width: 12%; padding: 4px 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">${(product.price).toLocaleString()}</p>
            </div>
            <div style="width: 12%; padding: 4px 8px;">
              <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; text-align: right;">${product.needsDelivery ? formattedDeliveryFee : '₦0'}</p>
            </div>
            <div style="width: 12%; padding: 4px 8px;">
              <p style="padding: 4px 0px 4px 0; margin-bottom: 1px; color: black; font-weight: bold; text-align: right;">
                ${Naira}${(total).toLocaleString()}
              </p>
            </div>
          </div>

          <div style="margin-top: 20px; width: 50%; align-self: end;">
            ${product.discount ?
              `
              <div style="display: flex;">
                <div style="width: 100%; padding: 5px;">
                <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
                    Original
                    <span style="text-decoration: line-through; float: right; font-weight: bold; color: red">${Naira}${(product.price).toLocaleString()}</span>
                    </span>
                  </p>
                </div>
              </div>
              <div style="display: flex;">
                <div style="width: 100%; padding: 5px;">
                  <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
                    Discount
                    <span style="float: right; font-weight: bold; color: black;">
                    -${Naira}${(product.price - product.discountPrice).toLocaleString()} x ${product.quantity}
                    </span>
                  </p>
                </div>
              </div>

              <div style="display: flex;">
                <div style="width: 100%; padding: 5px;">
                  <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
                    Discount price
                    <span style="float: right; font-weight: bold; color: black;">
                    ${Naira}${(product.discountPrice).toLocaleString()} x ${product.quantity}
                    </span>
                  </p>
                </div>
              </div>

              <div style="display: flex;">
                <div style="width: 100%; padding: 5px;">
                  <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
                    Delivery fee
                    <span style="float: right; font-weight: bold; color: black;">
                    ${product.needsDelivery ? formattedDeliveryFee : '₦0'}
                    </span>
                  </p>
                </div>
              </div>

              <div style="display: flex; background-color: black;">
              <div style="width: 100%; padding: 5px;">
                <p style="margin: 0; padding: 8px; font-size: 14px; color: white;">
                  Total
                  <span style="float: right; font-weight: bold; color: white;">
                    ${Naira}${(total).toLocaleString()}
                  </span>
                </p>
              </div>
              </div>
              `
            : // No discount
              `<div style="display: flex;">
                <div style="width: 100%; padding: 5px;">
                  <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
                    Price
                    <span style="float: right; font-weight: bold; color: black;">
                      ${Naira}${(product.price).toLocaleString()} x ${product.quantity}
                    </span>
                  </p>
                </div>
              </div>

              <div style="display: flex;">
                <div style="width: 100%; padding: 5px;">
                  <p style="margin: 0; padding: 8px; font-size: 14px; color: black;">
                    Delivery fee
                    <span style="float: right; font-weight: bold; color: black;">
                    ${product.needsDelivery ? formattedDeliveryFee : '₦0'}
                    </span>
                  </p>
                </div>
              </div>

              <div style="display: flex; background-color: black;">
                <div style="width: 100%; padding: 5px;">
                  <p style="margin: 0; padding: 8px; font-size: 14px; color: white;">
                    Total
                    <span style="float: right; font-weight: bold; color: white;">
                      ${Naira}${(total).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>    
              `
            }
          </div>

          <div style="margin-top: 20px;">
            <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black; font-weight: bold;">Thank you for your order</p>
          </div>
          <p style="padding: 4px 12px 4px 0; margin-bottom: 1px; color: black;">${product.needsDelivery ? 'Items marked for delivery will be shipped to your address.' : 'Items for pickup will be available at our next event.'}</p>
        </div>
      </div>
    </div>

  `;
};