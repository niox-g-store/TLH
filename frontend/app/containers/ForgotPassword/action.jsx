/*
 *
 * ForgotPassword actions
 *
 */

import axios from 'axios';
import { showNotification } from '../Notification/actions';

import {
  FORGOT_PASSWORD_CHANGE,
  FORGOT_PASSWORD_RESET,
  SET_FORGOT_PASSWORD_FORM_ERRORS
} from './constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const forgotPasswordChange = (name, value) => {
  return {
    type: FORGOT_PASSWORD_CHANGE,
    payload: value
  };
};

export const forgotPassowrd = (navigate) => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email'
      };

      const user = getState().forgotPassword.forgotFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.email': 'Email is required.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_FORGOT_PASSWORD_FORM_ERRORS,
          payload: errors
        });
      }

      const response = await axios.post(`${API_URL}/auth/forgot`, user);
      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        navigate('/login');
      }
      dispatch(showNotification('success', successfulOptions.title));

      dispatch({ type: FORGOT_PASSWORD_RESET });
    } catch (error) {
      const title = `Please try again!`;
      handleError(error, dispatch, title);
    }
  };
};
