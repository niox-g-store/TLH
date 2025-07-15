import { GUEST_LOADING, GUEST_ERROR, SET_GUESTS } from "./constants";

const initialState = {
  guests: [],
  isLoading: false,
  error: null,
};

const guestReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GUEST_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_GUESTS:
      return { ...state, guests: action.payload, error: null };
    case GUEST_ERROR:
      return { ...state, error: true };
    default:
      return state;
  }
};

export default guestReducer;
