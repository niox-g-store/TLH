import {
  SET_IS_LOADING,
  FETCH_ORDER,
  FETCH_ORDERS,
  FETCH_USER_ORDERS,
  SET_DELETE_ORDER,
  SET_SECOND_DISCOUNT,

  UPDATE_ORDER_PRODUCT_STATUS
} from './constants';
import axios from 'axios';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';

export const setSecondDiscount = (v) => {
  return {
    type: SET_SECOND_DISCOUNT,
    payload: v
  }
}

export const setDeleteOrderVisibility = (v) => {
  return {
    type: SET_DELETE_ORDER,
    payload: v
  }
}

export const setOrderLoading = (v) => {
  return {
    type: SET_IS_LOADING,
    payload: v
  }
}

export const updateOrderProductStatus = (orderId, status) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const response = await axios.put(`${API_URL}/order/${orderId}/product-status`, { status });
      
      if (response.data.success) {
        dispatch({
          type: UPDATE_ORDER_PRODUCT_STATUS,
          payload: { orderId, status }
        });
        dispatch(showNotification('success', `Order status updated to ${status}`));
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchOrders = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true))
      try {
        const orders = await axios.get(`${API_URL}/order/all_orders`)
        if (orders.status === 200 && orders.data.orders) {
            dispatch({
                type: FETCH_ORDERS,
                payload: orders.data.orders
            })
        }
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setOrderLoading(false))
    }
  }
}

export const userOrders = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true))
      try {
        const orders = await axios.get(`${API_URL}/order/me`);
        if (orders.status === 200 && orders.data.orders) {
            dispatch({
                type: FETCH_USER_ORDERS,
                payload: orders.data.orders
            })
        }
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setOrderLoading(false))
    }
  }
}


export const downloadInvoice = (invoice, orderId, product=false, productData) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      if (product) {
        const response = await axios.post(
          `${API_URL}/order/invoice-download`,
          { orderId, productData },
          { responseType: 'blob' } // important!
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `TheLinkHangout_${orderId}_product_invoice.pdf`;
        link.click();
      } else {
        const response = await axios.post(
          `${API_URL}/order/invoice-download`,
          { invoice },
          { responseType: 'blob' } // important!
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `TheLinkHangout_${orderId}_invoice.pdf`;
        link.click();
    }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchOrder = (id) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const order = await axios.get(`${API_URL}/order/id/${id}`);
      if (order.status === 200 && order.data.order) {
          dispatch({
              type: FETCH_ORDER,
              payload: { order: order.data.order, invoice: order.data.invoice}
          })
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false))
    }
  }
}

export const deleteOrder = (id, navigate) => {
  return async(dispatch) => {
    dispatch(setOrderLoading(true))
    try {
      const order = await axios.delete(`${API_URL}/order/id/${id}`);
      if (order.status === 200) {
        dispatch(setDeleteOrderVisibility(false))
        dispatch(showNotification('success', order.data.message))
        navigate(-1)
      }
    } catch {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false))
    }
  }
}
