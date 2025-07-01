import {
  FETCH_EVENT,
  FETCH_EVENTS,
  FETCH_USER_EVENT,
  EVENT_CHANGE,
  EVENT_EDIT_CHANGE,
  SET_EVENT_FORM_ERRORS,
  SET_EVENT_FORM_EDIT_ERRORS,
  RESET_EVENT,
  ADD_EVENT,
  REMOVE_EVENT,
  FETCH_EVENTS_SELECT,
  SET_EVENTS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS
} from './constants';

const initialState = {
  events: [],
  userEvents: [],
  event: {
    _id: ''
  },
  eventsSelect: [],
  eventFormData: {
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    category: '',
    capacity: '',
    imageUrl: '',
    isActive: true,
  },
  isLoading: false,
  formErrors: {},
  editFormErrors: {},
  advancedFilters: {
    name: 'all',
    category: 'all',
    min: 1,
    max: 1000000,
    order: 0,
    totalPages: 1,
    currentPage: 1,
    count: 0,
    limit: 12,
    page: 1,
  },
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EVENTS:
      return {
        ...state,
        events: action.payload
      };
    case FETCH_USER_EVENT:
      return {
        ...state,
        userEvents: action.payload
      };
    case FETCH_EVENT:
      return {
        ...state,
        event: action.payload,
        editFormErrors: {}
      };
    case SET_EVENTS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_EVENTS_SELECT:
      return {
        ...state,
        eventsSelect: action.payload
      };
    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      };
    case REMOVE_EVENT:
      return {
        ...state,
        events: state.events.filter(ev => ev._id !== action.payload)
      };
    case EVENT_CHANGE:
      return {
        ...state,
        eventFormData: {
          ...state.eventFormData,
          ...action.payload
        }
      };
    case EVENT_EDIT_CHANGE:
      return {
        ...state,
        event: {
          ...state.event,
          ...action.payload
        }
      };
    case SET_EVENT_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_EVENT_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case RESET_EVENT:
      return {
        ...state,
        eventFormData: {
          name: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          category: '',
          price: 0,
          capacity: '',
          imageUrl: '',
          isActive: true,
        },
        event: {
          _id: ''
        },
        formErrors: {}
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case RESET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: initialState.advancedFilters
      };
    default:
      return state;
  }
};

export default eventReducer;
