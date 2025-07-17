/**
 * order success email template
 */

// const serviceCharge = `<p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;">${order.currency}${(order.serviceCharge).toLocaleString()}</p>

const orderItemsHtml = (order) => {
    // Start of the table HTML
    const t = `<table class="invoice-items" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;width:100%;margin:0;" width="100%">`;

    // Generate HTML for each product and collect the results
    let subTotal = 0;
    const products = order.products.map(item => {
        subTotal += item.totalPrice - (item.totalPrice * (item.discountPrice / 100))
        return `
        <tr style="vertical-align:middle;" valign="middle">
            <td class="content line-item" valign="top" style="vertical-align:top;border-top-width:1px;border-top-color:#eee;border-top-style:solid;margin:0;padding:5px 0;">
                <p style="display: flex; align-items: center; color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;"><img  width='50px' height='50px' src=${item.image}>&nbsp;<p>${item.name}</p>&nbsp; ---- &nbsp; Quantity: ${item.quantity}</p>
            </td>
            <td class="content line-item alignright" align="right" valign="top" style="vertical-align:top;border-top-width:1px;border-top-color:#eee;border-top-style:solid;margin:0;padding:5px 0;">
                <p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;">${order.currency}${(item.totalPrice - (item.totalPrice * (item.discountPrice / 100))).toLocaleString()}</p>
            </td>
        </tr>`;
    }).join('');  // Join the array into a single string

    // End of the table HTML with total row
    const tend = `
    <tr class="total" style="vertical-align:middle;" valign="middle">
        <td class="content total-border alignright" width="80%" align="right" valign="top" style="vertical-align:top;text-align:right;border-top-width:2px;border-top-color:#333;border-top-style:solid;border-bottom-color:#333;border-bottom-width:2px;border-bottom-style:solid;font-weight:700;margin:0;padding:5px 0;">
            <p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;"><b>Sub Total:</b>&nbsp;</p>
            <p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;"><b>Total:</b>&nbsp;</p>
        </td>
        <td class="content total-border alignright" align="right" valign="top" style="vertical-align:top;text-align:right;border-top-width:2px;border-top-color:#333;border-top-style:solid;border-bottom-color:#333;border-bottom-width:2px;border-bottom-style:solid;font-weight:700;margin:0;padding:5px 0;">
            <p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;">${order.currency}${(subTotal).toLocaleString()}</p>
            <p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;">${order.currency}${(subTotal).toLocaleString()}</p>
        </td>
    </tr>
    </table>`;

    // Return the full HTML string by concatenating start, product rows, and end
    return t + products + tend;
};


