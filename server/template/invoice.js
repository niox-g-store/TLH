exports.invoiceGenerator = (data) => {
  return `
    <div id="root" style="font-family: sans-serif; color: #fff; background-color: #1e1e1e; padding: 20px;">
      <div class="app">
        <div class="page invoice-wrapper">
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 50%;">
              <div>
                <input type="text" style="font-size: 20px; font-weight: bold; background: transparent; border: none; color: #fff;" placeholder="Your Company" value="THE LINK HANGOUTS">
                <input type="text" style="background: transparent; border: none; color: #fff;" placeholder="Your Name" value="Entertainment Service.">
              </div>
            </div>
            <div style="width: 50%; text-align: right;">
              <input type="text" style="font-size: 45px; font-weight: bold; background: transparent; border: none; color: #fff;" placeholder="Invoice" value="RECEIPT">
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 40px;">
            <div style="width: 55%;">
              <input type="text" style="font-weight: bold; background: transparent; border: none; color: #fff; margin-bottom: 5px;" placeholder="" value="Billed To:">
              <input type="text" style="background: transparent; border: none; color: #fff;" placeholder="Your Client's Name" value="test user">
              <input type="text" style="background: transparent; border: none; color: #fff;" placeholder="Client's Address" value="testuser@gmail.com">
            </div>
            <div style="width: 45%;">
              <div style="display: flex; margin-bottom: 5px;">
                <div style="width: 40%;">
                  <input type="text" style="font-weight: bold; background: transparent; border: none; color: #fff;" placeholder="" value="Order#">
                </div>
                <div style="width: 60%;">
                  <input type="text" style="background: transparent; border: none; color: #fff;" placeholder="INV-12" value="123456789">
                </div>
              </div>
              <div style="display: flex; margin-bottom: 5px;">
                <div style="width: 40%;">
                  <input type="text" style="font-weight: bold; background: transparent; border: none; color: #fff;" placeholder="" value="Invoice Date">
                </div>
                <div style="width: 60%;">
                  <input type="text" style="background: transparent; border: none; color: #fff;" value="Jul 13, 2025">
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; background-color: #2b2b2b; margin-top: 30px; padding: 10px 0;">
            <div style="width: 48%; padding: 0 8px;"><input type="text" style="background: transparent; border: none; color: #fff; font-weight: bold; width: 100%;" value="Event - Ticket"></div>
            <div style="width: 17%; padding: 0 8px;"><input type="text" style="background: transparent; border: none; color: #fff; font-weight: bold; text-align: right; width: 100%;" value="Qty"></div>
            <div style="width: 17%; padding: 0 8px;"><input type="text" style="background: transparent; border: none; color: #fff; font-weight: bold; text-align: right; width: 100%;" value="Sub Total"></div>
            <div style="width: 18%; padding: 0 8px;"><input type="text" style="background: transparent; border: none; color: #fff; font-weight: bold; text-align: right; width: 100%;" value="Total"></div>
          </div>

          <div style="display: flex; align-items: center; padding-bottom: 10px;">
            <div style="width: 48%; padding: 4px 8px;">
              <textarea style="width: 100%; height: 48px; background-color: #2b2b2b; color: #fff; border: none; border-radius: 4px; padding: 10px; font-size: 14px;">Beach party - Early bird</textarea>
            </div>
            <div style="width: 17%; padding: 4px 8px;"><input type="text" value="1" style="width: 100%; padding: 10px; background-color: #2b2b2b; color: #fff; border: none; border-radius: 4px; text-align: right;"></div>
            <div style="width: 17%; padding: 4px 8px;"><input type="text" value="12000.00" style="width: 100%; padding: 10px; background-color: #2b2b2b; color: #fff; border: none; border-radius: 4px; text-align: right;"></div>
            <div style="width: 18%; padding: 4px 8px;"><span style="display: block; background-color: #2b2b2b; color: #fff; padding: 10px; border-radius: 4px; text-align: right;">12000.00</span></div>
            <button style="background: transparent; border: none; margin-left: 8px; cursor: pointer;"><span style="display: inline-block; width: 20px; height: 20px; background-color: red; border-radius: 50%; color: #fff; font-weight: bold; text-align: center; line-height: 20px;">×</span></button>
          </div>

          <div style="display: flex; justify-content: space-between;">
            <div style="width: 50%; margin-top: 10px;"><button style="background: none; border: none; color: #00ff00; cursor: pointer;">➕ Add Line Item</button></div>
            <div style="width: 50%; margin-top: 20px;">
              <div style="display: flex; padding: 5px 0;">
                <div style="width: 50%; padding: 0 5px;"><input type="text" style="width: 100%; background: transparent; border: none; color: #fff;" value="Sub Total"></div>
                <div style="width: 50%; padding: 0 5px;"><span style="float: right; font-weight: bold; color: #fff;">12000.00</span></div>
              </div>
              <div style="display: flex; padding: 5px 0;">
                <div style="width: 50%; padding: 0 5px;"><input type="text" style="width: 100%; background: transparent; border: none; color: #fff;" value="Sale Tax (10%)"></div>
                <div style="width: 50%; padding: 0 5px;"><span style="float: right; font-weight: bold; color: #fff;">1200.00</span></div>
              </div>
              <div style="display: flex; background-color: #444; padding: 5px;">
                <div style="width: 50%; padding: 0 5px;"><input type="text" style="width: 100%; font-weight: bold; background: transparent; border: none; color: #fff;" value="TOTAL"></div>
                <div style="width: 50%; padding: 0 5px; display: flex; align-items: center; justify-content: flex-end;">
                  <input type="text" style="width: 20px; background-color: #2b2b2b; color: #fff; font-weight: bold; text-align: right; border: none; margin-right: 10px;" value="$">
                  <span style="font-weight: bold; color: #fff;">13200.00</span>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top: 20px;"><input type="text" style="width: 100%; font-weight: bold; background: transparent; border: none; color: #fff;" value="Thank you for your order"></div>
          <div style="margin-top: 20px;">
            <input type="text" style="width: 100%; font-weight: bold; background: transparent; border: none; color: #fff;" value="Scan your ticket below at the event">
            <textarea style="width: 100%; height: 48px; background-color: #2b2b2b; color: #fff; border: none; border-radius: 4px; padding: 10px; font-size: 14px;"></textarea>
          </div>

        </div>
      </div>
    </div>
  `;
};
