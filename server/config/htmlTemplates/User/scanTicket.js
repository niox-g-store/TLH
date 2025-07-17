const moment = require('moment');

exports.checkedInEmailHtml = (userName, eventName, ticketCode, scannedAt) => {

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Your Link Hangouts Ticket Checked In!</title>
    <style type="text/css">
        body { margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4; }
        table { border-collapse: collapse; }
        .content { width: 100%; max-width: 600px; }
        .apple-link {
            color: #007BFF !important;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .content {
                width: 100% !important;
                max-width: none !important;
            }
            .padding-mobile {
                padding: 10px 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4;">

    <span class="preheader" style="color: transparent; display: none !important; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
        Your ticket for ${eventName} has been checked in!
    </span>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="content" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
                    <tr>
                        <td class="padding-mobile" style="padding: 30px 40px;">
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Hi ${userName},</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                Great news! Your ticket for *${eventName}* has been successfully checked in.
                            </p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 10px 0;">
                                Your Ticket Code: <strong>${ticketCode}</strong>
                            </p>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                Scanned At: <strong>${moment(scannedAt).format('MMMM D, YYYY [at] h:mm A')}</strong>
                            </p>

                            <hr style="border: none; border-top: 1px dashed #cccccc; margin: 20px 0;" />

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">
                                We hope you have an amazing time at the event!
                            </p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Need help? Contact us anytime at <a href="mailto:support@thelinkhangout.com" style="color: #007BFF; text-decoration: none;">support@thelinkhangout.com</a></p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0;">See you soon!<br>– The Link Hangouts Team</p>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #007BFF; margin: 10px 0 0 0;"><a href="https://thelinkhangout.com" target="_blank" style="color: #007BFF; text-decoration: none;">🌐 thelinkhangout.com</a></p>
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