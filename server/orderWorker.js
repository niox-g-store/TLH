require('dotenv').config();
const orderQueue = require('./queues/orderQueue');
const mailgun = require('./services/mailgun');
const { generateInvoice } = require('./utils/invoiceService');
const chalk = require('chalk');

orderQueue.process('check-in', async (job, done) => {
    await checkIn(job.data.checkInData);
    done();
});

orderQueue.process('new-order', async (job, done) => {
    const { qrAssigner, newOrder, adminEmails, organizerEmailsAndData } = job.data;
    const invoice = await queueGenerateInvoice(qrAssigner, newOrder);
    await queueSendEmailToUser(newOrder, invoice);
    await queueSendEmailToAdmin(newOrder, adminEmails);
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

const queueSendEmailToUser = async(data, invoice) => {
  await mailgun.sendEmail(data.billingEmail, 'order-confirmation', data, invoice);
}

const queueSendEmailToAdmin = async(data, adminEmails) => {
  // here use a loop as admin users are not expected to be much so no need
  // to create a mailing list to send to multiple admins
  for (const i of adminEmails) {
      await mailgun.sendEmail(i.email, 'admin-order-confirmation', data);
  }
}

const queueSendEmailToOrganizer = async(organizerEmailsAndData) => {
    // also here use a loop to loop through organizers email
    // in a case where multiple events to different organizers exist
    for (const i of organizerEmailsAndData) {
        await mailgun.sendEmail(i.email, 'organizer-order-confirmation', i.newOrder);
    }
}

console.log(chalk.green.bold('[✔] Order Worker is active and listening for jobs...'));
