import React from 'react';
import { API_URL } from '../../../../constants';

const campaignTemplate = (props) => {
  const {
    title, shouldEmailContainUserName,
    content, imageUrls
  } = props

  const resolvedRecipientName = shouldEmailContainUserName ? 'John Doe' : 'there';

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f4', padding: '20px', maxWidth: '600px', margin: '20px auto', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src="https://thelinkhangout.com/black_logo.png"
          alt="Company Logo"
          style={{ maxWidth: '150px', borderRadius: '8px' }}
        />
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px' }}>
        <p style={{ fontSize: '16px', color: '#333333', marginBottom: '20px' }}>
          Hi {resolvedRecipientName},
        </p>

        <h1 style={{ fontSize: '24px', color: '#333333', marginBottom: '15px', fontWeight: 'bold' }}>
          {title}
        </h1>

        <div
          style={{ fontSize: '16px', lineHeight: '1.6', color: '#555555', marginBottom: '20px' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {imageUrls && imageUrls.length > 0 && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={`${API_URL}${url}`}
                alt={`${title} image ${index + 1}`}
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '15px', display: 'block', margin: '0 auto' }}
              />
            ))}
          </div>
        )}

        <p style={{ fontSize: '14px', color: '#777777', marginTop: '30px', textAlign: 'center' }}>
          Thank you for being a part of our community.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999999' }}>
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        <p>This email was sent to you because you are subscribed to our newsletter.</p>
      </div>
    </div>
  );
};

export default campaignTemplate;
