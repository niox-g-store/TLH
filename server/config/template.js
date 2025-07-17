const { orderSuccess } = require("./htmlTemplates/orderSuccess");
const { adminOrderSuccess } = require("./htmlTemplates/adminOrderSuccess");
const { campaignTemplate } = require("./htmlTemplates/newsletterTemplate");
const { orderUpdate } = require("./htmlTemplates/orderUpdate");
const { orderProductsUpdate } = require("./htmlTemplates/orderProductsUpdate");
const { orderShippingInfoUpdate } = require("./htmlTemplates/orderShippingInfoUpdate"); 
const { organizerSignupHtml } = require('./htmlTemplates/organizerSignupHtml');

exports.newsLetterEmail = (campaignData) => {
  const message = {
    subject: campaignData.heading,
    text: campaignData.heading,
    html: campaignTemplate(campaignData),
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
    subject: 'Account Registration',
    text: `Hi ${user.name}! Thank you for creating an account with us!`
  };

  return message;
};

exports.organizerSignup = organizer => {
  const message = {
    subject: 'Organizer Registration',
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

exports.organizerDeactivateAccount = () => {
  const message = {
    subject: 'Your account has been disabled',
    text:
      `Your organizer account has been disabled. \n\n` +
      `Please contact admin to request access again.`
  };

  return message;
};

exports.orderConfirmationEmail = order => {
  const message = {
    subject: `Order Confirmation #${order._id}`,
    text:
    `Hi ${order?.user?.name}! Thank you for your order!. \n\n`,
    html: orderSuccess(order),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
};

exports.adminOrderConfirmationEmail = order => {
  const message = {
    subject: `YOU HAVE A NEW ORDER #${order._id}`,
    text:
      `You Have A New Order \n\n`,
    html: adminOrderSuccess(order),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
}

exports.organizerOrderConfirmationEmail = order => {
  const message = {
    subject: `YOU HAVE A NEW ORDER #${order._id}`,
    text:
      `You Have A New Order \n\n`,
    html: adminOrderSuccess(order),
    headers: { 'Content-Type': 'text/html' },
  };

  return message;
}

exports.ticketCheckin = order => { // here once a ticket is scanned send a notification email
  let msg = null;
  if (order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Shipped') {
    msg = `has been ${order.status}`
  } else if (order.status === 'Processing') {
    msg = `has been confirmed`
  } else {
    msg = `cannot be processed`
  }
  const message = {
    subject: `Update on your order #${order._id}`,
    text:`Hi ${order.user.firstName}!`,
    html: orderUpdate(order, `Hi ${order.user.firstName}! Your order ${msg}`),
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