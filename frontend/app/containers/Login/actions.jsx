/*
 *
 * Login actions
 *
 */

import axios from 'axios';
import { showNotification } from '../Notification/actions';

import {
  LOGIN_CHANGE,
  LOGIN_RESET,
  SET_LOGIN_LOADING,
  SET_LOGIN_FORM_ERRORS,
  SET_LOGIN_SUBMITTING,
  REMEMBER_ME,
  TWO_FA_PROMPT,
  SET_TWO_FACTOR_USER
} from './constants';
import { setAuth, clearAuth } from '../Authentication/actions';
import setToken from '../../utils/token';
import handleError from '../../utils/error';
// import { clearCart } from '../Cart/actions';
import { clearAccount } from '../Account/actions';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const loginChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: LOGIN_CHANGE,
    payload: formData
  };
};

export const rememberMeChange = () => {
  return {
    type: REMEMBER_ME
  }
}

export const twoFaPromptToggle = (v) => {
  return {
    type: TWO_FA_PROMPT,
    payload: v
  }
}

export const setTwoFaUser = (id, rememberMe) => {
  return {
    type: SET_TWO_FACTOR_USER,
    payload: {
      id,
      rememberMe
    }
  }
}

export const twoFaLogin = (code) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_LOGIN_LOADING, payload: true });
    try {
      const { id, rememberMe } = getState().login.twoFaUser;
      if (code.length > 6 || code.length < 6) {
        return dispatch(showNotification('error', 'Invalid code'))
      }
      const response = await axios.post(`${API_URL}/auth/confirm-twofa`, { code, id, rememberMe });
      const userid = response.data.user.id
      if (response.data.user.banned) {
        dispatch(showNotification('error', "Try again"));
        return
      }

      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      dispatch(setAuth());
      dispatch(showNotification('success', 'Welcome!'));

      dispatch({ type: LOGIN_RESET });
    } catch (error) {
      const title = `Please try to login again!`;
      handleError(error, dispatch, title);
      return;
    } finally {
      dispatch({ type: SET_LOGIN_SUBMITTING, payload: false });
      dispatch({ type: SET_LOGIN_LOADING, payload: false });
      return;
    }
  };
}

export const login = () => {
  return async (dispatch, getState) => {
    let user = getState().login.loginFormData;
    const rememberMe = getState().login.rememberMe

    const rules = {
      email: 'required',
      password: 'required|min:6'
    };

    const { isValid, errors } = allFieldsValidation(user, rules, {
      'required.email': 'Username or email is requried',
      'required.password': 'Password is required.',
      'min.password': 'Password must be at least 6 characters.'
    });

    if (!isValid) {
      return dispatch({ type: SET_LOGIN_FORM_ERRORS, payload: errors });
    }
    const data = {
      ...user,
      rememberMe
    }

    dispatch({ type: SET_LOGIN_SUBMITTING, payload: true });
    dispatch({ type: SET_LOGIN_LOADING, payload: true });

    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      if (response?.data?.user?.banned || response?.data?.banned) {
        dispatch(showNotification('error', "Try again"));
        return
      }

      // two fa prompt
      if (response.status === 201 && response.data.success === true) {
        dispatch(setTwoFaUser(response.data.id, response.data.rememberMe))
        return dispatch(twoFaPromptToggle(true));
      }

      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      dispatch(setAuth());
      dispatch(showNotification('success', 'Welcome!'));

      dispatch({ type: LOGIN_RESET });
    } catch (error) {
      const title = `Please try to login again!`;
      handleError(error, dispatch, title);
      return;
    } finally {
      dispatch({ type: SET_LOGIN_SUBMITTING, payload: false });
      dispatch({ type: SET_LOGIN_LOADING, payload: false });
      return;
    }
  };
};

export const googleSignin = (credential) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_LOGIN_SUBMITTING, payload: true });
      dispatch({ type: SET_LOGIN_LOADING, payload: true });
      const rememberMe = getState().login.rememberMe;
      const data = {
        ...credential,
        rememberMe
      }
      const response = await axios.post(`${API_URL}/auth/google/signin`, data);
      const userid = response.data.user.id
      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      dispatch(setAuth());
      dispatch(showNotification('success', 'Welcome!'));

      dispatch({ type: LOGIN_RESET });
    } catch (error) {
      const title = `Please try to login again!`;
      handleError(error, dispatch, title);
      return;
    } finally {
      dispatch({ type: SET_LOGIN_SUBMITTING, payload: false });
      dispatch({ type: SET_LOGIN_LOADING, payload: false });
      return;
    }
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
    dispatch(clearAuth());
    dispatch(clearAccount());

    localStorage.removeItem('token');

    // dispatch(showNotification('success', 'You have signed out!'));
  };
};
