import React from 'react';

const Terms = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-heading p-white">Terms and Conditions</h1>
      <p className="terms-updated p-white">Last updated: 6th July 2025</p>
      <p className='p-white'>
        Welcome to Link Hangouts! By accessing or using our website and attending our events, you agree
        to the following terms and conditions. Please read them carefully.
      </p>

      <div className="terms-section">
        <h2 className='p-white'>1. Company Overview</h2>
        <p className='p-white'>
          Link Hangouts is a lifestyle brand based in Lagos, Nigeria, focused on organizing events,
          parties, and hangouts. Our website offers event details, media galleries, and ticket purchasing options.
        </p>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>2. Ticket Sales</h2>
        <ul className='p-white'>
          <li>All ticket sales are final unless otherwise stated.</li>
          <li>Tickets are non-transferable and non-refundable except in the case of event cancellation.</li>
          <li>Entry may be denied without a valid ticket or proper identification.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>3. Event Conduct</h2>
        <ul className='p-white'>
          <li>We expect all attendees to behave respectfully and responsibly.</li>
          <li>We reserve the right to remove individuals engaging in illegal, disruptive, or unsafe behavior.</li>
          <li>
            Alcohol and age-restricted content may be present. You must meet the legal age requirements
            to attend such events.
          </li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>4. Media Use</h2>
        <ul className='p-white'>
          <li>By attending our events, you consent to being photographed or filmed.</li>
          <li>
            We may use these materials for promotional purposes on our website, social media, or
            marketing campaigns.
          </li>
          <li>
            If you wish not to appear in any media, please inform us in advance or on-site.
          </li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>5. Liability</h2>
        <ul className='p-white'>
          <li>
            Link Hangouts is not liable for personal injury, loss, or damage to personal property during our events.
          </li>
          <li>You attend our events at your own risk and agree to follow safety guidelines and venue rules.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>6. Intellectual Property</h2>
        <ul className='p-white'>
          <li>
            All content on our website (text, images, videos, branding) is the property of Link Hangouts.
          </li>
          <li>You may not reproduce or distribute any content without our prior written consent.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>7. Privacy</h2>
        <ul className='p-white'>
          <li>Your personal data is handled in accordance with our Privacy Policy.</li>
          <li>
            By using our website and services, you agree to how we collect and use data as outlined.
          </li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>8. Third-Party Links</h2>
        <p className='p-white'>
          Our site may contain links to third-party services. We are not responsible for their content or
          practices.
        </p>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>9. Modifications</h2>
        <p className='p-white'>
          We may update these terms at any time. Continued use of our services implies acceptance of the
          revised terms.
        </p>
      </div>

      <div className="terms-section">
        <h2 className='p-white'>10. Contact</h2>
        <p className='p-white'>
          For questions or concerns about these terms, please contact us at:
          <br />
          <br />
          <p>Email: info@thelinkhangout.com</p>
          Location: Lagos, Nigeria
        </p>
      </div>
    </div>
  );
};

export default Terms;
