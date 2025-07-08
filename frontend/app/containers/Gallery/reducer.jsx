import {
FETCH_GALLERY,
FETCH_GALLERIES,
GALLERY_CHANGE,
GALLERY_EDIT_CHANGE,
SET_GALLERY_FORM_ERRORS,
SET_GALLERY_FORM_EDIT_ERRORS,
RESET_GALLERY,
ADD_GALLERY,
REMOVE_GALLERY,
SELECT_GALLERY,
GALLERY_CHANGED,
SET_GALLERY_LOADING,
IMAGE_TO_REMOVE,
} from './constants';

const initialState = {
  galleries: [],
  gallery: {
    _id: ''
  },
  galleryFormData: {
    name: '',
    description: '',
    date: '',
    banner: '',
    media: '',
    active: true
  },
  isLoading: false,
  formErrors: {},
  editFormErrors: {},
  gallerySlugChange: false,
  selectGallery: {},
  imageToRemove: []
};

const galleryReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMAGE_TO_REMOVE:
      return {
        ...state,
        imageToRemove: [...state.imageToRemove, action.payload]
      };
    case GALLERY_CHANGED:
      return {
        ...state,
        gallerySlugChange: action.payload
      }
    case SELECT_GALLERY:
      return {
        ...state,
        selectGallery: action.payload
      };
    case FETCH_GALLERIES:
      return {
        ...state,
        galleries: action.payload
      };
    case FETCH_GALLERY:
      return {
        ...state,
        gallery: action.payload,
        editFormErrors: {}
      };
    case SET_GALLERY_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case ADD_GALLERY:
      return {
        ...state,
        galleries: [...state.galleries, action.payload]
      };
    case REMOVE_GALLERY:
      return {
        ...state,
        galleries: state.galleries.filter(gallery => gallery._id !== action.payload)
      };
    case GALLERY_CHANGE:
      return {
        ...state,
        galleryFormData: {
          ...state.galleryFormData,
          ...action.payload
        }
      };
    case GALLERY_EDIT_CHANGE:
      return {
        ...state,
        gallery: {
          ...state.gallery,
          ...action.payload
        }
      };
    case SET_GALLERY_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_GALLERY_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case RESET_GALLERY:
      return {
        ...state,
        galleryFormData: {
          name: '',
          description: '',
          date: '',
          banner: '',
          media: '',
          active: true
        },
        gallery: {
          _id: ''
        },
        formErrors: {},
        imageToRemove: []
      };
    default:
      return state;
  }
};

export default galleryReducer;
