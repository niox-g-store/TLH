const campaignProductList = (type, Cproducts) => {
  const templates = {
    best_selling: `<td align="center" style="padding:0;Margin:0">
      <h2 style="Margin:0;font-family:Alata, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:30px;font-style:normal;font-weight:normal;line-height:36px;color:#FFFFFF">
        Discover Our Most Popular Products Loved By Customers Like You!
      </h2>
    </td>`,
    discount: `<td align="center" style="padding:0;Margin:0">
      <h2 style="Margin:0;font-family:Alata, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:30px;font-style:normal;font-weight:normal;line-height:36px;color:#FFFFFF">
        Grab Your Favourite Products Now At Unbeatable Discounts!
      </h2>
    </td>`,
    new_arrivals: `<td align="center" style="padding:0;Margin:0">
      <h2 style="Margin:0;font-family:Alata, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:30px;font-style:normal;font-weight:normal;line-height:36px;color:#FFFFFF">
        Discover the latest additions to our collections
      </h2>
    </td>`
  };

  const sectionTemplate = templates[type] || '';

  const t = `
    <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
      <tr>
        <td align="center" style="padding:0;Margin:0">
          <table bgcolor="black" align="center" cellpadding="0" cellspacing="0" class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:black;width:600px" role="none">
            <tr>
              <td align="left" class="es-m-p20r es-m-p20l" style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-top:40px">
                <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          ${sectionTemplate}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  const rows = Math.ceil(Cproducts.length / 2);
  let productsHTML = '';

  for (let i = 0; i < rows; i++) {
    const rowProducts = Cproducts.slice(i * 2, i * 2 + 2).map((item, index) => {
      const itemPrice = (item.price - (item.price * (item.discountPrice / 100))).toLocaleString();
      const realPrice = `<span style="display: flex;">
        <p class="p_price es-m-txt-l" style="Margin:0;mso-line-height-rule:exactly;font-family:Alata, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px;text-decoration: line-through;text-decoration-color: red;">₦${item.price.toLocaleString()}</p>
        <span class="p_price es-m-txt-l" style="Margin:0;mso-line-height-rule:exactly;font-family:Alata, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px;">&nbsp; &nbsp; - ${(item.discountPrice).toFixed(2)}%</span>
      </span>`;

      return `
        <td align="left" class="es-m-p20r es-m-p20l" style="margin:0;padding-top:15px;padding-right:15px;padding-left:15px;padding-bottom:15px;width: 50%; width: ${  i === 0 && index === 1 && "90%" || i === 1 && index === 0 && "90%" }; float: ${ i === 0 && index === 1 && "right" || i === 1 && index === 0 && "left" }">
          <table cellpadding="0" width="255px" cellspacing="0" align="center" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%">
            <tr>
              <td align="center" style="padding:0;Margin:0;font-size:0px">
                <a target="_blank" href="https://tohannieesskincare.com/product/${item.slug}" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px">
                  <img src="${item.imageUrl}" alt="" width="100%" class="adapt-img p_image" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none">
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0;Margin:0">
                <h3 class="p_name es-m-txt-l" style="Margin:0;font-family:Alata, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:30px;color:#FFFFFF">
                  ${item.name}
                </h3>
                ${type === 'discount' ? realPrice : ''}
                <p class="p_price es-m-txt-l" style="Margin:0;mso-line-height-rule:exactly;font-family:Alata, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px">
                  ₦${itemPrice}
                </p>
                <div align="right" style="margin-top:10px;">
                  <a href="https://tohannieesskincare.com/product/${item.slug}" target="_blank" class="es-button" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:16px;padding:10px 15px;display:inline-block;background:#131417;border-radius:4px;font-family:Alata, sans-serif;font-weight:normal;font-style:normal;line-height:21.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #131417">
                    BUY
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>`;
    }).join('');

    productsHTML += `<tr>${rowProducts}</tr>`;
  }

  return t + `<table class="width_problem" cellpadding="0" cellspacing="0" align="center" width="600px" role="presentation" style="background: black; mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">${productsHTML}</table>`;
};


const footer = (footer) => {
  if (footer) {
    return `
      <table cellpadding="0" cellspacing="0" align="center" role="none" style="border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed!important;background-color:transparent;background-repeat:repeat;background-position:center top; border-spacing: 0px; border: none; padding: 0px; margin: -3px 0px 0px 0px;"><tbody><tr><td align="center" style="padding:0;Margin:0"><table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="border-collapse:collapse;border-spacing:0px;background-color:#131417;width:600px"><tbody><tr><td align="left" style="padding:40px;Margin:0"><table cellspacing="0" cellpadding="0" align="left" role="none" style="border-collapse:collapse;border-spacing:0px;float:left"><tbody><tr><td align="left" style="padding:0;Margin:0;width:246px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse:collapse;border-spacing:0px"><tbody><tr>
<td align="left" style="padding:100px 0px 0px 0px;Margin:0;font-size:0px"><a href="" style="text-decoration:underline;color:#ffffff;font-size:12px" target="_blank"><img src="https://res.cloudinary.com/dduai6ryd/image/upload/v1736088530/ithoan/images/logo/business_logo.png" alt="Logo" title="Logo" height="50" width="50" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none;border-radius:50%" class="CToWUd" data-bit="iit"></a> </td></tr></tbody></table></td></tr></tbody></table> <table cellspacing="0" cellpadding="0" align="right" role="none" style="border-collapse:collapse;border-spacing:0px;float:right"><tbody><tr>
<td align="left" style="padding:0;Margin:0;width:254px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse:collapse;border-spacing:0px"><tbody><tr><td align="right" style="padding:0;Margin:0;font-size:0"><table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px"><tbody><tr>
<td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a href="https://www.instagram.com/tohanniees_skincare/?igsh=ODB2cDI1dTFrb2Jo" style="text-decoration:underline;color:#ffffff;font-size:12px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/tohanniees_skincare/?igsh%3DODB2cDI1dTFrb2Jo&amp;source=gmail&amp;ust=1737301069031000&amp;usg=AOvVaw25UwldyAk0nkzpsn_ki0VN"><img src="https://res.cloudinary.com/dduai6ryd/image/upload/v1737226260/instagram_x3qgso.svg" alt="Ig" title="Instagram" width="32" height="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a></td>
<td align="center" valign="top" style="padding:0;Margin:0"><a href="https://wa.me/2349077692506" style="text-decoration:underline;color:#ffffff;font-size:12px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://wa.me/2349077692506&amp;source=gmail&amp;ust=1737301069031000&amp;usg=AOvVaw1DqbUgdsLMloivq6G2U0V1"><img src="https://res.cloudinary.com/dduai6ryd/image/upload/v1737226284/whatsapp_gfmhlx.svg" alt="Whatsapp" title="Whatsapp.com" width="32" height="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a></td><td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a href="https://snapchat.com/t/VE8G18OV" style="text-decoration:underline;color:#ffffff;font-size:12px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://snapchat.com/t/VE8G18OV&amp;source=gmail&amp;ust=1737301069031000&amp;usg=AOvVaw3j-zLPFB6voGmxLhK_23oa"><img src="https://res.cloudinary.com/dduai6ryd/image/upload/v1737226270/snapchat_k3qafv.svg" alt="Snap" title="Snapchat" width="52" height="52" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none;margin-left:8px; filter: invert(1); margin-top: -8px;" class="CToWUd" data-bit="iit"></a> </td></tr></tbody></table></td></tr></tbody></table></td></tr>
</tbody></table></td></tr> <tr><td align="left" style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-bottom:40px"><table cellpadding="0" cellspacing="0" align="left" role="none" style="border-collapse:collapse;border-spacing:0px;float:left"><tbody><tr><td align="left" style="padding:0;Margin:0;width:266px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px"><tbody><tr>
<td align="left" style="padding:0;Margin:0"><p style="Margin:0;font-family:Alata,sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px">For any questions contact us at <a href="mailto:support@tohannieesskincare.com" style="text-decoration:underline;color:#ffffff;font-size:12px" target="_blank">support@tohannieesskincare.com</a></p> </td></tr></tbody></table></td></tr></tbody></table> <table cellpadding="0" cellspacing="0" align="right" role="none" style="border-collapse:collapse;border-spacing:0px;float:right"><tbody><tr><td align="left" style="padding:0;Margin:0;width:234px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px"><tbody><tr>
<td align="right" style="padding:0;Margin:0"><p style="Margin:0;font-family:Alata,sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px"><em><a href="" style="text-decoration:underline;color:#ffffff;font-size:12px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://need_to_edit&amp;source=gmail&amp;ust=1737301069031000&amp;usg=AOvVaw28G_mG2hFK4VZU3Xw5jb88"></a></em>&nbsp; &nbsp;&nbsp;</p> </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>
    `
  }
  else {
    return ""
  }
}


exports.campaignTemplate = (campaign) =>
`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New Template 4</title> <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;}  </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]><noscript> <xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript>
<![endif]--><!--[if !mso]><!-- --><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Italianno&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet"><!--<![endif]--><!--[if mso]><xml> <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"> <w:DontUseAdvancedTypographyReadingMail/> </w:WordDocument> </xml>
<![endif]--><style type="text/css">.rollover:hover .rollover-first { max-height:0px!important; display:none!important;}.rollover:hover .rollover-second { max-height:none!important; display:block!important;}.rollover span { font-size:0px;}u + .body img ~ div div { display:none;}#outlook a { padding:0;}span.MsoHyperlink,span.MsoHyperlinkFollowed { color:inherit; mso-style-priority:99;}a.es-button { mso-style-priority:100!important; text-decoration:none!important;}a[x-apple-data-detectors],#MessageViewBody a { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important;}.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all;}@media only screen and (max-width:600px) {.es-m-p35t { padding-top:35px!important } .es-m-p20r { padding-right:20px!important }
.es-m-p35b { padding-bottom:35px!important } .es-m-p20l { padding-left:20px!important } .es-m-p0r { padding-right:0px!important } .es-m-p20b { padding-bottom:20px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0b { padding-bottom:0px!important } .es-m-p20 { padding:0px!important } .es-p-default { } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:40px!important; text-align:center } h2 { font-size:24px!important; text-align:center } .name_heading { font-size: 50px !important; } h3 { font-size:20px!important; text-align:center } h4 { font-size:24px!important; text-align:left }
h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:20px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important }
.es-infoblock p, .width_problem { width: 100%; }, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important }
.es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important; display:block } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:18px!important; padding:10px 20px 10px 20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-header table { width: 107% !important; }.adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important }
.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .h-auto { height:auto!important } }@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
</head>

