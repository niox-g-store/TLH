import {
    ADD_SCANNED_TICKET,
    CLEAR_SCANNED_TICKETS,
    FETCH_SCANNED_TICKETS,
    LOADING
} from './constants';
import { showNotification } from '../Notification/actions';
import axios from 'axios';
import { API_URL } from '../../constants';
import handleError from '../../utils/error';

export const addScannedTicket = (ticket) => ({
  type: ADD_SCANNED_TICKET,
  payload: ticket
});

export const clearScannedTickets = () => ({
  type: CLEAR_SCANNED_TICKETS
});

export const isScanLoading = (value) => {
    return {
        type: LOADING,
        payload: value
    }
}

export const fetchScannedTicket = () => {
  return async (dispatch) => {
    dispatch(isScanLoading(true));
    try {
      const response = await axios.get(`${API_URL}/scan/used`);
      dispatch({
        type: FETCH_SCANNED_TICKETS,
        payload: response.data.qrCodes
      });
    } catch (error) {
      handleError(error, dispatch, 'Failed to fetch scanned tickets');
    } finally {
      dispatch(isScanLoading(false));
    }
  };
};