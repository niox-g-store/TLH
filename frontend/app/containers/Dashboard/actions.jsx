/*
 *
 * Dashboard actions
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
} from './constants';

export const toggleDashboardMenu = () => {
  return {
    type: TOGGLE_DASHBOARD_MENU
  };
};

export const toggleDashboardTheme = (v) => {
  localStorage.setItem('isLightMode', v);
  return {
    type: TOGGLE_THEME,
    payload: v
  }
}

export const toggleFilterSystem = () => {
  return {
    type: TOGGLE_FILTER_SYSTEM
  }
}

export const setIsRangeSelection = (isRangeSelection) => ({
  type: SET_IS_RANGE_SELECTION,
  payload: isRangeSelection,
});

export const setStartDate = (date) => ({
  type: SET_START_DATE,
  payload: date,
});

export const setEndDate = (date) => ({
  type: SET_END_DATE,
  payload: date,
});

export const setSingleDate = (date) => ({
  type: SET_SINGLE_DATE,
  payload: date,
});

export const setFilterTarget = (target) => ({
  type: SET_FILTER_TARGET,
  payload: target,
});

export const resetDateSelection = () => ({
  type: RESET_DATE_SELECTION,
});

