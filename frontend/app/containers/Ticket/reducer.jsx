import {
  FETCH_TICKET,
  FETCH_TICKETS_BY_EVENT,
  FETCH_TICKETS_BY_USER,
  TICKET_CHANGE,
  SET_TICKET_FORM_ERRORS,
  RESET_TICKET_FORM,
  ADD_TICKET,
  EDIT_TICKET,
  DELETE_TICKET,
  SET_TICKETS_LOADING,
  SET_EVENT_TICKET,
} from './constants';

const initialState = {
  tickets: [],
  ticket: {},
  ticketForm: {
    type: '',
    price: '',
    discount: false,
    discountPrice: '',
    coupons: []
  },
  ticketFormErrors: {},
  createdEventTicket: [],
  isLoading: false,
};

const ticketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENT_TICKET:
      return {
        ...state,
        createdEventTicket: action.payload
      };
    case SET_TICKETS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case FETCH_TICKETS_BY_EVENT:
    case FETCH_TICKETS_BY_USER:
      return {
        ...state,
        tickets: action.payload,
        isLoading: false,
      };

    case FETCH_TICKET:
      return {
        ...state,
        ticket: action.payload,
        isLoading: false,
      };

    case ADD_TICKET:
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
        isLoading: false,
      };

    case EDIT_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket._id === action.payload._id ? action.payload : ticket
        ),
        isLoading: false,
      };

    case DELETE_TICKET:
      return {
        ...state,
        tickets: state.tickets.filter(ticket => ticket._id !== action.payload),
        isLoading: false,
      };

    case TICKET_CHANGE:
      return {
        ...state,
        ticketForm: {
          ...state.ticketForm,
          ...action.payload,
        },
      };

    case SET_TICKET_FORM_ERRORS:
      return {
        ...state,
        ticketFormErrors: action.payload,
      };

    case RESET_TICKET_FORM:
      return {
        ...state,
        ticketForm: initialState.ticketForm,
        ticketFormErrors: {},
      };

    default:
      return state;
  }
};

export default ticketReducer;
