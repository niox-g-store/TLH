import { ADD_SCANNED_TICKET,
    CLEAR_SCANNED_TICKETS,
    FETCH_SCANNED_TICKETS,
    LOADING,
    SHOW_SCAN_MODAL_WITH_DETAILS,
    FETCH_TICKET_DETAILS,
    SET_CODE_TO_SCAN
} from './constants';

const initialState = {
  scannedTicket: {},
  isLoading: false,
  scannedTickets: [],
  showScanModal: false,
  code: ''
};

export default function scanReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CODE_TO_SCAN:
      return {
        ...state,
        code: action.payload
      };
    case FETCH_TICKET_DETAILS:
      return {
        ...state,
        scannedTicket: action.payload
      }
    case SHOW_SCAN_MODAL_WITH_DETAILS:
      return {
        ...state,
        showScanModal: action.payload
      };
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
        scannedTickets: [action.payload, ...state.scannedTickets]
      };
    case CLEAR_SCANNED_TICKETS:
      return {
        ...state,
        scannedTickets: [],
        scannedTicket: {}
      };
    default:
      return state;
  }
}
