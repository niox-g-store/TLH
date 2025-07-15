// PopupComponent.tsx
import React, { useState } from 'react';
import './style.css';
import { API_URL } from '../../../constants';
import ResolveImage from '../ResolveImage';
import CountdownTimer from '../CountDownTimer';
import { Link } from 'react-router-dom';
import RowCarousel from '../RowCarousel';

const PopupComponent = ({ data, type }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div data-aos="fade-up" className="popup-overlay">
      <div className="popup-card">
        <button className="popup-close" onClick={() => setIsOpen(false)}>×</button>

        <RowCarousel>
        {data.map((item, index) => (
          <div className="popup-content" key={index}>
            <div className="timer">
              <CountdownTimer endDate={item.endDate} />
            </div>

            {type === 'image' && item.imageUrls && (
              <div style={{ height: '11em' }}>
                <Link to={`/event/${item.slug}`}>
                  <img
                    src={ResolveImage(API_URL + item.imageUrls[0])}
                    alt={index}
                    className="popup-image"
                  />
                  </Link>
              </div>
            )}

            <div className="popup-text">
              {item.name && <h2 style={{ color: 'white' }}>{item.name}</h2>}
            </div>

            {/*item.tickets && item.tickets.length > 0 && (
              <div className="popup-tickets">
                <h2 className='font-size-20'>Tickets on discount</h2>
                <div className='ticket-price-container'>
                {item.tickets
                  .filter(ticket => ticket.discount === true)
                  .map((ticket, idx, arr) => (
                    <div className="ticket-price" key={idx}>
                      <p><span>({ticket.type}) </span><span style={{ textDecoration: 'line-through', color: 'black', marginRight: 8 }}>
                        ₦{ticket.price.toLocaleString()}
                      </span>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>
                        ₦{ticket.discountPrice.toLocaleString()}
                      </span>
                      {arr.length > 1 && idx < arr.length - 1 && <span>,</span>}
                      </p>
                    </div>
                  ))
                  }
                  </div>
              </div>
            )*/}

            <Link className='popover-link' to={`/event/${item.slug}`}>
              <button className="popup-cta">Get Tickets Now</button>
            </Link>
            {index + 1 < data.length && <p style={{ marginTop: '1em', justifySelf: 'end' }}>Swipe to see more... </p>}
          </div>
        ))}
        </RowCarousel>
      </div>
    </div>
  );
};

export default PopupComponent;
