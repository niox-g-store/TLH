/*
 *
 * Account actions
 *
 */

import axios from 'axios';

import {
  ACCOUNT_CHANGE,
  FETCH_PROFILE,
  CLEAR_ACCOUNT,
  SET_PROFILE_LOADING,

  CREATE_BANK,
  FETCH_BANK,
  RESET_BANK,
  DELETE_BANK,

  SET_BANK_FORM_ERROR,
  RESET_BANK_FORM_ERROR,
  SET_PROFILE_EDIT_ERRORS,

  PASSWORD_CHANGE,
  SET_TWO_FACTOR,
  SET_RESET_PASSWORD_FORM_ERRORS,
  RESET_PASSWORD_RESET
} from './constants';
import handleError from '../../utils/error';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import { allFieldsValidation } from '../../utils/validation';
import { signOut } from '../Login/actions';

export const resetBanks = () => {
  return async (dispatch, getState) => {
    dispatch({ type: RESET_BANK });
  };
}

export const resetPasswordChange = (name, value) => {
  let formData = {};
  formData[name] = value
  return  {
    type: PASSWORD_CHANGE,
    payload: formData
  }
}

export const accountChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: ACCOUNT_CHANGE,
    payload: formData
  };
};

export const clearAccount = () => {
  return {
    type: CLEAR_ACCOUNT
  };
};

export const setProfileLoading = value => {
  return {
    type: SET_PROFILE_LOADING,
    payload: value
  };
};

export const fetchProfile = () => {
  return async (dispatch) => {
    try {
      dispatch(setProfileLoading(true));
      const response = await axios.get(`${API_URL}/user/me`);
      dispatch({ type: FETCH_PROFILE, payload: response.data.user });
    } catch (error) {
      const title = "try again!"
      handleError(error, dispatch, title);
    } finally {
      dispatch(setProfileLoading(false));
    }
  };
};

export const resetPassword = (token, navigate) => {
  return async (dispatch, getState) => {
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
    }
  };
};

export const resetAccountPassword = () => {
  return async (dispatch, getState) => {
    dispatch(setProfileLoading(true))
    try {
      const rules = {
        password: 'required|min:6',
        confirmPassword: 'required|min:6'
      };

      const user = getState().account.resetFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.password': 'Password is required.',
        'min.password': 'Password must be at least 6 characters.',
        'required.confirmPassword': 'New password is required.',
        'min.confirmPassword': 'New password must be at least 6 characters.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_RESET_PASSWORD_FORM_ERRORS,
          payload: errors
        });
      }

      const response = await axios.post(`${API_URL}/auth/reset`, user);
      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(signOut());
      }

      dispatch(showNotification('success', successfulOptions.title));
      dispatch({ type: RESET_PASSWORD_RESET });
    } catch (error) {
      const title = `Please try to reset again!`;
      handleError(error, dispatch, title);
    } finally {
      dispatch(setProfileLoading(false))
    }
  };
};

export const updateProfile = (navigate) => {
  return async (dispatch, getState) => {
    const profile = getState().account.user;
    const rules = {
      userName: 'required|username_format',
    };

    const newProfile = {
      name: profile.name,
      userName: profile.userName,
    };

    const { isValid, errors } = allFieldsValidation(newProfile, rules, {
      'required.userName': 'User name is required',
      'userName.username_format': 'Username can only contain letters, numbers, underscores, and dashes (no spaces).',
    });

    if (!isValid) {
      return dispatch({ type: SET_PROFILE_EDIT_ERRORS, payload: errors });
    }

    try {
      const formData = new FormData();

      for (const key in profile) {
        if (Object.hasOwnProperty.call(profile, key)) {
          if (key === 'image' && Array.isArray(profile.image)) {
            for (const file of profile.image) {
              formData.append('image', file);
            }
          } else {
            formData.append(key, profile[key]);
          }
        }
      }

      const response = await axios.put(`${API_URL}/user`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch({ type: FETCH_PROFILE, payload: response.data.user });
      dispatch(showNotification('success', successfulOptions.title));
      navigate(0)
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetches admin bank
export const fetchBanks = () => {
  return async(dispatch, getState) => {
    try {
      const response = await axios.get(`${API_URL}/admin_account_bank`)
      if (response.data.success) {
        dispatch({
          type: FETCH_BANK,
          payload: response.data.banks
        })
      }
    } catch (error) {
      handleError(error, dispatch)
    }

  }
}


// creates admin bank
export const createBank = (selectedBank, accountNumber, accountName) => {
  return async(dispatch, getState) => {
    try {
      const rules = {
        bankName: 'required',
        accountNumber: 'required|max:20',
        nameOnAccount: 'required',
      };

      const newBank = {
        bankName: selectedBank,
        accountNumber: accountNumber,
        nameOnAccount: accountName,
      };

      const { isValid, errors } = allFieldsValidation(newBank, rules, {
        'required.bankName': 'Bank name is required.',
        'required.accountNumber': 'Account number is required.',
        'max.accountNumber':
          'Account Number may not be greater than 20 characters.',
        'required.nameOnAccount': 'Account name is required.',
      });

      if (!isValid) {
        return dispatch({ type: SET_BANK_FORM_ERROR, payload: errors });
      }

      const response = await axios.post(`${API_URL}/admin_account_bank/create`, newBank, {
        headers: { 'Content-Type': 'application/json' }
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: CREATE_BANK,
          payload: response.data.bank
        });
        dispatch(resetBanks());
      }
    } catch (error) {
      handleError(error, dispatch)
    }
  }
}


// delete a bank
export const deleteBank = (id) => {
  return async(dispatch, getState) => {
    try {
      if (id) {
        const response  = await axios.delete(`${API_URL}/admin_account_bank/delete/${id}`)
        if (response.data.success) {
          const successfulOptions = {
            title: `${response.data.message}`,
            position: 'tr',
            autoDismiss: 1
          };

          dispatch({
            type: DELETE_BANK,
            payload: id
          })
          dispatch(success(successfulOptions));
        }
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  }
}