<body class="body" style="width:105%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#fff"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#EEE8E1"></v:fill> </v:background><![endif]--><table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#fff"><tr>
<td valign="top" style="padding:0;Margin:0"><table cellspacing="0" cellpadding="0" align="center" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center" style="padding:0;Margin:0"><table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-header-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#da3e8e;width:600px"><tr><td align="center" class="es-m-p35t es-m-p35b es-m-p20r es-m-p20l" style="Margin:0;padding-top:30px;padding-right:40px;padding-bottom:30px;padding-left:40px"><!--[if mso]><table style="width:520px" cellpadding="0" cellspacing="0"><tr>
<td style="width:160px" valign="top"><![endif]--><table cellspacing="0" cellpadding="0" align="center" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr><td valign="top" align="center" class="es-m-p0r es-m-p20b" style="padding:0;Margin:0;width:160px">

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 5%; border-collapse: collapse; text-align: center;">
  <tr>
    <td align="center" valign="middle" style="padding: 0;">
      <img alt="logo" src="https://res.cloudinary.com/dduai6ryd/image/upload/v1736088530/ithoan/images/logo/business_logo.png" style="height: 120px; width: 120px; display: block; border-radius: 50%;">
    </td>
  </tr>
</table>

</td></tr></table>

<!--[if mso]></td><td style="width:20px"></td><td style="width:340px" valign="top"><![endif]--><table cellspacing="0" cellpadding="0" align="center" class="es-center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:none"><tr>

