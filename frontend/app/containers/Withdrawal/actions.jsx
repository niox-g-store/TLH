import axios from 'axios';
import {
  SET_WITHDRAWAL_LOADING,
} from './constants';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';

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
