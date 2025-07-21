const moment = require('moment');

exports.adminNewOrderHtml = (order) => {
    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>New Order Notification - The Link Hangouts</title>
    <style type="text/css">
        body { margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4; }
        table { border-collapse: collapse; }
        .content { width: 100%; max-width: 600px; }
        .apple-link {
            color: #007BFF !important;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .full-width-image img {
                width: 100% !important;
                height: auto !important;
            }
            .content {
                width: 100% !important;
                max-width: none !important;
            }
            .header-logo {
                width: 100% !important;
                max-width: 150px !important;
            }
            .padding-mobile {
                padding: 10px 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4;">

    <span class="preheader" style="color: transparent; display: none !important; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
        New Order Received! Order #${order._id} from ${order.name}.
    </span>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="content" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
                    <tr>
                        <td align="center" style="padding: 30px 30px 20px 30px; border-bottom: 1px solid #eeeeee;">
                            <img class="header-logo" src="https://thelinkhangout.com/black_logo.png" alt="The Link Hangouts Logo" width="180" style="display: block; max-width: 180px; height: auto; border-radius: 10px; font-family: Arial, sans-serif; color: #333333; font-size: 20px; font-weight: bold;">
                        </td>
                    </tr>

                    <tr>
                        <td class="padding-mobile" style="padding: 30px 40px;">
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Hello Admin,</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                A new order has been placed on The Link Hangouts. Please review the details below:
                            </p>

                            <hr style="border: none; border-top: 1px dashed #cccccc; margin: 20px 0;" />

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                <strong>Order #:</strong> ${order._id}
                            </p>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                <strong>Date:</strong> ${moment(order.createdAt).format('MMMM D, YYYY')}
                            </p>

                            <h3 style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; color: #333333; margin: 0 0 15px 0;">Order Items:</h3>
                            ${order.cart.tickets.map(ticket => `
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Event:</strong> ${ticket.eventId.name}
                                </p>
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Event Date:</strong> ${moment(ticket.eventId.startDate).format('MMMM D, YYYY • h:mm A')}
                                </p>
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Tickets:</strong> ${ticket.quantity} x ${ticket.ticketType}
                                </p>
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                    <strong>Venue:</strong> ${ticket.eventId.location}
                                </p>
                            `).join('')}

                            ${order.cart.products.map(product => `
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Product:</strong> ${product.productName}
                                </p>
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Quantity:</strong> ${product.quantity}
                                </p>
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Price:</strong> ${formatCurrency(product.finalPrice)}
                                </p>
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                    <strong>Delivery:</strong> ${product.needsDelivery ? 'Will be delivered to customer' : 'Customer will pick up'}
                                </p>
                                ${product.needsDelivery ? `
                                    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                        <strong>${product.deliveryInfo.address.island ? 'Island' : 'Mainland'} Delivery</strong>
                                    </p>
                                ` : ''}
                            `).join('')}

                            <hr style="border: none; border-top: 1px dashed #cccccc; margin: 20px 0;" />

                            <h3 style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; color: #333333; margin: 0 0 15px 0;">Financial Summary:</h3>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                <strong>Total Paid:</strong> ${formatCurrency(order.cart.total)}
                            </p>

                            ${order.discountAmount && order.discountAmount > 0 ? `
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Discount Applied:</strong> - ${formatCurrency(order.discountAmount)}
                                </p>
                            ` : ''}

                            ${order.coupon && order.coupon.code ? `
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Coupon Used:</strong> ${order.coupon.code}
                                </p>
                                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                    <strong>Coupon Discount:</strong>
                                    ${order.coupon.type === 'Fixed' ? `- ${formatCurrency(order.coupon.amount)}` : ''}
                                    ${order.coupon.type === 'Percentage' ? `${order.coupon.percentage}% OFF` : ''}
                                </p>
                            ` : ''}
                            
                            <hr style="border: none; border-top: 1px dashed #cccccc; margin: 20px 0;" />

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                You can view the full order details in the dashboard: <br>
                                <a href="https://thelinkhangout.com/dashboard/order/${order._id}" target="_blank" style="color: #007BFF; text-decoration: none;">View Order #${order._id}</a>
                            </p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0;">Best regards,<br>The Link Hangouts Team</p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 20px 30px 30px 30px; border-top: 1px solid #eeeeee; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.5; color: #777777; margin: 0;">&copy; ${new Date().getFullYear()} The Link Hangouts. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>
    `;
};