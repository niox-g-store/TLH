const { organizerSignupHtml } = require('./htmlTemplates/Organizer/signUp');
const { userSignUpHtml } = require('./htmlTemplates/User/signUp');
const { invoiceEmailHtml } = require('./htmlTemplates/User/orderSuccess');
const { adminNewOrderHtml } = require('./htmlTemplates/Admin/orderSuccess');
const { organizerNewOrderHtml } = require('./htmlTemplates/Organizer/orderSuccess');
const { checkedInEmailHtml } = require('./htmlTemplates/User/scanTicket');
const { accountSuspendedEmailHtml } = require('./htmlTemplates/Organizer/suspendAccount');
const { accountResumedEmailHtml } = require('./htmlTemplates/Organizer/resumeAccount');
const { accountBannedEmailHtml } = require('./htmlTemplates/Organizer/banAccount');
const { productOrderEmailHtml } = require('./htmlTemplates/User/productOrderSuccess');
const { adminCampaignTemplate } = require('./htmlTemplates/newsletterTemplate');
const { orgCampaignTemplate } = require('./htmlTemplates/newsletterTemplate');
const { DASHBOARD_URL } = require('../utils/constants');

exports.newsLetterEmail = (campaignData) => {
  const message = {
    subject: campaignData.title,
    text: campaignData.content,
    html: adminCampaignTemplate(
      campaignData.title,
      campaignData.shouldEmailContainUserName,
      campaignData.content,
      campaignData.imageUrls,
      campaignData.event
    ),
    headers: { 'Content-Type': 'text/html' },
  }
  return message
}

exports.orgNewsLetterEmail = (campaignData) => {
  const message = {
    subject: campaignData.title,
    text: campaignData.content,
    html: orgCampaignTemplate(
      campaignData.title,
      campaignData.shouldEmailContainUserName,
      campaignData.content,
      campaignData.imageUrls,
      campaignData.event
    ),
    headers: { 'Content-Type': 'text/html' },
  }
  return message
}

