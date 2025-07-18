/*
 *
 * Cart actions
 *
 */

import axios from 'axios';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import { allFieldsValidation } from '../../utils/validation';
import handleError from '../../utils/error';
import { payStackHelper } from '../../components/Paystack';
import { ROLES } from '../../constants';

import {
  TOGGLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
  SET_CART_ITEMS,
  CART_LOADING,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CART_ERROR,
  CART_ID,
  SET_GUEST_INFO,
  SELECTED_TICKETS,
  DELETE_SELECTED_TICKETS,
  SET_GUEST_FORM_ERRORS,
  ADD_PRODUCT_TO_CART
  SHOW_GUEST_FORM,
  SET_CART_COUPON,
  APPLY_COUPON_TO_CART
} from './constants';
import { ticketStatusChecker } from '../Ticket/actions';
// Add product to cart
export const addProductToCart = (item) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const { items } = getState().cart;
      
      // Check if this product is already in the cart
      const existingItem = items.find(cartItem => cartItem.productId === item.productId);
      if (existingItem) {
        dispatch(showNotification('info', 'This product is already in your cart'));
        dispatch(toggleCart());
        return;
      }
      
      const cartId = localStorage.getItem(CART_ID);
      let response;
      
      if (cartId) {
        response = await axios.put(`${API_URL}/cart/${cartId}/add-product`, { item });
      } else {
        response = await axios.post(`${API_URL}/cart/add-product`, { item });
        if (response.data.cartId) {
          dispatch(setCartId(response.data.cartId));
        }
      }
      
      if (response.data.cart) {
        dispatch({
          type: SET_CART_ITEMS,
          payload: {
            tickets: response.data.cart.tickets || [],
            items: response.data.cart.items || []
          }
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
      
      dispatch(toggleCart());
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to add product to cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Toggle cart visibility
export const toggleCart = () => {
  return {
    type: TOGGLE_CART
  };
};

export const handleCouponChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: SET_CART_COUPON,
    payload: formData
  }
}

export const handleGuestInputChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: SET_GUEST_INFO,
    payload: formData
  }
}

// Set cart loading state
export const setCartLoading = (loading) => {
  return {
    type: CART_LOADING,
    payload: loading
  };
};

// Set cart error
export const setCartError = (error) => {
  return {
    type: CART_ERROR,
    payload: error
  };
};

// Set guest information
export const setGuestInfo = (guestInfo) => {
  return {
    type: SET_GUEST_INFO,
    payload: guestInfo
  };
};

