/*
 *
 * Login reducer
 *
 */

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

const initialState = {
  loginFormData: {
    email: '',
    userName: '',
    password: '',
  },
  formErrors: {},
  isSubmitting: false,
  isLoading: false,
  rememberMe: false,
  twoFaPrmpt: false,
  twoFaUser: {
    id: '',
    rememberMe: false
  }
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TWO_FACTOR_USER:
      return {
        ...state,
        twoFaUser: {
          id: action.payload.id,
          rememberMe: action.payload.rememberMe
        }
      }
    case TWO_FA_PROMPT:
      return {
        ...state,
        twoFaPrmpt: action.payload
      }
    case REMEMBER_ME:
      return {
        ...state,
        rememberMe: !state.rememberMe
      }
    case LOGIN_CHANGE:
      return {
        ...state,
        loginFormData: { ...state.loginFormData, ...action.payload }
      };
    case SET_LOGIN_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_LOGIN_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_LOGIN_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case LOGIN_RESET:
      return {
        ...state,
        loginFormData: {
          email: '',
          userName: '',
          password: '',
        },
        formErrors: {},
        isLoading: false
      };
    default:
      return state;
  }
};

export default loginReducer;
