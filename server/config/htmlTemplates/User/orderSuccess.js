const moment = require('moment');

exports.invoiceEmailHtml = (order) => {
    const eventNames = order.eventNames;

    const uniqueEventNames = [...new Set(eventNames)];

    let eventNamesFormatted;
    if (uniqueEventNames.length > 1) {
        const lastEvent = uniqueEventNames[uniqueEventNames.length - 1];
        const otherEvents = uniqueEventNames.slice(0, -1);
        eventNamesFormatted = otherEvents.join(', ') + ' and ' + lastEvent;
    } else {
        eventNamesFormatted = uniqueEventNames[0];
    }

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Your Link Hangouts Ticket Confirmation!</title>
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
                max-width: 100px !important;
            }
            .padding-mobile {
                padding: 10px 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4;">

    <span class="preheader" style="color: transparent; display: none !important; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
        Your ticket to ${eventNamesFormatted} has been confirmed! Details inside.
    </span>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="content" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
                    <tr>
                        <td align="center" style="padding: 30px 30px 20px 30px; border-bottom: 1px solid #eeeeee;">
                            <img class="header-logo" src="https://thelinkhangout.com/black_logo.png" alt="The Link Hangouts Logo" width="100" style="display: block; max-width: 100px; height: auto; border-radius: 10px; font-family: Arial, sans-serif; color: #333333; font-size: 20px; font-weight: bold;">
                        </td>
                    </tr>

                    <tr>
                        <td class="padding-mobile" style="padding: 30px 40px;">
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Hi ${order.name},</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                Thanks for your purchase! Your ticket to ${eventNamesFormatted} has been confirmed.
                            </p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 10px 0; font-weight: bold;">Here are the details:</p>

                            <hr style="border: none; border-top: 1px dashed #cccccc; margin: 20px 0;" />

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 5px 0;">
                                <strong>🧾 Order #:</strong> ${order._id}
                            </p>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                <strong>Date:</strong> ${moment(order.createdAt).format('MMMM D, YYYY')}
                            </p>

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
                                <hr style="border: none; border-top: 1px dashed #cccccc; margin: 20px 0;" />
                            `).join('')}

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 10px 0; font-weight: bold;">Please bring:</p>
                            <ul style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; padding-left: 20px; margin: 0 0 30px 0; list-style: none;">
                                <li style="margin-bottom: 10px; position: relative; padding-left: 10px;">
                                    <span style="position: absolute; left: 0;">•</span> Your QR code (scan at the gate)
                                </li>
                                <li style="margin-bottom: 10px; position: relative; padding-left: 10px;">
                                    <span style="position: absolute; left: 0;">•</span> Your best vibe 🎶
                                </li>
                            </ul>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Need help? Contact us anytime at <a href="mailto:support@thelinkhangout.com" style="color: #007BFF; text-decoration: none;">support@thelinkhangout.com</a></p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0;">See you soon!<br>– The Link Hangouts Team</p>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #007BFF; margin: 10px 0 0 0;"><a href="https://thelinkhangout.com" target="_blank" style="color: #007BFF; text-decoration: none;">thelinkhangout.com</a></p>
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