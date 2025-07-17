/*
 *
 * ResetPassword actions
 *
 */

import axios from 'axios';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import {
  RESET_PASSWORD_CHANGE,
  RESET_PASSWORD_RESET,
  SET_RESET_PASSWORD_FORM_ERRORS,
  RESET_PASSWORD_TOKEN,
  RESET_PWD_LOADING
} from './constants';

export const resetPasswordChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: RESET_PASSWORD_CHANGE,
    payload: formData
  };
};

export const setResetPasswordToken = (token) => {
  return {
    type: RESET_PASSWORD_TOKEN,
    payload: token
  }
}

export const resetPassword = (token, navigate) => {
  return async (dispatch, getState) => {
    dispatch({ type: RESET_PWD_LOADING, payload: true })
    try {
      const rules = {
        password: 'required|min:6',
        confirmPassword: 'required|min:6|same:password'
      };
      const user = getState().resetPassword.resetFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.password': 'Password is required.',
        'min.password': 'Password must be at least 6 characters.',
        'required.confirmPassword': 'Confirm password is required.',
        'min.confirmPassword':
          'Confirm password must be at least 6 characters.',
        'same.confirmPassword':
          'Confirm password and password fields must match.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_RESET_PASSWORD_FORM_ERRORS,
          payload: errors
        });
      }

      const response = await axios.post(`${API_URL}/auth/reset/${token}`, user);
      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success == true) {
        navigate('/login');
      }

      dispatch(showNotification('success', successfulOptions.title));
      dispatch({ type: RESET_PASSWORD_RESET });
    } catch (error) {
      const title = `Please try to reset again!`;
      handleError(error, dispatch, title);
    } finally {
      dispatch({ type: RESET_PWD_LOADING, payload: false })
    }
  };
};
