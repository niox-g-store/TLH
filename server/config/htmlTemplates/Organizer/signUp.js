exports.organizerSignupHtml = (organizer) =>{
return`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to The Link Hangouts!</title>
    <style type="text/css">
        /* Client-specific Styles & Reset */
        body { margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4; }
        table { border-collapse: collapse; }
        .content { width: 100%; max-width: 600px; }
        .button-link {
            color: #ffffff !important;
            text-decoration: none;
        }
        .apple-link { /* For iOS auto-detection of phone numbers/addresses */
            color: #007BFF !important;
            text-decoration: none;
        }
        /* Mobile responsive */
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
                max-width: 150px !important; /* Adjust if logo is too big on mobile */
            }
            .padding-mobile {
                padding: 10px 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4;">

    <span class="preheader" style="color: transparent; display: none !important; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
        Welcome to The Link Hangouts! Your journey to successful events starts here.
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
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Hi ${organizer?.companyName || 'there'},</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Welcome to The Link Hangouts! We're thrilled to have you join our community and are excited to help you bring your events to life.</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">Whether you're hosting concerts, conferences, festivals, or private gatherings, our platform is designed to simplify your event management. We provide robust tools to effortlessly sell tickets, manage attendees, and grow your audience.</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 10px 0; font-weight: bold;">Here's how you can get started:</p>
                            <ul style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; padding-left: 20px; margin: 0 0 30px 0; list-style: none;">
                                <li style="margin-bottom: 10px; position: relative; padding-left: 10px;">
                                    <span style="position: absolute; left: 0;"></span> Set up your first event
                                </li>
                                <li style="margin-bottom: 10px; position: relative; padding-left: 10px;">
                                    <span style="position: absolute; left: 0;"></span> Customize your organizer profile to reflect your brand
                                </li>
                                <li style="margin-bottom: 10px; position: relative; padding-left: 10px;">
                                    <span style="position: absolute; left: 0;"></span> Start selling tickets in minutes
                                </li>
                                <li style="margin-bottom: 10px; position: relative; padding-left: 10px;">
                                    <span style="position: absolute; left: 0;"></span> Track your sales and performance with real-time analytics
                                </li>
                            </ul>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" bgcolor="#9172EC" style="border-radius: 10px; color: #fff;">
                                                    <a href="https://thelinkhangout.com/dashboard/events/add" target="_blank" style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: bold; color: #fff; text-decoration: none; padding: 12px 25px; display: inline-block;">
                                                        Create Your First Event
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Need assistance or have questions? Our comprehensive <a href="https://thelinkhangout.com/faq" target="_blank" style="color: #007BFF; text-decoration: none;">Organizer Help Center</a> is available, or you can always reach out to our dedicated support team at <a href="mailto:support@thelinkhangout.com" style="color: #007BFF; text-decoration: none;">support@thelinkhangout.com</a>.</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 15px 0;">Let's make your next event an outstanding success!</p>

                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0;">Cheers,<br>The Link Hangouts Team</p>
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
`
}