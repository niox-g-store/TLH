import { FETCH_NEWSLETTERS, CREATE_NEWSLETTER } from './constants';

const initialState = {
  newsletters: [],
};

const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NEWSLETTERS:
      return { ...state, newsletters: action.payload };
    case CREATE_NEWSLETTER:
      return { ...state, newsletters: [...state.newsletters, action.payload] };
    default:
      return state;
  }
};

export default newsletterReducer;