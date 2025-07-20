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
  ADD_PRODUCT_TO_CART,
  SELECTED_TICKETS,
  DELETE_SELECTED_TICKETS,
  SET_CART_COUPON,
  APPLY_COUPON_TO_CART,

  SELECTED_PRODUCTS,
  DELETE_SELECTED_PRODUCTS,
} from './constants';

import {
  getSelectedTicketsFromStorage,
  saveSelectedTicketsToStorage,
 } from '../../utils/selectedTickets';

 import {
  getSelectedProductsFromStorage,
  saveSelectedProductsToStorage
 } from '../../utils/selectedProducts';

const initialState = {
  isOpen: false,
  tickets: [],
  products: [], // For products
  cartId: null,
  total: 0,
  loading: false,
  selectedTickets: getSelectedTicketsFromStorage(),
  selectedProducts: getSelectedProductsFromStorage(),
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

    case DELETE_SELECTED_PRODUCTS:
      const sUpdat = state.selectedProducts.filter(t => t !== action.payload);
      saveSelectedProductsToStorage(sUpdat);
      return {
        ...state,
        selectedProducts: sUpdat
      };
    case SELECTED_PRODUCTS:
      const sUpdated = [action.payload, ...state.selectedProducts];
      saveSelectedProductsToStorage(sUpdated);
      return {
        ...state,
        selectedProducts: sUpdated
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
        products: [...state.products, action.payload]
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        tickets: state.tickets.filter(item => item.ticketId !== action.payload),
        products: state.products.filter(item => item.productId !== action.payload)
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        tickets: state.tickets.map(item => 
          item.ticketId === action.payload.ticketId
            ? { ...item, ...action.payload.updates }
            : item
        ),
        products: state.products.map(item => 
          item.productId === action.payload.productId
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
    case CLEAR_CART:
      localStorage.removeItem('selectedTickets');
      localStorage.removeItem('selectedProducts');
      return {
        ...state,
        tickets: [],
        products: [],
        total: 0,
        cartId: null,
        selectedTickets: [],
        selectedProducts: [],
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
        products: action.payload.products || []
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