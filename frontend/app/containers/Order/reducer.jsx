import {
  FETCH_ORDER,
  FETCH_ORDERS,
  SET_IS_LOADING,
  FETCH_USER_ORDERS,
  SET_DELETE_ORDER,
  SET_SECOND_DISCOUNT,
  UPDATE_ORDER_PRODUCT_STATUS
} from './constants';

const initialState = {
  order: {},
  orders: [],
  userOrders: [],
  deleteOrderVisibility: false,
  isLoading: false,
  secondDiscount: 0,
  invoice: []
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ORDER_PRODUCT_STATUS:
      return {
        ...state,
        order: state.order._id === action.payload.orderId 
          ? { ...state.order, productStatus: action.payload.status }
          : state.order
      };
    case SET_SECOND_DISCOUNT:
      return {
        ...state,
        secondDiscount: action.payload
      };
    case SET_DELETE_ORDER:
      return {
        ...state,
        deleteOrderVisibility: action.payload
      }
    case FETCH_ORDER:
      return {
        ...state,
        order: action.payload.order,
        invoice: action.payload.invoice
      }
    case FETCH_USER_ORDERS:
      return {
        ...state,
        userOrders: action.payload
      }
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
};

export default ordersReducer;

