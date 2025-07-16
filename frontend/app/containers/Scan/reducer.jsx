import { ADD_SCANNED_TICKET,
    CLEAR_SCANNED_TICKETS,
    FETCH_SCANNED_TICKETS,
    LOADING } from './constants';

const initialState = {
  scannedTicket: [],
  isLoading: false,
  scannedTickets: []
};

export default function scanReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SCANNED_TICKETS:
      return {
        ...state,
        scannedTickets: action.payload
      }
    case LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case ADD_SCANNED_TICKET:
      return {
        ...state,
        scannedTicket: [action.payload, ...state.scannedTicket]
      };
    case CLEAR_SCANNED_TICKETS:
      return {
        ...state,
        scannedTicket: []
      };
    default:
      return state;
  }
}
