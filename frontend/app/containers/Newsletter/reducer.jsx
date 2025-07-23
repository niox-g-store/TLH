import {
  FETCH_NEWSLETTERS,
  CREATE_NEWSLETTER,
  SET_NEWSLETTER_EVENT_ID,
  NEWSLETTER_FORM_ERRORS,
  NEWSLETTER_FORM,
  RESET_NEWSLETTER_FORM,
  NEWSLETTER_LOADING,
  NEWSLETTER_SUB_EMAIL,
  RESET_NEWSLETTER_SUB,
  NEWSLETTER_SUB_ERROR
} from './constants';

const initialState = {
  newsletters: [],
  formData: {
    title: '',
    description: '',
    image: '',
    shouldEmailContainUserName: false
  },
  formErrors: {},
  eventId: null,
  isLoading: false,
  subEmail: '',
  subFormErrors: {}
};

const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
    case NEWSLETTER_SUB_ERROR:
      return { ...state, subFormErrors: action.payload }
    case RESET_NEWSLETTER_SUB:
      return { ...state, subEmail: '', subFormErrors: {} }
    case NEWSLETTER_SUB_EMAIL:
      return { ...state, subEmail: action.payload }
    case NEWSLETTER_LOADING:
      return { ...state, isLoading: action.payload }
    case NEWSLETTER_FORM:
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case NEWSLETTER_FORM_ERRORS:
      return { ...state, formErrors: action.payload }
    case RESET_NEWSLETTER_FORM:
      return {
        ...state,
        formData: {
          title: '',
          description: '',
          image: '',
          shouldEmailContainUserName: false
        },
        formErrors: {},
        eventId: null
      }
    case SET_NEWSLETTER_EVENT_ID:
      return { ...state, eventId: action.payload }
    case FETCH_NEWSLETTERS:
      return { ...state, newsletters: action.payload };
    case CREATE_NEWSLETTER:
      return { ...state, newsletters: [...state.newsletters, action.payload] };
    default:
      return state;
  }
};

export default newsletterReducer;