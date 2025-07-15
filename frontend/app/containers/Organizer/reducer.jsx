import {
  FETCH_ORGANIZERS,
  FETCH_ORGANIZER_BY_ID,
  SET_LOADING,
  RESET_ORGANIZER
} from './constants';

const initialState = {
  organizers: [],
  selectedOrganizer: {},
  loading: false
};

export default function organizerReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_ORGANIZER:
      return {
        ...state,
        selectedOrganizer: {}
      }
    case SET_LOADING:
        return {
            ...state,
            loading: action.payload
        }
    case FETCH_ORGANIZERS:
      return {
        ...state,
        organizers: action.payload
      };
    case FETCH_ORGANIZER_BY_ID:
      return {
        ...state,
        selectedOrganizer: action.payload
      };
    default:
      return state;
  }
}
