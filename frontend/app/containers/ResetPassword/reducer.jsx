/*
 *
 * ResetPassword reducer
 *
 */

import {
  RESET_PASSWORD_CHANGE,
  RESET_PASSWORD_RESET,
  SET_RESET_PASSWORD_FORM_ERRORS,
  RESET_PASSWORD_TOKEN,
  RESET_PWD_LOADING
} from './constants';

const initialState = {
  resetFormData: {
    password: '',
    confirmPassword: ''
  },
  formErrors: {},
  token: '',
  loading: false
};

const resetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PWD_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case RESET_PASSWORD_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case RESET_PASSWORD_CHANGE:
      return {
        ...state,
        resetFormData: { ...state.resetFormData, ...action.payload }
      };
    case SET_RESET_PASSWORD_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case RESET_PASSWORD_RESET:
      return {
        ...state,
        resetFormData: {
          password: '',
          confirmPassword: ''
        },
        formErrors: {}
      };
    default:
      return state;
  }
};

export default resetPasswordReducer;
