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
/*exports.newsLetterEmail = (campaignData) => {
  const message = {
    subject: campaignData.heading,
    text: campaignData.heading,
    html: campaignTemplate(campaignData),
    headers: { 'Content-Type': 'text/html' },
  }
  return message
}*/

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

exports.notifyAdminWithdrawalEmail = () => {
  const message = {
    subject: 'Contact Us',
    text: `We received your message! Our team will contact you soon. \n\n`
  };

  return message;
};

exports.notifyOrganizerWithdrawalSuccessEmail = () => {
  const message = {
    subject: 'Contact Us',
    text: `We received your message! Our team will contact you soon. \n\n`
  };

  return message;
};