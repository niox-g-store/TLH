import {
  USER_LOADING,
  USER_ERROR,
  SET_USERS,
} from "./constants";

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const userReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case USER_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_USERS:
      return { ...state, users: action.payload, error: null };
    case USER_ERROR:
      return { ...state, error: true };
    default:
      return state;
  }
};

export default userReducer;
