/*
 *
 * Account reducer
 *
 */

import {
  ACCOUNT_CHANGE,
  FETCH_PROFILE,
  CLEAR_ACCOUNT,
  SET_PROFILE_LOADING,

  CREATE_BANK,
  FETCH_BANK,
  RESET_BANK,
  DELETE_BANK,

  RESET_BANK_FORM_ERROR,
  SET_BANK_FORM_ERROR,
  SET_PROFILE_EDIT_ERRORS,

  PASSWORD_CHANGE,
  SET_TWO_FACTOR,
  SET_TWO_FACTOR_CODE,
  SET_RESET_PASSWORD_FORM_ERRORS,
  RESET_PASSWORD_RESET,
  TWO_FACTOR_ERROR,
  SHOW_TWO_FA_SETUP,
  CLEAR_TWO_FACTOR
} from './constants';

const initialState = {
  user: {
    name: '',
    userName: '',
    companyName: '',
    provider: '',
    role: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    image: '',
    imageUrl: '',
    contactEmail: '',
    bio: '',
    phoneNumber: '',
  },
  twoFactor: {
    qrCodeUrl: '',
    secret: '',
    code: ''
  },
  twoFactorFormError: {},
  show2FASetup: false,
  isLoading: false,

  resetFormData: {
    password: '',
    confirmPassword: ''
  },
  formErrors: {},

  banks: [],
  bankFormError: {},
  bankFormData: {
    bankName: '',
    accountNumber: '',
    nameOnAccount: '',
  },
  editFormErrors: {}
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_TWO_FACTOR:
      return {
        ...state,
        show2FASetup: false,
        twoFactorFormError: {},
        twoFactor: {
          qrCodeUrl: '',
          secret: '',
          code: ''
        }
      }
    case SHOW_TWO_FA_SETUP:
      return {
        ...state,
        show2FASetup: action.payload
      };
    case TWO_FACTOR_ERROR:
      return {
        ...state,
        twoFactorFormError: action.payload
      }
    case SET_TWO_FACTOR:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          qrCodeUrl: action.payload.qrCodeUrl,
          secret: action.payload.secret
        }
      };

    case SET_TWO_FACTOR_CODE:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          ...action.payload
        }
      };
    case PASSWORD_CHANGE:
      return {
        ...state,
        resetFormData: {...state.resetFormData, ...action.payload}
      };
    case SET_RESET_PASSWORD_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      }
    case RESET_PASSWORD_RESET:
      return {
        ...state,
        resetFormData: {
          password: '',
          confirmPassword: ''
        },
        formErrors: {}
      }
    case SET_PROFILE_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      }
    case CREATE_BANK:
      return {
        ...state,
        banks: [
          ...state.banks,
          action.payload
        ]
      }
    case FETCH_BANK:
      return {
        ...state,
        banks: action.payload
      }
    case DELETE_BANK:
      const index = state.banks.findIndex(b => b._id === action.payload);
      return {
        ...state,
        banks: [
          ...state.banks.slice(0, index),
          ...state.banks.slice(index + 1)
        ]
      };
    case RESET_BANK:
      return {
        ...state,
        bankFormError: {},
        bankFormData: {
          bankName: '',
          accountNumber: '',
          nameOnAccount: '',
        },
      }
    case SET_BANK_FORM_ERROR:
      return {
        ...state,
        bankFormError: action.payload
      }


    case ACCOUNT_CHANGE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case FETCH_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case CLEAR_ACCOUNT:
      return {
        ...state,
        user: {
          name: '',
          userName: '',
          companyName: '',
        },
        editFormErrors: {}
      };
    case SET_PROFILE_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default accountReducer;
