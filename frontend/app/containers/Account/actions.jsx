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
  RESET_PASSWORD_RESET,
  SET_TWO_FACTOR_CODE,
  TWO_FACTOR_ERROR,
  SHOW_TWO_FA_SETUP,
  CLEAR_TWO_FACTOR,
  FETCHED_BANKS
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

export const accountResetPasswordChange = (name, value) => {
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
    updateProfile}
  };
};

export const updateProfile = (navigate, google) => {
  return async (dispatch, getState) => {
    const profile = getState().account.user;
    let rules = null;
    if (!google) {
     rules = {
        userName: 'required|username_format',
      };
    }

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

// fetches bank
export const fetchBanks = () => async (dispatch) => {
  dispatch(setProfileLoading(true))
  try {
    const { data, status } = await axios.get(`${API_URL}/user/banks`);
    if (status === 200) {
      dispatch({
        type: FETCHED_BANKS,
        payload: data.banks
      })
    }
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setProfileLoading(false))
  }
};


// creates admin bank
export const addUserBank = (navigate) => {
  return async(dispatch, getState) => {
    dispatch(setProfileLoading(true))
    try {
      const rules = {
        bankName: 'required',
        bankAccountNumber: 'required|max:20',
      };

      const { bankAccountNumber, bankName } = getState().account.user;

      let newBank = {
        bankName: bankName.label,
        bankAccountNumber: bankAccountNumber,
        bankCode: bankName.value
      };

      const { isValid, errors } = allFieldsValidation(newBank, rules, {
        'required.bankName': 'Select a bank',
        'required.bankAccountNumber': 'Account number is required.',
        'max.bankAccountNumber':
          'Account Number may not be greater than 20 characters.',
      });

      if (!isValid) {
        return dispatch({ type: SET_BANK_FORM_ERROR, payload: errors });
      }
      const response = await axios.put(`${API_URL}/user`, newBank, {
        headers: { 'Content-Type': 'application/json' }
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(showNotification('success', successfulOptions.title));
        dispatch({
          type: FETCH_PROFILE,
          payload: response.data.user
        });
        navigate(0)
      }
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(setProfileLoading(false))
    }
  }
}


// delete a bank
/*export const deleteBank = (id) => {
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
}*/

export const twoFaVerificationCodeChange = (name, value) => {
  let formData= {};
  formData[name] = value;
  return {
    type: SET_TWO_FACTOR_CODE,
    payload: formData
  }
}

export const setShow2FASetup = (v) => {
  return {
    type: SHOW_TWO_FA_SETUP,
    payload: v
  }
}

export const setupTwoFactor = () => {
  return async (dispatch) => {
    dispatch(setProfileLoading(true));
    try {
      const response = await axios.post(`${API_URL}/auth/2fa/setup`, {}, {
        headers: {
          Authorization: localStorage.getItem('token'),
        }
      });

      dispatch({
        type: SET_TWO_FACTOR,
        payload: {
          qrCodeUrl: response.data.qrCodeUrl,
          secret: response.data.secret
        }
      });
    } catch (error) {
      handleError(error, dispatch, "Failed to setup 2FA");
    } finally {
      dispatch(setProfileLoading(false));
    }
  };
};

export const verifyTwoFactor = () => {
  return async (dispatch, getState) => {
    dispatch(setProfileLoading(true));
    try {
      const { secret, code } = getState().account.twoFactor;

      const rules = {
        code: 'required|min:6|max:6',
      };

      const twoFa = {
        code: String(code),
      };

      const { isValid, errors } = allFieldsValidation(twoFa, rules, {
        'required.code': 'Code is required.',
        'min.code': 'Enter a 6 digit code.',
        'max.code': 'Code cannot be longer than 6 digit code.',
      });

      if (!isValid) {
        return dispatch({
          type: TWO_FACTOR_ERROR,
          payload: errors
        });
      }

      const response = await axios.post(`${API_URL}/auth/2fa/verify`, {
        token: code,
        secret: secret
      }, {
        headers: {
          Authorization: localStorage.getItem('token'),
        }
      });

      const options = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success) {
        dispatch(showNotification('success', options.title));
        dispatch({ type: CLEAR_TWO_FACTOR })
      } else {
        dispatch(showNotification('error', 'Invalid verification code.'));
      }

    } catch (error) {
      handleError(error, dispatch, "2FA verification failed");
    } finally {
      dispatch(setProfileLoading(false));
    }
  };
};
