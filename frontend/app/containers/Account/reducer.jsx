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
  SET_PROFILE_EDIT_ERRORS
} from './constants';

const initialState = {
  user: {
    name: '',
    userName: '',
    companyName: '',
    provider: '',
    role: '',
    organizer: {
      companyName: '',
      phoneNumber: ''
    }
  },
  isLoading: false,

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