<td align="left" style="padding:0;Margin:0;width:340px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr class="links"><td align="center" valign="top" width="33%" id="esd-menu-id-0" style="Margin:0;border:0;padding-top:10px;padding-right:5px;padding-bottom:10px;padding-left:5px"><div style="vertical-align:middle;display:block"><a target="_blank" href="https://tohannieesskincare.com/shop" style="mso-line-height-rule:exactly;text-decoration:none;font-family:Alata, sans-serif;display:block;color:#FFFFFF;font-size:14px">${ campaign.links ? "Shop" : "" }</a> </div></td>
<td align="center" valign="top" width="33%" id="esd-menu-id-1" style="Margin:0;border:0;padding-top:10px;padding-right:5px;padding-bottom:10px;padding-left:5px"><div style="vertical-align:middle;display:block"><a target="_blank" href="https://tohannieesskincare.com/shop/category/all" style="mso-line-height-rule:exactly;text-decoration:none;font-family:Alata, sans-serif;display:block;color:#FFFFFF;font-size:14px">${campaign.links ? "All Category": ""}</a></div></td><td align="center" valign="top" width="33%" id="esd-menu-id-2" style="Margin:0;border:0;padding-top:10px;padding-right:5px;padding-bottom:10px;padding-left:5px"><div style="vertical-align:middle;display:block"><a target="_blank" href="mailto:support@tohannieesskincare.com" style="mso-line-height-rule:exactly;text-decoration:none;font-family:Alata, sans-serif;display:block;color:#FFFFFF;font-size:14px">${ campaign.links ? "Email Us" : "" }</a></div></td></tr></table></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr>

