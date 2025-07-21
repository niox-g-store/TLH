import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaCheckCircle } from 'react-icons/fa';
import actions from '../../actions';
import Button from '../../components/Common/HtmlTags/Button';

const OrderSuccess = ({ authenticated }) => {
  const { id } = useParams();
  const isGuest = id && id.startsWith('guest-');
  const guestOrderID = id.split('-')[1]

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">
          <FaCheckCircle size={80} color="#9172EC" />
        </div>

        <div className='order-success-text'>
        <h1>Thank You for Your Order!</h1>
        <p className="order-id">Order ID: {isGuest ? guestOrderID : id}</p>
        
        <div className="order-details">
          {/* Professional text covering both products and tickets for all users */}
          <p>Your order has been successfully placed! You will receive a confirmation email shortly with all the details, including information on how to access your tickets or delivery/pickup arrangements for your products.</p>
          
          {isGuest ? (
            <div className="guest-message">
              <p>As a guest user, you can access your order details using the link sent to your email.</p>
              <p>Want to manage all your orders in one place?</p>
              <div className="action-buttons">
                <Link to="/signup" className="primary-button"><Button text={"Create an Account"} /></Link>
                <Link to="/events" className="secondary-button"><Button type="secondary" text={"Explore More Events"} /></Link>
              </div>
            </div>
          ) : (
            <div className="user-message">
              <p>You can view and manage all your orders in your dashboard.</p>
              <div className="action-buttons">
                <Link to="/dashboard/orders/my-orders"><Button className="primary" text={"View My Orders"} /></Link>
                <Link to="/events"><Button type="secondary" text={"Explore More Events"} /></Link>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.authentication.authenticated
});

export default connect(mapStateToProps, actions)(OrderSuccess);