// Set cart ID in localStorage and state
export const setCartId = cartId => {
  return (dispatch) => {
    localStorage.setItem(CART_ID, cartId);
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const setGuestForm = (v) => {
  return {
    type: SHOW_GUEST_FORM,
    payload: v
  }
}

export const calculateCouponDiscount = (coupon) => {
  return async (dispatch, getState) => {
    dispatch(setCartLoading(true))
    try {
      const state = getState();
      const cart = state.cart;
      const cartItems = [...cart.items];

      let originalTotal = 0;
      let discountAmount = 0;

      // Get correct original total (respecting discounts)
      cartItems.forEach(item => {
        const price = item.discount ? item.discountPrice : item.price;
        const quantity = item.quantity || 1;
        originalTotal += price * quantity;
      });

      if (coupon.appliesTo === 'One') {
        const matchableTicketIds = coupon.ticket?.map(id => id.toString()) || [];
        const match = cartItems.find(item =>
          matchableTicketIds.includes(item.ticketId?.toString())
        );

        if (match) {
          const price = match.discount ? match.discountPrice : match.price;
          const quantity = match.quantity || 1;
          const totalForItem = price * quantity;

          if (coupon.type === 'Fixed') {
            discountAmount = Math.min(coupon.amount, totalForItem);
          } else if (coupon.type === 'Percentage') {
            discountAmount = (coupon.percentage / 100) * totalForItem;
          }
        }

      } else if (coupon.appliesTo === 'Multiple') {
        const matchableTicketIds = coupon.ticket?.map(id => id.toString()) || [];

        cartItems.forEach(item => {
          const matches = matchableTicketIds.length === 0 ||
            matchableTicketIds.includes(item.ticketId?.toString());

          if (matches) {
            const price = item.discount ? item.discountPrice : item.price;
            const quantity = item.quantity || 1;
            const itemTotal = price * quantity;

            if (coupon.type === 'Fixed') {
              discountAmount += Math.min(coupon.amount, itemTotal);
              discountAmount *= quantity
            } else if (coupon.type === 'Percentage') {
              discountAmount += (coupon.percentage / 100) * itemTotal;
            }
          }
        });
      }

      const finalAmount = Math.max(originalTotal - discountAmount, 0);
      // update cart total with finalAmount, cartItems.discountPrice should be updated to discountAmount for the coupon.ticket === cartItems.ticketId
      // after updating cart, then disoatch to HANDLE_CART_TOTAL with the new payload as finalAmount
      const cartId = getState().cart.cartId;

      // build ticket discounts to send
      const ticketDiscounts = cartItems.map(item => {
      const ticketId = item.ticketId;
      let discountPrice = item.price;
  
      if (coupon.ticket?.includes(ticketId)) {
        if (coupon.type === 'Fixed') {
          discountPrice = item.price - Math.min(coupon.amount, item.price);
        } else if (coupon.type === 'Percentage') {
          discountPrice = item.price - (coupon.percentage / 100) * item.price;
        }
      }

      return {
        ticketId,
        discountPrice: Math.round(discountPrice)
      };
      });


      // update cart in backend
      /*await axios.put(`${API_URL}/cart/${cartId}/apply-coupon`, {
        finalAmount: Math.round(finalAmount),
        discountAmount: Math.round(discountAmount),
        couponCode: coupon.code,
        ticketDiscounts
      });*/

      // update redux store
      dispatch({
        type: HANDLE_CART_TOTAL,
        payload: Math.round(finalAmount)
      });

      dispatch({
        type: APPLY_COUPON_TO_CART,
        payload: {
          amountBeforeDiscount: originalTotal,
          discountAmount: Math.round(discountAmount),
          appliedCoupon: [coupon],
          ticketDiscounts,
          couponValidTickets: coupon.ticket
        }
      });
      dispatch(showNotification('success', 'Discount applied to cart.'));
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(setCartLoading(false))
    }
  }
}



export const applyCoupon = () => {
  return async(dispatch, getState) => {
    dispatch(setCartLoading(true));
    try {
      const cart = getState().cart;
      const coupon = cart.coupon;
      const cartItems = cart.items;
      if (coupon?.code?.length < 1) {
        return handleError({ message: 'Enter a valid coupon' }, dispatch)
      }
      const code = coupon.code;
      const tickets = cartItems.map(item => item.ticketId);
      const requestData = {
        code,
        tickets,
      }
      // confirm coupon
      const response = await axios.post(`${API_URL}/coupon/validate`, requestData);
      if (response.status === 200) {
        const data = response.data
        dispatch(calculateCouponDiscount(data))
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setCartLoading(false));
    }
  }
}

// Initialize cart from database using cart ID from localStorage
export const initializeCart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      const cartId = localStorage.getItem(CART_ID);
      
      if (cartId) {
        // set cart id to state if it's null
        if (!getState().cart.cartId) { dispatch(setCartId(cartId)) }
        const response = await axios.get(`${API_URL}/cart/${cartId}`);
        
        if (response.data.cart) {
          dispatch({
            type: SET_CART_ITEMS,
            payload: response.data.cart.tickets || []
              tickets: response.data.cart.tickets || [],
              items: response.data.cart.items || []
          dispatch({
            type: HANDLE_CART_TOTAL,
            payload: response.data.cart.total || 0
          });
        }
      }
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to initialize cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const addGuest = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setCartLoading(true))
    try {
      const { name, email } = getState().cart.guestInfo;
      const cart = getState().cart;
      const { eventId, ticketId, } = cart.items[0]
      const rules = {
        name: 'required',
        email: 'required',
      }
      const guestForm = {
        name,
        email,
        eventId,
        ticketId
      }
      const { isValid, errors } = allFieldsValidation(guestForm, rules, {
       'required.name': 'Name is required.',
        'required.email': 'Email is required.',
      })
      if (!isValid) {
        return dispatch({ type: SET_GUEST_FORM_ERRORS, payload: errors });
      }
      // add guest
      const guest = await axios.post(`${API_URL}/guest/add`, guestForm);
      if (guest.status === 200) {
        Promise.all([]).then(() => {
          dispatch(checkout(navigate, guest.data.guest));
        });
      }
    } catch (error) {
      dispatch(handleError(error, 'Error checking out as guest! Try again later'))
    } finally {
      dispatch(setCartLoading(false))
    }
  }
};

// Add item to cart
export const addToCart = (item) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));

      const { authenticated } = getState().authentication;
      
      const { tickets } = getState().cart;
      const user = getState().account.user || {}
      
      // Check if user is guest and already has an item in cart
      if (!authenticated && tickets.length > 0) {
        dispatch(showNotification('info', 'As a guest, you can only add one ticket. Please sign in to add more.'));
        dispatch(toggleCart());
        return;
      }
      
      // Check if this ticket is already in the cart
      const existingItem = tickets.find(cartItem => cartItem.ticketId === item.ticketId);
      if (existingItem) {
        dispatch(showNotification('info', 'This ticket is already in your cart'));
        dispatch(toggleCart());
        return;
      }
      
      const cartId = localStorage.getItem(CART_ID);
      const cartItem = {
        ticketId: item.ticketId,
        eventId: item.eventId,
        eventName: item.eventName,
        ticketType: item.ticketType,
        price: item.price,
        discount: item.discount || false,
        discountPrice: item.discountPrice || 0,
        discountAmount: item.discount ? item.price - item.discountPrice : 0,
        quantity: 1,
        ticketQuantity: item.ticketQuantity
      };
      let response;
      
      if (cartId) {
        response = await axios.put(`${API_URL}/cart/${cartId}/add`, { item: cartItem });
      } else {
        response = await axios.post(`${API_URL}/cart/add`, { item: cartItem, user });
        if (response.data.cartId) {
          dispatch(setCartId(response.data.cartId));
        }
      }
      
      if (response.data.cart) {
        dispatch({
          type: SELECTED_TICKETS,
          payload: cartItem.ticketId
        })
        dispatch({
          type: SET_CART_ITEMS,
          payload: {
            tickets: response.data.cart.tickets || [],
            items: response.data.cart.items || []
          }
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
      
      dispatch(toggleCart());
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to add item to cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Remove item from cart
export const removeFromCart = (ticketId) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const cartId = localStorage.getItem(CART_ID);
      
      if (!cartId) {
        throw new Error('No cart found');
      }
      
      const response = await axios.put(`${API_URL}/cart/${cartId}/remove`, { ticketId });
      
      if (response.data.cart) {
        if (response.data.cart.tickets.length === 0) {
            dispatch(clearCart());
        }

        dispatch({
          type: DELETE_SELECTED_TICKETS,
          payload: ticketId
        })
        dispatch({
          type: SET_CART_ITEMS,
          payload: {
            tickets: response.data.cart.tickets || [],
            items: response.data.cart.items || []
          }
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
      
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to remove item from cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Update cart item quantity
export const updateCartItem = (ticketId, updates) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const { authenticated } = getState().authentication;
      
      // If not authenticated, don't allow quantity changes
      if (!authenticated && updates.quantity > 1) {
        dispatch(showNotification('info', 'Please sign in to increase ticket quantity'));
        return;
      }
      
      const cartId = localStorage.getItem(CART_ID);
      
      if (!cartId) {
        throw new Error('No cart found');
      }
      
      const response = await axios.put(`${API_URL}/cart/${cartId}/update`, { 
        ticketId, 
        updates 
      });
      
      if (response.data.cart) {
        dispatch({
          type: SET_CART_ITEMS,
          payload: {
            tickets: response.data.cart.tickets || [],
            items: response.data.cart.items || []
          }
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to update cart item'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Clear cart
export const clearCart = () => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));
      
      /*const cartId = localStorage.getItem(CART_ID);
      
      if (cartId) {
        await axios.delete(`${API_URL}/cart/${cartId}`);
      }*/
      
      localStorage.removeItem(CART_ID);
      
      dispatch({
        type: CLEAR_CART
      });
      
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to clear cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const checkout = (navigate, guest=null) => {
  return async (dispatch, getState) => {
    dispatch(setCartLoading(true));
    try {
      let name, email, _id;
      if (guest) {
        email = guest.email
        name = guest.name
        _id = guest._id
      }
      const user = getState().account.user;
      const cart = getState().cart;
      const cartItems = cart.items || [];
      const ticketIds = cartItems.map(item => item.ticketId);
      const eventIds = cartItems.map(item => item.eventId);
      const price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountPrice = cartItems.reduce((sum, item) => sum + item.discountAmount, 0);
      const { cartId, total } = cart
      const userEmail = user.email
      const userId = user._id
      let user_name;
      if (user.role === ROLES.Organizer) {
        user_name = user.companyName
      } else {
        user_name = user.name
      }
      dispatch(toggleCart());
      dispatch(clearCart());

      // before creating an order, check if every ticket in the db is
      // active or the quantity is greater than 0
      const checkTIcketStatus = await ticketStatusChecker(cartId);
      if (!checkTIcketStatus) {
        throw new Error('Cannot buy ticket at this time, try again!!')
      }

      // here we need to update the cart before calling paystack if "appliedCoupon" has been applied
      // then update the cart.items.discountPrice to be the new dicountPrice of applied Coupon
      // update the cart.items.tickets.coupon to applied Coupon
      const finalAmount = cart.total;
      const discountAmount = cart.discountAmount;
      const couponValidTickets = cart.couponValidTickets;
      const appliedCoupon = cart.appliedCoupon
      if (appliedCoupon?.length > 0) {
        await axios.put(`${API_URL}/cart/${cartId}/apply-coupon`, {
          finalAmount: Math.round(finalAmount),
          discountAmount: Math.round(discountAmount),
          coupon: appliedCoupon[0],
          couponValidTickets
        });
      }

      if (total === 0) { // free ticket
        dispatch(setCartLoading(true));
        const emptyOrder = await axios.post(`${API_URL}/order/add`, {
          cart: cartId,
          user: { email: userEmail, name: user_name, _id: userId},
          guest: email && name && _id ? { email, name, _id } : null,
          events: eventIds,
          tickets: ticketIds,
          finalAmount: total,
          discountPrice: discountPrice,
          amountBeforeDiscount: price,
          billingEmail: email !== undefined || null ? email : userEmail,
        });
        if (emptyOrder.status === 200) {
            const response = await axios.put(`${API_URL}/order/edit/order`, {
              orderId: emptyOrder.data.order._id,
              status: true,
              guest: email && name && _id ? { email, name, _id } : null,
            });
            if (response && response.status === 200) {
              // free ticket add order, mark order as paid, send user to success page
              navigate(`/order/success/${name ? 'guest-' + response.data.order._id : response.data.order._id}`)
              dispatch(setCartLoading(false));
              return;
            }
        }

      }


      const ps = await payStackHelper({
        cart: cartId,
        user: { email: userEmail, name: user_name, _id: userId},
        guest: { email, name, _id },
        events: eventIds,
        tickets: ticketIds,
        finalAmount: total,
        discountPrice: discountPrice,
        amountBeforeDiscount: price,
        coupon: appliedCoupon ? appliedCoupon[0] : null,
        billingEmail: email !== undefined || null ? email : userEmail,
      }, dispatch)

      if (ps && ps.status === 200) {
        // payment successful
        // redirect to confirmation page
        navigate(`/order/success/${name ? 'guest-' + ps.data.order._id : ps.data.order._id}`)
      }
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(setCartLoading(false));
    }
  }
}