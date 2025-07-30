import {
  SIGNUP_CHANGE,
  SIGNUP_RESET,
  SET_SIGNUP_LOADING,
  SET_SIGNUP_SUBMITTING,
  SUBSCRIBE_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  COMPARE_PASSWORD,
  ORGANIZER_SIGNUP_CHANGE,
  SET_OTP_MODAL,
  OTP_CHANGE,
  VERIFY_OTP,
  SET_OTP_ERRORS
} from './constants';

const initialState = {
  signupFormData: {
    name: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  },

  organizerSignupFormData: {
    companyName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  },
  formErrors: {},
  isSubmitting: false,
  isLoading: false,
  isSubscribed: false,
  showOtpModal: false,
  otpCode: '',
  otpErrors: {},
  tempUserData: {}
};

const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_OTP_MODAL:
      return {
        ...state,
        showOtpModal: action.payload
      };
    case OTP_CHANGE:
      return {
        ...state,
        otpCode: action.payload,
        otpErrors: {}
      };
    case VERIFY_OTP:
      return {
        ...state,
        tempUserData: action.payload
      };
    case SET_OTP_ERRORS:
      return {
        ...state,
        otpErrors: action.payload
      };
    case COMPARE_PASSWORD:
        return {
            ...state,
            formErrors: action.payload
        };
    case ORGANIZER_SIGNUP_CHANGE:
      return {
        ...state,
        organizerSignupFormData: { ...state.organizerSignupFormData, ...action.payload }
      }
    case SIGNUP_CHANGE:
      return {
        ...state,
        signupFormData: { ...state.signupFormData, ...action.payload },
      };
    case SUBSCRIBE_CHANGE:
      return {
        ...state,
        isSubscribed: !state.isSubscribed
      };
    case SET_SIGNUP_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_SIGNUP_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_SIGNUP_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case SIGNUP_RESET:
      return {
        ...state,
        signupFormData: initialState.signupFormData,
        organizerSignupFormData: initialState.organizerSignupFormData,
        formErrors: {},
        isLoading: false,
        showOtpModal: false,
        otpCode: '',
        otpErrors: {},
        tempUserData: {}
      };
    default:
      return state;
  }
};

export default signupReducer;
