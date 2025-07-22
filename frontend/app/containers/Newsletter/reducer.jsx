import {
  FETCH_NEWSLETTERS,
  CREATE_NEWSLETTER,
  SET_NEWSLETTER_EVENT_ID
} from './constants';

const initialState = {
  newsletters: [],
  eventId: null
};

const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
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