exports.resetEmail = (host, resetToken) => {
  const message = {
    subject: 'Reset Password',
    text:
      `${
        'You are receiving this because you have requested to reset your password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' 
      }${host}/reset-password/${resetToken}\n\n` +
      `This link will expire in 1 hour\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  return message;
};

exports.confirmResetPasswordEmail = () => {
  const message = {
    subject: 'Password Changed',
    text:
      `You are receiving this email because you changed your password. \n\n` +
      `If you did not request this change, please contact us immediately.`
  };

  return message;
};

exports.signinEmail = user => {
  const message = {
    subject: 'Sucessful Sigin ',
    text: `Hi ${user?.companyName ? user.companyName : user.name}! you've successfully signed in! If this wasn't you please let us know`
  };

  return message;
}

exports.signupEmail = user => {
  const message = {
    subject: `Hi ${user.name}! Thank you for creating an account with us!`,
    html: userSignUpHtml(user),
    headers: { 'Content-Type': 'text/html' }
  };

  return message;
};

exports.organizerSignup = organizer => {
  const message = {
    subject: `Hi ${organizer.companyName}! Thank you for creating an account with us!`,
    html: organizerSignupHtml(organizer),
    headers: { 'Content-Type': 'text/html' }
  };

  return message;
};

exports.newsletterSubscriptionEmail = () => {
  const message = {
    subject: 'Newsletter Subscription',
    text:
      `You are receiving this email because you subscribed to our newsletter. \n\n` +
      `If you did not request this change, please contact us immediately.`
  };

  return message;
};

exports.organizerDeactivateAccount = (name, contactEmail) => {
  const message = {
    subject: "Urgent: Your Link Hangouts Organizer Account Has Been Permanently Banned",
    html: accountBannedEmailHtml(name, contactEmail),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
};


exports.organizerSuspendAccount = (name, contactEmail) => {
  const message = {
    subject: "Important: Your Link Hangouts Organizer Account Has Been Suspended",
    html: accountSuspendedEmailHtml(name, contactEmail),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
};

exports.organizerResumeAccount = (name, contactEmail) => {
  const message = {
    subject: "Great News! Your Link Hangouts Organizer Account is Active Again!",
    html: accountResumedEmailHtml(name, contactEmail),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
};

exports.orderConfirmationEmail = order => {
  const message = {
    subject: `Order Confirmation #${order._id}`,
    html: invoiceEmailHtml(order),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
};

exports.adminOrderConfirmationEmail = order => {
  const message = {
    subject: `YOU HAVE A NEW ORDER #${order._id}`,
    text:
      `You Have A New Order \n\n`,
    html: adminNewOrderHtml(order),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
}

exports.organizerOrderConfirmationEmail = order => {
  const message = {
    subject: `YOU HAVE A NEW ORDER #${order._id}`,
    text:
      `You Have A New Order \n\n`,
    html: organizerNewOrderHtml(order),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
}

exports.productOrderConfirmationEmail = order => {
  const message = {
    subject: `Product Order Confirmation #${order._id}`,
    html: productOrderEmailHtml(order),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
};
exports.ticketCheckin = (userName, eventName, ticketCode, scannedAt) => {
  const message = {
    subject: `Your Ticket for ${eventName} Has Been Checked In!`,
    html: checkedInEmailHtml(userName, eventName, ticketCode, scannedAt),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
};

exports.adminNewTransferUser = (data) => {
  const message = {
    subject: 'New Transfer Recipient Created on The Link Hangouts',
    html: `Hi Admin a new transfer recipient has been created\n\n
            company: ${data.companyName}\n
            name: ${data.bankAccountName}\n
            account Number: ${data.bankAccountNumber}\n
            bank: ${data.bankName}\n\n\n
            You can review the organizer details: <a href="${DASHBOARD_URL.organizer}/${data._id}">here</a>
          `
  };

  return message;
}

exports.notifyAdminWithdrawalEmail = (data) => {
  const message = {
    subject: `A new withdrawal from ${data.organizer.companyName}`,
    html: `Hi Admin a new withdrawal from ${data.organizer.companyName} has been initiated. \n\n
            Amount: ${(data.order.totalExpectedPayout).toLocaleString()}\n
            You can review it <a href="${DASHBOARD_URL.withdrawal}/${data.withdraw._id}">here </a>\n
          `
  };
  return message;
};

exports.notifyOrganizerWithdrawalSuccessEmail = (data) => {
  const message = {
    subject: 'Withdrawal Successful from The Link Hangouts',
    html: `
        <p>Dear ${data.organizer.companyName},</p>
        <p>We are pleased to inform you that your withdrawal of <strong>$${(data.order.totalExpectedPayout).toLocaleString()}</strong> has been successfully processed.</p>
        <p>Thank you for your continued trust in us.</p>
        <p>You can review the full withdrawal details by clicking <a href="${DASHBOARD_URL.withdrawal}/${data.withdrawal._id}">here</a>.</p>
        <p>Sincerely,</p>
        <p>The Link Hangouts Team</p>
    `
};
  return message;
};

exports.notifyOrganizerWithdrawalFailedEmail = () => {
  const message = {
    subject: 'Withdrawal Failed from The Link Hangouts',
    html: `
        <p>Dear ${data.organizer.companyName},</p>
        <p>We regret to inform you that your recent withdrawal request for <strong>$${(data.order.totalExpectedPayout).toLocaleString()}</strong> was unsuccessful.</p>
        <p>Please review the withdrawal details and any associated error messages by clicking <a href="${DASHBOARD_URL.withdrawal}/${data.withdrawal._id}">here</a>. This will help you understand the reason for the failure and take appropriate action.</p>
        <p>If you require further assistance, please don't hesitate to contact our support team.</p>
        <p>Sincerely,</p>
        <p>The Link Hangouts Team</p>
    `
};
  return message;
};
