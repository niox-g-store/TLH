/*
 *
 * Dashboard reducer
 *
 */

import { TOGGLE_DASHBOARD_MENU, TOGGLE_THEME } from './constants';
import {
  SET_IS_RANGE_SELECTION,
  SET_START_DATE,
  SET_END_DATE,
  SET_SINGLE_DATE,
  SET_FILTER_TARGET,
  RESET_DATE_SELECTION,
  TOGGLE_FILTER_SYSTEM,
  SET_DASHBOARD_LOADING,
  SET_DASHBOARD_ANALYTICS,
  SET_DASHBD_STATS_OVERVIEW,
  SET_ATTENDEES_DATA,

  SET_DASHBOARD_ROUTE,
} from './constants';

const initialState = {
  isMenuOpen: true,
  isLightMode: localStorage.getItem('isLightMode') === 'true',
  isRangeSelection: false,
  startDate: null,
  endDate: null,
  singleDate: null,
  filterTarget: 'Orders',
  filterSystemOpen: false,
  isDashboardLoading: false,
  dashboardAnalytics: {},
  stats: {},

  attendees: [],
  attendeesPage: 1,
  attendeesTotalPages: 1,
  routeType: '/dashboard'
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_ROUTE:
      return {
        ...state,
        routeType: action.payload
      }
    case SET_ATTENDEES_DATA:
      return {
        ...state,
        attendees: action.payload.attendees,
        attendeesPage: action.payload.currentPage,
        attendeesTotalPages: action.payload.totalPages,
      }
    case SET_DASHBD_STATS_OVERVIEW:
      return {
        ...state,
        stats: action.payload
      }
    case SET_DASHBOARD_ANALYTICS:
      return {
        ...state,
        dashboardAnalytics: { ...state.dashboardAnalytics, ...action.payload }
      }
    case SET_DASHBOARD_LOADING:
      return {
        ...state,
        isDashboardLoading: action.payload
      }
    case TOGGLE_FILTER_SYSTEM:
      return {
        ...state,
        filterSystemOpen: !state.filterSystemOpen
      }
    case SET_IS_RANGE_SELECTION:
      return {
        ...state,
        isRangeSelection: action.payload,
      };
    case SET_START_DATE:
      return {
        ...state,
        startDate: action.payload,
      };
    case SET_END_DATE:
      return {
        ...state,
        endDate: action.payload,
      };
    case SET_SINGLE_DATE:
      return {
        ...state,
        singleDate: action.payload,
      };
    case SET_FILTER_TARGET:
      return {
        ...state,
        filterTarget: action.payload,
      };
    case RESET_DATE_SELECTION:
      return {
        ...state,
        startDate: null,
        endDate: null,
        singleDate: null,
      };
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
