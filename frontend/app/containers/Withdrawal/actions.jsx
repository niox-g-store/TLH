import axios from 'axios';
import {
  WITHDRAWAL,
  WITHDRAWALS,
  SET_EARNINGS,
  SET_WITHDRAWN_AMOUNT,
  SET_WITHDRAWAL_LOADING,
  SET_WITHDRAWAL_COMMISSION,
  RESET_WITHDRAWAL,
  SET_WITHDRAWAL_PAGINITION,

  SET_CAN_WITHDRAWAL_AMOUNT,
  INITIALISE_WITHDRAWAL,
  SET_WITHDRAWAL_ORGANIZER,
  CLEAR_WITHDRAWAL_ORGANIZER,
  SET_PROCESSING_WITHDRAWAL
} from './constants';
// import { setDashboardRouter } from '../Dashboard/actions';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';

export const resetWithdrawal = () => ({
  type: RESET_WITHDRAWAL
})

export const clearWithdrawOrganizer = () => ({
  type: CLEAR_WITHDRAWAL_ORGANIZER
})

export const initialiseWithdrawal = (withdrawalId, orderId = null, navigate, organizerId = null) => async (dispatch) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });
  try {
    const { data, status } = await axios.post(`${API_URL}/withdraw/initialise`, {
      withdrawalId,
      orderId,
      organizerId
    });

    if (status === 200) {
      dispatch(showNotification('success', data.message))
      dispatch({
        type: INITIALISE_WITHDRAWAL,
        payload: data.withdrawals
      })
      dispatch({
        type: SET_PROCESSING_WITHDRAWAL,
        payload: data.proccessingWithdrawals
      })
    }
  } catch (error) {
    handleError(error, dispatch)
  } finally {
    dispatch({ type: SET_WITHDRAWAL_LOADING, payload: false });
  }
};

export const fetchWithdrawals = (organizer = false, page = 1) => async (dispatch) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });
  //dispatch(setDashboardRouter('/withdrawals'))
  try {
    const url = organizer
      ? `${API_URL}/withdraw/organizers?page=${page}`
      : `${API_URL}/withdraw?page=${page}`;

    const { data, status } = await axios.get(url);

    if (status === 200) {
      const withdrawals = data.withdrawals;

      dispatch({
        type: WITHDRAWALS,
        payload: withdrawals
      });
      dispatch({
        type: SET_WITHDRAWAL_PAGINITION,
        payload: {
          pageCount: data.pageCount,
          page: data.page,
          withdrawals: data.withdrawals
        }
      })
      if (!organizer) {
        dispatch({
          type: SET_PROCESSING_WITHDRAWAL,
          payload: data.proccessingWithdrawals
        })
      }

      if (organizer) {
        let earnings = 0;
        let withdrawnAmount = 0;
        let canWithdrawAmount = 0;

        withdrawals.forEach(org => {
          earnings += org.earnings || 0;
          canWithdrawAmount += org.canWithdrawAmount
          withdrawnAmount += org.withdrawnAmount || 0;
        });

        dispatch({ type: SET_EARNINGS, payload: earnings });
        // dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: withdrawnAmount });
        dispatch({ type: SET_CAN_WITHDRAWAL_AMOUNT, payload: canWithdrawAmount });
      } else {
        dispatch({ type: SET_EARNINGS, payload: data.earnings });
        // dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: data.withdrawnAmount });
        dispatch({ type: SET_CAN_WITHDRAWAL_AMOUNT, payload: data.canWithdrawAmount })
      }
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch({ type: SET_WITHDRAWAL_LOADING, payload: false });
  }
};

export const fetchOrganizerWithdrawals = (organizerId, page = 1) => async (dispatch) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });
  try {
    let id = null;

    if (organizerId && typeof organizerId === 'object' && organizerId.organizerId) {
      id = organizerId.organizerId;
      dispatch({ type: SET_WITHDRAWAL_ORGANIZER, payload: organizerId.organizerId });
    } else {
      id  = organizerId;
    }

    const { data, status } = await axios.get(`${API_URL}/withdraw/organizer/${id}?page=${page}`);

    if (status === 200) {
      dispatch({ type: SET_PROCESSING_WITHDRAWAL, payload: data.proccessingWithdrawals });
      dispatch({ type: WITHDRAWALS, payload: data.withdrawals });
      dispatch({ type: SET_EARNINGS, payload: data.earnings });
      dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: data.withdrawnAmount });
      dispatch({ type: SET_CAN_WITHDRAWAL_AMOUNT, payload: data.canWithdrawAmount });
      dispatch({ type: SET_WITHDRAWAL_PAGINITION,
                 payload: {
                   pageCount: data.pageCount,
                   page: data.page,
                   withdrawals: data.withdrawals
                 }
      });
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch({ type: SET_WITHDRAWAL_LOADING, payload: false });
  }
};

export const getWithdrawal = (withdrawalId) => async (dispatch) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });
  try {
    const { data, status } = await axios.get(`${API_URL}/withdraw/withdrawal/${withdrawalId}`);

    if (status === 200) {
      dispatch({ type: WITHDRAWAL, payload: data });
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch({ type: SET_WITHDRAWAL_LOADING, payload: false });
  }
};

export const fetchWithdrawalsHistory = (page = 1) => async (dispatch, getState) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });
  try {
    const organizerId = getState().withdraw.organizerId || null;

    let response;
    if (organizerId) {
      response = await axios.get(`${API_URL}/withdraw/history?organizerId=${organizerId}&page=${page}`);
    } else {
      response = await axios.get(`${API_URL}/withdraw/history?page=${page}`);
    }
    const { data, status } = response;

    if (status === 200) {
      dispatch({ type: WITHDRAWALS, payload: data.withdrawals });
      dispatch({ type: SET_WITHDRAWAL_PAGINITION,
                 payload: {
                   pageCount: data.pageCount,
                   page: data.page,
                   withdrawals: data.withdrawals
                 }
      });
      dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: data.withdrawnAmount });
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch({ type: SET_WITHDRAWAL_LOADING, payload: false });
  }
};

