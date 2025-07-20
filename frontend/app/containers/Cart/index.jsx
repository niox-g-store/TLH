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
      tickets,
      products,
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
      couponValidTickets,
  } = props;
  const navigate = useNavigate();

  const allItems = [...tickets, ...products];
  const findNeedsDelivery = products.filter((p) => p.needsDelivery)
  let findDeliveryFee = 0;
  findNeedsDelivery.map((i) => {
    findDeliveryFee += i.deliveryInfo.address.deliveryFee
  })

  const calculateTotal = () => {
    return allItems.reduce((total, item) => {
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

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    if (allItems.find(item => item.ticketId === itemId)) {
      updateCartItem(itemId, null, { quantity: newQuantity });
    } else {
      // Handle product quantity update
      updateCartItem(null, itemId, { quantity: newQuantity });
    }
  };

  const handleUserCheckout = () => {
    checkout(navigate);
  };

    return (
      <>
        {/* Cart Icon */}
        <div className={`cart-icon ${allItems.length > 0 ? 'has-items' : ''}`} onClick={toggleCart}>
          <FaShoppingCart size={24} />
          {allItems.length > 0 && (
            <span className="cart-count">{allItems.reduce((total, item) => total + item.quantity, 0)}</span>
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
          ) : allItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : !showGuestForm ? (
            <>
              <div className="cart-items">
                {allItems.map((item) => (
                  <div key={item.ticketId || item.productId} className="cart-item">
                    <div className="item-details">
                      <h4>{item.eventName || item.productName}</h4>
                      <p className="ticket-type">{item.ticketType || 'Product'}</p>
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
                      {item.type === 'product' && 
                        item?.needsDelivery ?
                          (
                            <>
                            <h5 className="mt-3 delivery-info">🚚 Delivery Information</h5>
                              <p className='mb-0 mt-3'>{item.deliveryInfo.name}</p>
                              <p className='mb-0 mt-0'>{item.deliveryInfo.email}</p>
                              <p className='mb-0 mt-0'>{item.deliveryInfo.phoneNumber}</p>
                              <p className='mb-0 mt-0'>{item.deliveryInfo.address.street}</p>
                              <p className='mb-0 mt-0'>{item.deliveryInfo.address.city}</p>
                              <p className='mb-0 mt-0'>{item.deliveryInfo.address.state}</p>
                              <p className='mb-0 mt-0'>{item.deliveryInfo.address.island ? "Island" : "Mainland"}</p>
                            </>
                          ) : (
                            <p className="delivery-info">
                              📍 Pickup at event
                            </p>
                          )
                      }
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
                        onClick={() => {
                          item.type === 'product' ?
                            removeFromCart(null, item.productId)
                          :
                            removeFromCart(item.ticketId, null)
                          }
                        }
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span><span>₦{(total || calculateTotal()).toLocaleString()}</span>
                  <br />
                  {findDeliveryFee > 0 && <p>Delivery fee: {findDeliveryFee}</p>}
                </div>

                {/* coupon */}
                {authenticated && tickets.length > 0 &&
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
                  <p className='mb-0'>Applied to Event: {tickets.filter((item) =>
                                                   couponValidTickets?.some((td) => td === item.ticketId))
                                                   .map((item) => item.eventName)
                                                   .join(', ')}
                  </p>
                  <p className='mb-0'>Applied to Ticket: {tickets.filter((item) =>
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
    tickets: state.cart.tickets,
    products: state.cart.products,
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