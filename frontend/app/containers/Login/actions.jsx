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
  REMEMBER_ME
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

export const login = () => {
  return async (dispatch, getState) => {
    let user = getState().login.loginFormData;

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

    dispatch({ type: SET_LOGIN_SUBMITTING, payload: true });
    dispatch({ type: SET_LOGIN_LOADING, payload: true });

    try {
      const response = await axios.post(`${API_URL}/auth/login`, user);
      const userid = response.data.user.id

      const name = response.data.user.name;

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
                                     
      const response = await axios.post(`${API_URL}/auth/google/signin`, credential);
      const userid = response.data.user.id

      const sm = getState().currency;
      const default_currency = sm.select_currency.length > 0 ? sm.select_currency : sm.default_currency

      // try and fetch currency of user
      const fetchUserCurrency = await axios.get(`${API_URL}/currency/get_currency/${userid}`)
      if (fetchUserCurrency.status === 200) {
        localStorage.setItem('select_currency', fetchUserCurrency.data.currency[0].currency)
      } else {
        // if no currency found create currency for user
        // chcek if localStorage.getItem('select_currency) exists
        // if it doesn't use default_currency for user currency

        const lSCurrency = localStorage.getItem('select_currency');

        const userCurrency = lSCurrency ? lSCurrency : default_currency[0]
        const currencyResponse = await axios.post(`${API_URL}/currency/add`,
          {
            userId: userid,
            currency: userCurrency
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )

        if (currencyResponse.status === 200) {
          localStorage.setItem('select_currency', userCurrency);
        }
      }
      const firstName = response.data.user.firstName;
      const successfulOptions = {
        title: `Hey${firstName ? ` ${firstName}` : ''}, Welcome Back!`,
        position: 'tr',
        autoDismiss: 1
      };

      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      dispatch(setAuth());
      dispatch(showNotification('success', 'Welcome Back!'));

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

    dispatch(showNotification('success', 'You have signed out!'));
    //dispatch(clearCart());
  };
};
