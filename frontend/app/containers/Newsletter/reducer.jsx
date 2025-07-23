import {
  FETCH_NEWSLETTERS,
  CREATE_NEWSLETTER,
  SET_NEWSLETTER_EVENT_ID,
  NEWSLETTER_FORM_ERRORS,
  NEWSLETTER_FORM,
  RESET_NEWSLETTER_FORM,
  NEWSLETTER_LOADING
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
};

const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
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