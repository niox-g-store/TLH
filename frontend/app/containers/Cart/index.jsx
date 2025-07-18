/*
 *
 * Cart
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { Navigate, useNavigate } from 'react-router-dom';
import actions from '../../actions';
import GuestCheckout from '../Guest/checkout';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import Input from '../../components/Common/HtmlTags/Input';

const CartViewer = (props) => {
  const {
    isOpen, 
      items, 
      total,
      loading,
      toggleCart, 
      removeFromCart,
      clearCart,
      checkout,
      authenticated,
      addGuest,
      setGuestForm,
      showGuestForm,
      guestInfo,
      handleGuestInputChange,
      guestErrors,
      coupon,
      updateCartItem,

      handleCouponChange,
      applyCoupon,

      discountAmount,
      amountBeforeDiscount,
      appliedCoupon,
      ticketDiscounts,
      couponValidTickets
  } = props;
  const navigate = useNavigate();

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      let itemPrice;
      if (item.type === 'product') {
        itemPrice = item.finalPrice;
      } else {
        itemPrice = item.discount && item.discountPrice 
          ? item.discountPrice 
          : item.price;
      }
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const handleQuantityChange = (ticketId, newQuantity) => {
    if (newQuantity < 1) return;
    
    if (items.find(item => item.ticketId === itemId)) {
      updateCartItem(itemId, { quantity: newQuantity });
    } else {
      // Handle product quantity update
      updateCartItem(itemId, { quantity: newQuantity });
    }
  };

  const handleUserCheckout = () => {
    checkout(navigate);
  };

    return (
      <>
        {/* Cart Icon */}
        <div className={`cart-icon ${items.length > 0 ? 'has-items' : ''}`} onClick={toggleCart}>
          <FaShoppingCart size={24} />
          {items.length > 0 && (
            <span className="cart-count">{items.reduce((total, item) => total + item.quantity, 0)}</span>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h3>{!showGuestForm ? 'Your Cart' : 'Guest Checkout'}</h3>
            <button className="close-cart" onClick={toggleCart}>
              <IoMdClose size={24} />
            </button>
          </div>

          {loading ? (
            <LoadingIndicator />
          ) : items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : !showGuestForm ? (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.ticketId || item.productId} className="cart-item">
                    <div className="item-details">
                      <h4>{item.eventName || item.productName}</h4>
                      <p className="ticket-type">{item.ticketType || 'Product'}</p>
                      {item.type === 'product' && (
                        <p className="delivery-info">
                          {item.needsDelivery ? '🚚 Delivery' : '📍 Pickup at event'}
                        </p>
                      )}
                      <p className="ticket-price">
                        {item.type === 'product' ? (
                          item.discount ? (
                            <>
                              <span className="original-price">₦{item.price.toLocaleString()}</span>
                              <span className="discount-price">₦{item.finalPrice.toLocaleString()}</span>
                            </>
                          ) : (
                            <span>₦{item.price.toLocaleString()}</span>
                          )
                        ) : item.discount && item.discountPrice ? (
                          <>
                            <span className="original-price">₦{item.price.toLocaleString()}</span>
                            <span className="discount-price">₦{item.discountPrice.toLocaleString()}</span>
                          </>
                        ) : (
                          <span>₦{item.price.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.ticketId || item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span>{item.quantity <= (item.ticketQuantity || item.productQuantity) ? item.quantity : (item.ticketQuantity || item.productQuantity)}</span>
                        <button
                          onClick={() => handleQuantityChange(item.ticketId || item.productId, item.quantity + 1)}
                          disabled={item.quantity >= (item.ticketQuantity || item.productQuantity)}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <button
                        className="remove-item" 
                        onClick={() => removeFromCart(item.ticketId || item.productId)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>₦{(total || calculateTotal()).toLocaleString()}</span>
                </div>

                {/* coupon */}
                {authenticated && items.some(item => item.type !== 'product') &&
                <div className="cart-coupon-container">
                  <Input
                    value={coupon.code || ''}
                    type="text"
                    className={`cart-coupon ${appliedCoupon?.length > 0 && 'bg-gray'}`}
                    name="code"
                    placeholder='Coupon Code Here'
                    onInputChange={(n, v) => handleCouponChange(n, v)}
                    disabled={appliedCoupon?.length > 0 && true}
                  />
                  <button
                    className={`${appliedCoupon?.length > 0 && 'bg-gray p-black'}`}
                    disabled={appliedCoupon?.length > 0 && true}
                    onClick={applyCoupon}>{appliedCoupon?.length > 0 ? 'Applied' : 'Apply'}</button>
                </div>
                }

                {discountAmount > 0 && (
                <div className="cart-discount-info">
                  <p className='mb-0'>Coupon Applied: {appliedCoupon[0].code}</p>
                  <p className='mb-0'>Applied to Event: {items.filter((item) =>
                                                   couponValidTickets?.some((td) => td === item.ticketId))
                                                   .map((item) => item.eventName)
                                                   .join(', ')}
                  </p>
                  <p className='mb-0'>Applied to Ticket: {items.filter((item) =>
                                                   couponValidTickets?.some((td) => td === item.ticketId))
                                                   .map((item) => item.ticketType)
                                                   .join(', ')}
                  </p>
                  <p className='mb-4'>Discount: -₦{discountAmount.toLocaleString()}</p>
                </div>
                )}

                <div className="cart-actions">
                  <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
                  {authenticated ? (
                    <button className="checkout-btn" onClick={handleUserCheckout}>Checkout</button>
                  ) : (
                    <button 
                      className="checkout-btn" 
                      onClick={() => setGuestForm(true)}
                    >
                      Continue as guest
                    </button>
                  )}
                </div>
              </div>
            </>
          )
          : (
            <GuestCheckout {...props}/>
          )}
        </div>
        
        {/* Overlay */}
        {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
      </>
    );
}


class Cart extends React.PureComponent {
  componentDidMount() {
    this.props.initializeCart();
  }

  render() {
    const { 
      isOpen, 
      items, 
      total,
      loading,
      toggleCart, 
      removeFromCart,
      clearCart,
      handleCheckout,
      authenticated,
      addGuest,
      setGuestForm,
      showGuestForm,
      guestInfo,
      handleGuestInputChange,
      guestErrors,
      coupon
    } = this.props;

    return (
      <CartViewer {...this.props}/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    isOpen: state.cart.isOpen,
    items: state.cart.items,
    total: state.cart.total,
    loading: state.cart.loading,
    error: state.cart.error,
    showGuestForm: state.cart.showGuestForm,
    guestInfo: state.cart.guestInfo,
    guestErrors: state.cart.guestErrors,
    coupon: state.cart.coupon,

    discountAmount: state.cart.discountAmount,
    amountBeforeDiscount: state.cart.amountBeforeDiscount,
    appliedCoupon: state.cart.appliedCoupon,
    ticketDiscounts: state.cart.ticketDiscounts,
    couponValidTickets: state.cart.couponValidTickets
  };
};

export default connect(mapStateToProps, actions)(Cart);