exports.orderProductsUpdate = (order, orderMsg) =>
`
<!DOCTYPE html>
<html lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" style="color-scheme:light dark;supported-color-schemes:light dark;">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1 user-scalable=yes">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Order Receipt</title>
<!--[if mso]> <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<!--[if mso]>
<style>table,tr,td,p,h1,h2,span,a{mso-line-height-rule:exactly !important;line-height:120% !important;mso-table-lspace:0 !important;mso-table-rspace:0 !important;}
</style>
<![endif]-->
<style>a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important;}u+#body a{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important;}#MessageViewBody a{color:inherit!important;text-decoration:none!important;font-size:inherit!important;
font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important;}:root{color-scheme:light dark;supported-color-schemes:light dark;}tr{vertical-align:middle;}p,a,li,.content-block{color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;}p:first-child{margin-top:0!important;}p:last-child{margin-bottom:0!important;}a{text-decoration:underline;font-weight:bold;color:#0000ff}
.content-block{padding:0 0 20px;}.aligncenter{font-size:32px;color:#000;line-height:1.2em;font-weight:500;text-align:center;margin:20px 0 0;}.invoice-items{font-family:Arial,sans-serif;font-size:14px;width:100%;margin:0;}.line-item{vertical-align:top;border-top-width:1px;border-top-color:#eee;border-top-style:solid;margin:0;padding:5px 0;}.invoice{text-align:left;width:80%;margin:0 auto;}.small,.small a{font-size:12px;color:#999;margin:0;}.total-border{vertical-align:top;text-align:right;
border-top-width:2px;border-top-color:#333;border-top-style:solid;border-bottom-color:#333;border-bottom-width:2px;border-bottom-style:solid;font-weight:700;margin:0;padding:5px 0;}@media only screen and (max-width:599px){.full-width-mobile{width:100%!important;height:auto!important;}.mobile-padding{padding-left:10px!important;padding-right:10px!important;}.mobile-stack{display:block!important;width:100%!important;}}@media (prefers-color-scheme:dark){body,div,table,td{background-color:#000000!important;}h1,h2{color:#ffffff!important;}.content{background-color:#222222!important;}p,li{color:#B3BDC4!important;}.total-border{border-top-color:#eee!important;border-bottom-color:#eee!important;}a{color:#84cfe2!important;}}
</style>
</head>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 5%; border-collapse: collapse; text-align: center;">
  <tr>
    <td align="center" valign="middle" style="padding: 0;">
      <img alt="logo" src="https://res.cloudinary.com/dduai6ryd/image/upload/v1736088530/ithoan/images/logo/business_logo.png" style="height: 120px; width: 120px; display: block; border-radius: 50%;">
    </td>
  </tr>
</table>
<p style="font-size: 30px;text-align: center;">${orderMsg}</p>

<body class="body" style="background-color:#f4f4f4;">
<table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px;width:100%;background-color:#f4f4f4;"><tr style="vertical-align:middle;" valign="middle"><td>
<!--[if mso]>
<table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;">
<!--<![endif]-->
<tr style="vertical-align:middle;" valign="middle"><td align="center">
<table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;max-width:600px;width:100%;background-color:#fffffe;"><tr style="vertical-align:middle;" valign="middle"><td align="center" style="padding: 0px 30px 30px 30px;" class="content mobile-padding">
<table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;max-width:600px;width:100%;background-color:#fffffe;"><tr style="vertical-align:middle;" valign="middle"><td class="content content-block" valign="top" style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;padding:0 0 20px;">
</td></tr>
<tr style="vertical-align:middle;" valign="middle"><td class="content content-block" valign="top" style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;padding:0 0 20px;"><h4 class="aligncenter" align="center" style="font-size:25px;color:#000;line-height:1.2em;font-weight:500;text-align:center;margin:20px 0 0;">Your Details</h4>
<table role="presentation" class="invoice content" width="100%" align="left" style="text-align:left;margin:0 auto;width:100%;"><tr style="vertical-align:middle;" valign="middle"><td valign="top" style="padding-bottom:30px;" class="content"><p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;"><b>Name: </b>${order.user.firstName}&nbsp;${order.user.lastName}<br><b>Order ID:</b>&nbsp;#${order._id}<br><b>Date: </b>${new Date(order.created).toDateString()}<br><b>Address: </b>${order.address.address} ${order.address.city} ${order.address.state} ${order.address.country}<br><b>Delivery: </b>${order.dispatch}</p>
</td></tr><tr style="vertical-align:middle;" valign="middle"><td valign="top" class="content">
</td></tr><tr style="vertical-align:middle;" valign="middle"><td class="content content-block" valign="top" style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;padding:0 0 20px;"><h4 class="aligncenter" align="center" style="font-size:25px;color:#000;line-height:1.2em;font-weight:500;text-align:center;margin:20px 0 0;">You Bought</h4>

${orderItemsHtml(order)}


</td></tr></table>
</td></tr><tr style="vertical-align:middle;" valign="middle"><td class="content content-block aligncenter" align="center" valign="top" style="mso-line-height-rule:exactly;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:0 0 20px;font-size:32px;color:#000;line-height:1.2em;font-weight:500;text-align:center;margin:20px 0 0;"> <a href="https://tohannieesskincare.com/order/${order._id}" style="mso-line-height-rule:exactly;line-height:24px;font-weight:bold;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
box-sizing:border-box;font-size:14px;color:#348eda;text-decoration:underline;margin:0;">View in&nbsp;browser</a>
</td></tr><tr style="vertical-align:middle;" valign="middle"><td align="center" valign="top" class="content"><p style="color:#000000;font-size:16px;mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;margin-top:0!important;margin-bottom:0!important;"><a href='https://wa.me/2349077692506'>Chat with us on whatsapp</a> &nbsp;<br><a href='https://www.instagram.com/tohanniees_skincare/?igsh=ODB2cDI1dTFrb2Jo'>Follow us on instagram</a></p>
</td></tr>
</td></tr></table>
</td></tr></table>
<table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;max-width:600px;width:100%;"><tr style="vertical-align:middle;" valign="middle"><td align="center" style="padding:30px 0;"><p class="small" style="mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;font-size:12px;color:#999;margin:0;margin-top:0!important;margin-bottom:0!important;">Questions?&nbsp;Email <a href="mailto:support@tohannieesskincare.com" style="mso-line-height-rule:exactly;line-height:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-decoration:underline;font-weight:bold;font-size:12px;color:#999;margin:0;">support@tohannieesskincare.com</a></p>
</td></tr></table>
</td></tr>
<!--[if mso]>
</td></tr></table>
<!--<![endif]--></table></div>
</body>
</html>
`