import React from 'react';
import {
  EmailShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton
} from 'react-share';

import { FaFacebookF, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const SocialShare = ({ item, text, heading = 'Share this product' }) => {
  const shareMessage =
    text ||
    `Check out the "${item.name}" merch available on our event ticketing platform, exclusively offered by TheLinkHangout.`;

  const shareUrl = `${window.location.protocol}//${window.location.host}/product/${item.slug}`;

  return (
    <div className='social-share-container'>
    <h2>{heading}</h2>
    <ul className="d-flex flex-row mx-0 mb-0 justify-content-center justify-content-md-start social-share-box mb-4">
      <li>
        <FacebookShareButton url={shareUrl} quote={shareMessage} className="share-btn facebook">
          <FaFacebookF size={25}/>
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton url={shareUrl} title={shareMessage} className="share-btn twitter">
          <FaXTwitter size={25}/>
        </TwitterShareButton>
      </li>
      <li>
        <EmailShareButton url={shareUrl} subject={item.name} body={shareMessage} className="share-btn envelope">
          <FaEnvelope size={25}/>
        </EmailShareButton>
      </li>
      <li>
        <WhatsappShareButton url={shareUrl} title={shareMessage} className="share-btn whatsapp">
          <FaWhatsapp size={25}/>
        </WhatsappShareButton>
      </li>
    </ul>
    </div>
  );
};

export default SocialShare;
