import {
    ADD_SCANNED_TICKET,
    CLEAR_SCANNED_TICKETS,
    FETCH_SCANNED_TICKETS,
    LOADING,
    SHOW_SCAN_MODAL_WITH_DETAILS,
    FETCH_TICKET_DETAILS,
    SET_CODE_TO_SCAN
} from './constants';
import { showNotification } from '../Notification/actions';
import axios from 'axios';
import { API_URL } from '../../constants';
import handleError from '../../utils/error';

export const isScanLoading = (value) => {
    return {
        type: LOADING,
        payload: value
    }
}

export const showCheckInModal = (value) => {
  return {
    type: SHOW_SCAN_MODAL_WITH_DETAILS,
    payload: value
  }
}

export const setCode = (v) => {
  return {
    type: SET_CODE_TO_SCAN,
    payload: v
  }
}

export const getTicketDetails = (ticket, scanner = false) => {
  return async(dispatch, getState) => {
    dispatch(isScanLoading(true))
    try {
      const scannedTickets = getState().scan.scannedTickets;
      const foundTicket = scannedTickets.map(i => i.code)
      if (ticket.code === foundTicket) {
        handleError({ message: 'Ticket has been used' }, dispatch)
      } else {
        const ticketDetails = await axios.post(`${API_URL}/scan/ticket-details`, { code: ticket.code, scanner });
        if (ticketDetails.status === 200) {
          dispatch({
            type: FETCH_TICKET_DETAILS,
            payload: ticketDetails.data.qr
          })
          dispatch(showCheckInModal(true))
          /*if (ticketDetails.status === 200) {
            Promise.all([dispatch(showScanModal(true))]).then(() => {
              dispatch(addScannedTicket(ticket));
            });
          }*/
        }
      }
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(isScanLoading(false));
    }
  }
}

export const addScannedTicket = (ticket) => {
  return async(dispatch, getState) => {
    dispatch(showCheckInModal(false))
    dispatch(isScanLoading(true))
    try {
      const scannedTickets = getState().scan.scannedTickets;
      const foundTicket = scannedTickets.map(i => i.code)
      if (ticket.code === foundTicket) {
        handleError({ message: 'Ticket has been used' }, dispatch)
      } else {
        // get ticket details before scanning
        const verifyCode = await axios.post(`${API_URL}/scan/verify`,
          { code: ticket.code,
            scannedAt: ticket.scannedAt
          });

        dispatch({
          type: ADD_SCANNED_TICKET,
          payload: verifyCode.data.qr
        })
        dispatch(setCode(''))
        dispatch(showNotification('success', verifyCode.data.message))
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(isScanLoading(false))
    }
  }
};

export const clearScannedTickets = () => ({
  type: CLEAR_SCANNED_TICKETS
});

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