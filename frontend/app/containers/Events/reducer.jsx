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
  RESET_ADVANCED_FILTERS,
  IMAGE_TO_REMOVE,

  CREATE_EVENT_TICKET,
  DELETE_EVENT_TICKET,
  EDIT_EVENT_TICKET,
  FETCH_ALL_EVENTS,
  SELECT_EVENT,
  VIEWING_EVENT,
  EVENT_CHANGED
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
    image: '',
    isActive: true,
    visibility: false,
  },
  imageToRemove: [],
  isLoading: false,
  formErrors: {},
  editFormErrors: {},
  eventTickets: [],
  allEvents: [],
  selectEvent: {},
  isViewingEvent: false,
  eventSlugChange: false,
  eventCategories: [
  { value: "CONCERT", label: "Concert" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "NETWORKING", label: "Networking" },
  { value: "SEMINAR", label: "Seminar / Talk" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "WEBINAR", label: "Webinar / Virtual Event" },
  { value: "ART_EXHIBITION", label: "Art Exhibition" },
  { value: "THEATRE", label: "Theatre / Performance" },
  { value: "FOOD_DRINK", label: "Food & Drink" },
  { value: "FUNDRAISER", label: "Fundraiser / Charity Event" },
  { value: "SPORTS_FITNESS", label: "Sports / Fitness" },
  { value: "COMEDY_SHOW", label: "Comedy Show" },
  { value: "NIGHTLIFE", label: "Nightlife / Party" },
  { value: "TRADE_SHOW", label: "Trade Show / Expo" },
  { value: "MEETUP", label: "Meetup / Community Gathering" },
  { value: "FAMILY_KIDS", label: "Family / Kids Event" },
  { value: "RELIGIOUS", label: "Religious / Spiritual" },
  { value: "EDUCATIONAL", label: "Educational / Training" },
  { value: "PRODUCT_LAUNCH", label: "Product Launch / Business Event" },
  { value: "OTHER", label: "Other" },
]
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case EVENT_CHANGED:
      return {
        ...state,
        eventSlugChange: action.payload
      }
    case VIEWING_EVENT:
      return {
        ...state,
        isViewingEvent: action.payload
      };
    case SELECT_EVENT:
      return {
        ...state,
        selectEvent: action.payload
      }
    case FETCH_ALL_EVENTS:
      return {
        ...state,
        allEvents: action.payload
      };
    case CREATE_EVENT_TICKET:
      return {
        ...state,
        eventTickets: [...state.eventTickets, action.payload],
      };

    case EDIT_EVENT_TICKET:
      return {
        ...state,
        eventTickets: state.eventTickets.map((ticket) =>
          ticket.id === action.payload.id
            ? { ...ticket, ...action.payload.updatedFields }
            : ticket
        ),
      };

    case DELETE_EVENT_TICKET:
      return {
        ...state,
        eventTickets: state.eventTickets.filter(
          (ticket) => ticket.id !== action.payload
        ),
      };
    case IMAGE_TO_REMOVE:
      return {
        ...state,
        imageToRemove: [...state.imageToRemove, action.payload]
      };
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
          capacity: '',
          image: '',
          isActive: true,
          visibility: false,
          imageToRemove: []
        },
        event: {
          _id: ''
        },
        formErrors: {},
        imageToRemove: [],
        eventTickets: []
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
