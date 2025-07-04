import axios from 'axios';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

import {
  TICKET_CHANGE,
  SET_TICKET_FORM_ERRORS,
  RESET_TICKET_FORM,
  ADD_TICKET,
  SET_TICKETS_LOADING,
  SET_EVENT_TICKET
} from './constants';

/**
 * Update ticket form fields
 */
export const ticketChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: TICKET_CHANGE,
    payload: formData
  };
};


/**
 * Add a new ticket
 */
export const addTicket = (navigate) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_TICKETS_LOADING, payload: true });

    try {
      const ticketForm = getState().ticket.ticketForm;

      const rules = {
        type: 'required',
        event: 'required',
        user: 'required',
        price: 'required|numeric',
        expireDate: 'required|date',
      };

      const { isValid, errors } = allFieldsValidation(ticketForm, rules, {
        'required.type': 'Ticket type is required.',
        'required.event': 'Event ID is required.',
        'required.user': 'User ID is required.',
        'required.price': 'Price is required.',
        'numeric.price': 'Price must be a number.',
        'required.expireDate': 'Expire date is required.',
        'date.expireDate': 'Expire date must be a valid date.',
      });

      if (!isValid) {
        return dispatch({ type: SET_TICKET_FORM_ERRORS, payload: errors });
      }

      const response = await axios.post(`${API_URL}/ticket/add`, ticketForm);

      if (response.data.success === true) {
        dispatch({ type: ADD_TICKET, payload: response.data.ticket });
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: RESET_TICKET_FORM });
        if (navigate) dispatch(navigate(-1));
      }
    } catch (error) {
      handleError(error, dispatch, 'Error adding ticket, try agian!');
    } finally {
      dispatch({ type: SET_TICKETS_LOADING, payload: false });
    }
  };
};
