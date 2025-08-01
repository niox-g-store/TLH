require('dotenv').config();
const orderQueue = require('./queues/orderQueue');
const withdrawalQueue = require('./queues/withdrawalQueue');
const mailgun = require('./services/mailgun');
const { generateInvoice } = require('./utils/invoiceService');
const chalk = require('chalk');

orderQueue.process('check-in', async (job, done) => {
    await checkIn(job.data.checkInData);
    done();
});

orderQueue.process('send-admin-email', async (job, done) => {
  const { adminEmails, organizer, newTransferUserAdded, order, withdraw } = job.data
  if (newTransferUserAdded) {
    await newTransferUser(adminEmails, organizer);
  } else {
    await adminOrgWithdrawal(adminEmails, organizer, order, withdraw)
  }
  done();
})

orderQueue.process('new-order', async (job, done) => {
    const { qrAssigner, newOrder, adminEmails, organizerEmailsAndData, isProductOrder } = job.data;
    
    let invoice = null;
    if (isProductOrder) {
      invoice = await queueGenerateProductInvoice(newOrder);
      await queueSendEmailToUser(newOrder, invoice, isProductOrder);
    }
    if (qrAssigner && qrAssigner.length > 0) {
      invoice = await queueGenerateInvoice(qrAssigner, newOrder);
      await queueSendEmailToUser(newOrder, invoice, false);
    }
    
    await queueSendEmailToAdmin(newOrder, adminEmails, isProductOrder);
    if (organizerEmailsAndData.length > 0) {
        await queueSendEmailToOrganizer(organizerEmailsAndData);
    }
    done();
});

const checkIn = async(checkInData) => {
  await mailgun.sendEmail(checkInData.email, 'ticket-check-in', checkInData);
}

const queueGenerateInvoice = async(qrAssigner, updateOrder) => {
  const invoice = [];
  for (let item = 0; item < qrAssigner.length; item++) {
    const invoiceGenerator = await generateInvoice(qrAssigner[item]);
    invoice.push({
      filename: `${updateOrder._id}_${item}`,
        data: invoiceGenerator,
        contentType: 'application/pdf'
    });
  }
  return invoice;
}
const queueGenerateProductInvoice = async(updateOrder) => {
  const invoice = [];
  for (let item = 0;  item < updateOrder.cart.products.length; item++) {
    const invoiceGenerator = await generateInvoice(updateOrder, true, updateOrder.cart.products[item]);
    invoice.push({
      filename: `${updateOrder._id}_product_invoice${item}`,
      data: invoiceGenerator,
      contentType: 'application/pdf'
    });
  }
  return invoice;
}

const queueSendEmailToUser = async(data, invoice, isProductOrder = false) => {
  const emailType = isProductOrder ? 'product-order-confirmation' : 'order-confirmation';
  await mailgun.sendEmail(data.billingEmail, emailType, data, invoice);
}

const queueSendEmailToAdmin = async(data, adminEmails, isProductOrder = false) => {
  const emailType = 'admin-order-confirmation';
  // here use a loop as admin users are not expected to be much so no need
  // to create a mailing list to send to multiple admins
  for (const i of adminEmails) {
    //if (i.email !== 'testadmin@gmail.com') { used this in dev mode
      await mailgun.sendEmail(i.email, emailType, data);
    //}
  }
}

const queueSendEmailToOrganizer = async(organizerEmailsAndData) => {
    // also here use a loop to loop through organizers email
    // in a case where multiple events to different organizers exist
    for (const i of organizerEmailsAndData) {
        await mailgun.sendEmail(i.email, 'organizer-order-confirmation', i.newOrder);
    }
}

const newTransferUser = async (adminEmails, organizer) => {
  for (const i of adminEmails) {
    await mailgun.sendEmail(i.email, 'admin-new-transfer-user-added', organizer)
  }
}

const adminOrgWithdrawal = async (adminEmails, organizer, order, withdraw) => {
  for (const i of adminEmails) {
    await mailgun.sendEmail(i.email, 'admin-organizer-withdraw-notification', { organizer, order, withdraw })
  }
}

console.log(chalk.green.bold('[✔] Order Workers are active and listening for jobs...'));
