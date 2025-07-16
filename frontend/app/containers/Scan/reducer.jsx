import { ADD_SCANNED_TICKET, CLEAR_SCANNED_TICKETS } from './constants';

const initialState = {
  scannedTicket: []
};

export default function scanReducer(state = initialState, action) {
  switch (action.type) {
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
