import React from 'react';
import { API_URL } from '../../../../constants';
import { ROLES } from '../../../../constants';

const campaignTemplate = ( title, shouldEmailContainUserName, content, imageUrls, eventId, user, linkName, linkUrl ) => {
  /* <h1 style="font-size: 24px; color: #333333; margin-bottom: 15px; font-weight: bold;">
        ${title}
      </h1>
  */
  const resolvedRecipientName = shouldEmailContainUserName ? 'Hi John Doe' : '';

  const imagesHtml = imageUrls && imageUrls.length > 0
    ? imageUrls.map((url, index) => `
        <img
          src="${API_URL}${url}"
          alt="${title} image ${index + 1}"
          style="max-width: 100%; height: auto; border-radius: 8px; padding-bottom: 30px; display: block; margin: 0 auto;"
        />
      `).join('')
    : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Newsletter Preview</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          background-color: #f4f4f4;
        }
        div[style*="font-family"] {
          font-family: sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
          max-width: 600px;
          margin: 20px auto;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        div[style*="background-color: #ffffff"] {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
        }
        h1 {
          font-size: 24px;
          color: #333333;
          margin-bottom: 15px;
          font-weight: bold;
        }
        p {
          font-size: 16px;
          color: #333333;
          margin-bottom: 20px;
        }
        div[style*="line-height"] {
          font-size: 16px;
          line-height: 1.6;
          color: #555555;
          margin-bottom: 20px;
        }
        img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .footer-text {
          font-size: 14px;
          color: #777777;
          margin-top: 30px;
          text-align: center;
        }
        .copyright-text {
          font-size: 12px;
          color: #999999;
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px 15px; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        ${!eventId || user.role === ROLES.Admin ? `<div style="text-align: center; margin-bottom: 20px;">
          <img
            src="https://thelinkhangout.com/black_logo.png"
            alt="Logo"
            style="width: 100px; border-radius: 10px;"
          />
        </div>`: ``
        }

        <div style="padding: 30px 0px; border-radius: 8px;">
          <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
            ${resolvedRecipientName}
          </p>

          <div
            style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 20px;"
          >${content}</div>

          ${imagesHtml}

          ${linkName && linkUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkUrl}" 
                 style="background-color: #9172EC; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block;
                        font-weight: bold;">
                ${linkName}
              </a>
            </div>
          ` : ''}

          <p style="font-size: 14px; color: #777777; margin-top: 30px; text-align: center;">
            Thank you for being a part of our community.
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999999;">
          <p>&copy; ${new Date().getFullYear()} The link hangouts. All rights reserved.</p>
          ${!eventId ? `<p>This email was sent to you because you are subscribed to our newsletter.</p>` : ''}
          <a href="%recipient.unsubscribe_link%"
           style="text-decoration:underline;color:black;font-size:12px;" 
           target="_blank">
            Click here to unsubscribe
        </a>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default campaignTemplate;