</table> <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important; border-spacing: 0px; border: none; padding: 0px; margin: -3px 0px 0px 0px;"><tr><td align="center" style="padding:0;Margin:0"><table cellspacing="0" cellpadding="0" bgcolor="#da3e8e" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#da3e8e;width:600px"><tr>
<td align="left" background="" class="es-m-p20r es-m-p20l" style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-top:10px;background-image:url();background-repeat:no-repeat;background-position:center top"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:520px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:15px;padding-right:20px;padding-bottom:15px;padding-left:20px"><img class="name_heading" src="https://res.cloudinary.com/dduai6ryd/image/upload/v1737231689/Tohanniees_skincare_2_ypliyr.png" width="300" height="70" style=""></img> </td></tr><tr><td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;font-family:Alata, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:40px;font-style:normal;font-weight:bold;line-height:84px;color:#FFFFFF">${campaign.heading}</h1></td></tr><tr><td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:15px;padding-right:20px;padding-bottom:15px;padding-left:20px"><h3 style="Margin:0;font-family:Alata, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:24px;color:#FFFFFF"></h3></td>
</tr><tr><td align="center" style="font-family: Alata, sans-serif; text-align: justify;font-size: 20px;color: #fff;padding:0;Margin:0;padding-top:5px;padding-bottom:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Alata, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:14px"></p> <p style="Margin:0;mso-line-height-rule:exactly;font-family:Alata, sans-serif;line-height:21px;letter-spacing:0;color:#FFFFFF;font-size:16px; text-align: justify; font-family: cursive;">${campaign.sub_heading}</p></td></tr> <tr>
<td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:20px"><!--[if mso]><a href="" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="" style="height:41px; v-text-anchor:middle; width:180px" arcsize="0%" stroke="f" fillcolor="#236329"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:Alata, sans-serif; font-size:15px; font-weight:400; line-height:15px; mso-text-raise:1px'>SHOP THE SALE</center> </v:roundrect></a>
<![endif]--><!--[if !mso]><!-- --><span class="es-button-border msohide" style="border-style:solid;border-color:#EEE8E1;background:#236329;border-width:0px;display:inline-block;border-radius:0px;width:auto;mso-hide:all"> </span><!--<![endif]--></td></tr></table></td></tr></table></td></tr> <tr>
<td align="left" style="padding:0;Margin:0"><table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td valign="top" align="center" class="es-m-p0r" style="padding:0;Margin:0;width:600px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://tohannieesskincare.com/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="${campaign.imageUrl && campaign.imageUrl}" alt="Logo " width="600" height="600" title="Logo " class="adapt-img" style="display:${ campaign.imageUrl ? "block" : "none" };font-size:14px;border:0;outline:none;text-decoration:none" height="395"></a> </td></tr></table></td></tr></table></td></tr></table></td></tr></table>

<table style="border-spacing: 0px; border: none; padding: 0px; margin: -3px 0px 0px 0px;">
${campaign.best_selling_products.length > 0 && campaignProductList('best_selling', campaign.best_selling_products) || ''}
</table>

<table style="border-spacing: 0px; border: none; padding: 0px; margin: -3px 0px 0px 0px;">
${campaign.discounted_products.length > 0 && campaignProductList('discount', campaign.discounted_products) || ''}
</table>

<table style="border-spacing: 0px; border: none; padding: 0px; margin: -3px 0px 0px 0px;">
${campaign.new_arrivals.length > 0 && campaignProductList('new_arrivals', campaign.new_arrivals) || ''}
</table>

${footer(campaign.footer)}
<tr>
    <td align="left" valign="top" style="padding:10px;Margin:0">
        <a href="%recipient.unsubscribe_link%" 
           style="text-decoration:underline;color:black;font-size:12px;" 
           target="_blank">
            Click here to unsubscribe
        </a>
    </td>
</tr>
`;
