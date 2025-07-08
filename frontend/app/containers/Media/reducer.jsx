// reducer.js
// Assuming this is within your Redux module, e.g., 'src/reducers/mediaReducer.js'

import {
  FETCH_MEDIA,
  FETCH_MEDIAS,
  MEDIA_CHANGE,
  SET_MEDIA_FORM_ERRORS,
  RESET_MEDIA,
  ADD_MEDIA,
  REMOVE_MEDIA,
  UPDATE_MEDIA,
  SET_MEDIA_LOADING,
  SET_MEDIA_EDIT_FORM_ERRORS,
  HOME_MEDIA
} from './constants'; // Adjust path if needed

const initialState = {
  medias: [],
  media: null,
  mediaFormData: {
    mediaUrl: null,
    default: false,
    active: true
  },
  isLoading: false,
  formErrors: {},
  editFormErrors: {},
  homeMedia: []
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_MEDIA:
      return {
        ...state,
        homeMedia: action.payload
      };
    case SET_MEDIA_LOADING:
      return { ...state, isLoading: action.payload };

    case FETCH_MEDIAS:
      return { ...state, medias: action.payload };

    case ADD_MEDIA:
      return { ...state, medias: [...state.medias, action.payload] };

    case REMOVE_MEDIA:
      return { ...state, medias: state.medias.filter(media => media._id !== action.payload) };

    case UPDATE_MEDIA:
      // When a media is updated, replace it in the medias array
      return {
        ...state,
        medias: state.medias.map(media =>
          media._id === action.payload._id ? action.payload : media
        )
      };

    case MEDIA_CHANGE:
      return {
        ...state,
        mediaFormData: {
          ...state.mediaFormData,
          ...action.payload
        },
        formErrors: {
          ...state.formErrors,
          [Object.keys(action.payload)[0]]: undefined // Clear error for the changed field
        }
      };

    case SET_MEDIA_FORM_ERRORS:
      return { ...state, formErrors: action.payload };

    case SET_MEDIA_EDIT_FORM_ERRORS: // Though not heavily used for this spec, good to have
      return { ...state, editFormErrors: action.payload };

    case RESET_MEDIA:
      return {
        ...state,
        mediaFormData: {
          mediaUrl: null,
          default: false,
          active: true
        },
        formErrors: {},
        editFormErrors: {}
      };

    default:
      return state;
  }
};

export default mediaReducer;