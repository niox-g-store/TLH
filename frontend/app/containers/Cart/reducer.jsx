/*
 *
 * Cart reducer
 *
 */

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
  SET_GUEST_INFO,
  SHOW_GUEST_FORM,
  SET_GUEST_FORM_ERRORS,

  SELECTED_TICKETS,
  DELETE_SELECTED_TICKETS,
  SET_CART_COUPON,
  APPLY_COUPON_TO_CART
} from './constants';

import { getSelectedTicketsFromStorage, saveSelectedTicketsToStorage } from '../../utils/selectedTickets';

const initialState = {
  isOpen: false,
  tickets: [],
  items: [], // For products
  cartId: null,
  total: 0,
  loading: false,
  selectedTickets: getSelectedTicketsFromStorage(),
  error: null,
  guestInfo: {},
  showGuestForm: false,
  guestErrors: {},
  coupon: {
    code: ''
  },
  amountBeforeDiscount: 0,
  discountAmount: 0,
  appliedCoupon: null,
  ticketDiscounts: [],
  couponValidTickets: []
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPLY_COUPON_TO_CART:
      return {
        ...state,
        amountBeforeDiscount: action.payload.amountBeforeDiscount,
        discountAmount: action.payload.discountAmount,
        appliedCoupon: action.payload.appliedCoupon,
        ticketDiscounts: action.payload.ticketDiscounts,
        couponValidTickets: action.payload.couponValidTickets
      };
    case SET_CART_COUPON:
      return {
        ...state,
        coupon: {...state.coupon, ...action.payload}
      };
    case SET_GUEST_FORM_ERRORS:
      return {
        ...state,
        guestErrors: action.payload
      }
    case SHOW_GUEST_FORM:
      return {
        ...state,
        showGuestForm: !action.paylaod
      };
    case SET_GUEST_INFO:
      return {
        ...state,
        guestInfo: {...state.guestInfo, ...action.payload}
      }
    case DELETE_SELECTED_TICKETS:
      const updat = state.selectedTickets.filter(t => t !== action.payload);
      saveSelectedTicketsToStorage(updat);
      return {
        ...state,
        selectedTickets: updat
      };
    case SELECTED_TICKETS:
      const updated = [action.payload, ...state.selectedTickets];
      saveSelectedTicketsToStorage(updated);
      return {
        ...state,
        selectedTickets: updated
      };

    case TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen
      };
    case CART_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case CART_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case ADD_TO_CART:
      return {
        ...state,
        tickets: [...state.tickets, action.payload]
      };
    case ADD_PRODUCT_TO_CART:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        tickets: state.tickets.filter(item => item.ticketId !== action.payload),
        items: state.items.filter(item => item.productId !== action.payload)
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        tickets: state.tickets.map(item => 
          item.ticketId === action.payload.ticketId
            ? { ...item, ...action.payload.updates }
            : item
        ),
        items: state.items.map(item => 
          item.productId === action.payload.productId
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
    case CLEAR_CART:
      localStorage.removeItem('selectedTickets');
      return {
        ...state,
        tickets: [],
        items: [],
        total: 0,
        cartId: null,
        selectedTickets: [],
        guestInfo: {},
        guestErrors: {},
        coupon: {
          code: ''
        },
        showGuestForm: false,
        amountBeforeDiscount: 0,
        discountAmount: 0,
        appliedCoupon: null,
        ticketDiscounts: [],
        couponValidTickets: []
      };
    case SET_CART_ITEMS:
      return {
        ...state,
        tickets: action.payload.tickets || [],
        items: action.payload.items || []
      };
    case HANDLE_CART_TOTAL:
      return {
        ...state,
        total: action.payload
      };
    case SET_CART_ID:
      return {
        ...state,
        cartId: action.payload
      };
    default:
      return state;
  }
};

export default cartReducer;