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

  SET_CAN_WITHDRAWAL_AMOUNT
} from './constants';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';

export const resetWithdrawal = () => ({
  type: RESET_WITHDRAWAL
})

export const initialiseWithdrawal = (withdrawalId, orderId, navigate, organizerId = null) => async (dispatch) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });

  try {
    const { data, status } = await axios.post(`${API_URL}/withdraw/initialise`, {
      withdrawalId,
      orderId,
      organizerId
    });

    if (status === 200) {
      dispatch(showNotification('success', data.message))
      navigate(-1);
    }
  } catch (error) {
    handleError(error, dispatch)
  } finally {
    dispatch({ type: SET_WITHDRAWAL_LOADING, payload: false });
  }
};

export const fetchWithdrawals = (organizer = false, page = 1) => async (dispatch) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });

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
  console.log(organizerId)
  try {
    const { data, status } = await axios.get(`${API_URL}/withdraw/organizer/${organizerId}?page=${page}`);

    if (status === 200) {
      dispatch({ type: WITHDRAWALS, payload: data.withdrawals });
      dispatch({ type: SET_EARNINGS, payload: data.earnings });
      dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: data.withdrawnAmount });
      dispatch({ type: SET_CAN_WITHDRAWAL_AMOUNT, payload: data.canWithdrawAmount });
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

export const fetchWithdrawalsHistory = (userId, page = 1) => async (dispatch) => {
  dispatch({ type: SET_WITHDRAWAL_LOADING, payload: true });

  try {
    const { data, status } = await axios.get(`${API_URL}/withdraw/history?userId=${userId}&page=${page}`);

    if (status === 200) {
      dispatch({ type: WITHDRAWALS, payload: data.withdrawals });
      dispatch({ type: SET_WITHDRAWAL_PAGINATED, payload: data.paginated });
      dispatch({ type: SET_WITHDRAWAL_PAGE, payload: page });
      dispatch({ type: SET_WITHDRAWAL_PAGE_COUNT, payload: data.pageCount });
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch({ type: SET_WITHDRAWAL_LOADING, payload: false });
  }
};

