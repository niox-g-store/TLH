/*
 *
 * Dashboard reducer
 *
 */

import { TOGGLE_DASHBOARD_MENU, TOGGLE_THEME } from './constants';

const initialState = {
  isMenuOpen: true,
  isLightMode: localStorage.getItem('isLightMode') === 'true'
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        isLightMode: action.payload
      };
    case TOGGLE_DASHBOARD_MENU:
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
    default:
      return state;
  }
};

export default dashboardReducer;
