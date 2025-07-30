   import { FETCH_SETTINGS, UPDATE_SETTINGS, SETTINGS_ERROR, SETTING_LOADING } from './constants';

   const initialState = {
     settings: {
        maintenance: false,
        commission: '',
        islandDeliveryFee: '',
        mainlandDeliveryFee: '',
        earningControl: '',
        fixedDays: [],
        hours: null
     },
     error: null,
     isLoading: false,
   };

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case SETTING_LOADING:
      return {
        ...state,
        isLoading: action.payload
    };
    case FETCH_SETTINGS:
      return { ...state, settings: action.payload, error: null };
    case UPDATE_SETTINGS:
      return { ...state, settings: action.payload, error: null };
    case SETTINGS_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
    }
}
