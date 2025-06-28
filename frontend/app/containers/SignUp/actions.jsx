import axios from 'axios';

import { API_URL } from '../../constants';
import { allFieldsValidation } from '../../utils/validation';
import { setAuth } from '../Authentication/actions';
import setToken from '../../utils/token';
import handleError from '../../utils/error';
import { showNotification } from '../Notification/actions';

import {
  SIGNUP_CHANGE,
  SIGNUP_RESET,
  SET_SIGNUP_LOADING,
  SET_SIGNUP_SUBMITTING,
  SUBSCRIBE_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  COMPARE_PASSWORD,
  ORGANIZER_SIGNUP_CHANGE
} from './constants';

export const signupChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: SIGNUP_CHANGE,
    payload: formData
  };
};

export const organizerSignupChange = (n, v) => {
  let formData = {};
  formData[n] = v
  return {
    type: ORGANIZER_SIGNUP_CHANGE,
    payload: formData
  }
}

export const subscribeChange = () => {
  return {
    type: SUBSCRIBE_CHANGE
  };
};

export const comparePasswords = (password, confirmPassword) => {
    return (dispatch) => {
        if (password !== confirmPassword) {
            dispatch({
                type: COMPARE_PASSWORD,
                payload: { confirmPassword: "Password don't match" }
            })
        } else {
            dispatch({
                type: COMPARE_PASSWORD,
                payload: { confirmPassword: "" }
            })
        }
    }
}

export const signupReset = () => {
    return {
        type: SIGNUP_RESET
    }
}


export const organizerSignupSubmit = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|min:6',
        companyName: 'required',
        userName: 'required',
        confirmPassword: 'required|confirmed:password',
        phoneNumber: 'required'
      };

      const newUser = getState().signup.organizerSignupFormData;
      const isSubscribed = getState().signup.isSubscribed;

      const { isValid, errors } = allFieldsValidation(newUser, rules, {
        'required.email': 'Email is required.',
        'required.companyName': 'Company name is required.',
        'required.userName': 'User name is required',
        'required.password': 'Password is required.',
        'required.confirmPassword': "Password don't match",
        'required.phoneNumber': "Phone Number is required"
      });

      if (!isValid) {
        return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
      }

      dispatch({ type: SET_SIGNUP_SUBMITTING, payload: true });
      dispatch({ type: SET_SIGNUP_LOADING, payload: true });

      const user = {
        isSubscribed,
        ...newUser
      };
      const response = await axios.post(`${API_URL}/auth/register/organizer`, user);
      const userid = response.data.user.id

      const successfulOptions = {
        title: `You have signed up successfully!`,
      };

      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      dispatch(setAuth());
      dispatch(showNotification('success', successfulOptions.title));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      const title = `Please try to signup again!`;
      handleError(error, dispatch, title);
      return;
    } finally {
      dispatch({ type: SET_SIGNUP_SUBMITTING, payload: false });
      dispatch({ type: SET_SIGNUP_LOADING, payload: false });
      return;
    }
  }
}


export const signUpSubmit = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|min:6',
        name: 'required',
        userName: 'required',
        confirmPassword: 'required|confirmed:password',
      };

      const newUser = getState().signup.signupFormData;
      const isSubscribed = getState().signup.isSubscribed;

      const { isValid, errors } = allFieldsValidation(newUser, rules, {
        'required.email': 'Email is required.',
        'required.name': 'Name is required.',
        'required.userName': 'User name is required',
        'required.password': 'Password is required.',
        'required.confirmPassword': "Password don't match"
      });

      if (!isValid) {
        return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
      }

      dispatch({ type: SET_SIGNUP_SUBMITTING, payload: true });
      dispatch({ type: SET_SIGNUP_LOADING, payload: true });

      const user = {
        isSubscribed,
        ...newUser
      };
      const response = await axios.post(`${API_URL}/auth/register`, user);
      const userid = response.data.user.id

      const successfulOptions = {
        title: `You have signed up successfully!`,
      };

      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      dispatch(setAuth());
      dispatch(showNotification('success', successfulOptions.title));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      const title = `Please try to signup again!`;
      handleError(error, dispatch, title);
      return;
    } finally {
      dispatch({ type: SET_SIGNUP_SUBMITTING, payload: false });
      dispatch({ type: SET_SIGNUP_LOADING, payload: false });
      return;
    }
  };
};

