import axios from 'axios';
import {
  WITHDRAWALS,
  SET_EARNINGS,
  SET_WITHDRAWN_AMOUNT,
  SET_WITHDRAWAL_LOADING,
  SET_WITHDRAWAL_COMMISSION,
  RESET_WITHDRAWAL,
  SET_WITHDRAWAL_PAGINITION
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
      const withdrawals = organizer ? data.organizerWithdrawals : data.withdrawals;

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

        withdrawals.forEach(org => {
          earnings += org.earnings || 0;
          withdrawnAmount += org.withdrawnAmount || 0;
        });

        dispatch({ type: SET_EARNINGS, payload: earnings });
        dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: withdrawnAmount });
      } else {
        dispatch({ type: SET_EARNINGS, payload: data.earnings });
        dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: data.withdrawnAmount });
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
    const { data, status } = await axios.get(`${API_URL}/withdraw/organizer/${organizerId}?page=${page}`);

    if (status === 200) {
      dispatch({ type: WITHDRAWALS, payload: data.withdrawals });
      dispatch({ type: SET_EARNINGS, payload: data.earnings });
      dispatch({ type: SET_WITHDRAWN_AMOUNT, payload: data.withdrawnAmount });
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
