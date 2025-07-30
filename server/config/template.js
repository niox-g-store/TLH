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
const { productOrderStatus } = require('./htmlTemplates/User/productOrderStatus');

exports.newsLetterEmail = (campaignData) => {
  const message = {
    subject: campaignData.title,
    text: campaignData.content,
    html: adminCampaignTemplate(
      campaignData.title,
      campaignData.shouldEmailContainUserName,
      campaignData.content,
      campaignData.imageUrls,
      campaignData.event,
      campaignData.linkName,
      campaignData.linkUrl
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
      campaignData.event,
      campaignData.linkName,
      campaignData.linkUrl
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

exports.otpVerificationEmail = (user) => {
  const message = {
    subject: 'Verify Your Email - The Link Hangouts',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://thelinkhangout.com/black_logo.png" alt="The Link Hangouts" style="width: 100px; border-radius: 10px;">
        </div>
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for signing up with The Link Hangouts! To complete your registration, please use the verification code below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8f9fa; border: 2px dashed #9172EC; padding: 20px; border-radius: 10px; display: inline-block;">
            <h1 style="color: #9172EC; margin: 0; font-size: 32px; letter-spacing: 5px;">${user.otpCode}</h1>
          </div>
        </div>
        <p>This code will expire in 10 minutes for security reasons.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>Best regards,<br>The Link Hangouts Team</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} The Link Hangouts. All rights reserved.
        </p>
      </div>
    `,
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
    subject: `New Transfer Recipient Created: ${data.companyName}`,
    html: `
      <p>Dear Administrator,</p>
      <p>A new transfer recipient has been successfully created on The Link Hangouts platform.</p>
      <p><strong>Recipient Details:</strong></p>
      <ul>
        <li><strong>Company:</strong> ${data.companyName}</li>
        <li><strong>Account Name:</strong> ${data.bankAccountName}</li>
        <li><strong>Account Number:</strong> ${data.bankAccountNumber}</li>
        <li><strong>Bank:</strong> ${data.bankName}</li>
      </ul>
      <p>You can review the associated organizer's details and manage this recipient by clicking the link below:</p>
      <p><a href="${DASHBOARD_URL.organizer}/${data._id}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #9172EC; border-radius: 5px; text-decoration: none;">View Organizer Profile</a></p>
      <p>Thank you</p>
    `
  };
  return message;
}

exports.notifyAdminWithdrawalEmail = (data) => {
  const message = {
    subject: `New Withdrawal Request from ${data.organizer.companyName}`,
    html: `
      <p>Dear Administrator,</p>
      <p>A new withdrawal request has been initiated by <strong>${data.organizer.companyName}</strong>.</p>
      <p><strong>Withdrawal Details:</strong></p>
      <ul>
        <li><strong>Amount:</strong>₦${data.order.expectedPayout.toLocaleString()}</li>
      </ul>
      <p>You can review and process this request by clicking the link below:</p>
      <p><a href="${DASHBOARD_URL.withdrawal}/${data.withdraw._id}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #9172EC; border-radius: 5px; text-decoration: none;">Review Withdrawal Request</a></p>
      <p>Thank you</p>
    `
  };
  return message;
};

exports.notifyOrganizerWithdrawalSuccessEmail = (data) => {
  const msg = `
  <p>You can review the full withdrawal details by clicking <a href="${DASHBOARD_URL.withdrawal}/${data.withdrawal._id}">here</a>.</p>
  `
  const message = {
    subject: 'Withdrawal Successful from The Link Hangouts',
    html: `
        <p>Dear ${data.organizer.companyName},</p>
        <p>We are pleased to inform you that your withdrawal of <strong>₦${(data.order.totalExpectedPayout).toLocaleString()}</strong> has been successfully processed.</p>
        <p>Thank you for your continued trust in us.</p>
        <p>Sincerely,</p>
        <p>The Link Hangouts Team</p>
    `
};
  return message;
};

exports.notifyOrganizerWithdrawalFailedEmail = () => {
  const msg = `
  <p>Please review the withdrawal details and any associated error messages by clicking <a href="${DASHBOARD_URL.withdrawal}/${data.withdrawal._id}">here</a>. This will help you understand the reason for the failure and take appropriate action.</p>
  `
  const message = {
    subject: 'Withdrawal Failed from The Link Hangouts',
    html: `
        <p>Dear ${data.organizer.companyName},</p>
        <p>We regret to inform you that your recent withdrawal request for <strong>₦${(data.order.totalExpectedPayout).toLocaleString()}</strong> was unsuccessful.</p>
        <p>If you require further assistance, please don't hesitate to contact our support team.</p>
        <p>Sincerely,</p>
        <p>The Link Hangouts Team</p>
    `
};
  return message;
};

exports.productStatusUpdateEmail = (order) => {
  const message = {
    subject: 'Update on your product order',
    html: productOrderStatus(order)
  }
  return message;
}
