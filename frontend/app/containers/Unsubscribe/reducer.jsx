/*
 *
 * Newsletter Unsubscribe reducer
 *
 */

import {
  SET_NEWSLETTER_UNSUBSCRIBE_FORM_ERRORS,
  NEWSLETTER_UNSUBSCRIBE_RESET,
  SET_NEWSLETTER_UNSUBSCRIBE_EMAIL,
  SET_NEWSLETTER_UNSUBSCRIBE_LOADING,
} from './constants';

const initialState = {
  email: '',
  formErrors: {},
  isLoading: false,
};

const newsletterUnsubscribeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEWSLETTER_UNSUBSCRIBE_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case SET_NEWSLETTER_UNSUBSCRIBE_EMAIL:
      return {
        ...state,
        email: action.payload
      };
    case SET_NEWSLETTER_UNSUBSCRIBE_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case NEWSLETTER_UNSUBSCRIBE_RESET:
      return {
        ...state,
        email: '',
        formErrors: {}
      };
    default:
      return state;
  }
};

export default newsletterUnsubscribeReducer;
