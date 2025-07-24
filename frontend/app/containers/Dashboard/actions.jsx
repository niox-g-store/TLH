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
  SET_DASHBOARD_LOADING,
  SET_DASHBOARD_ANALYTICS,
  SET_DASHBD_STATS_OVERVIEW,
  SET_ATTENDEES_DATA,
} from './constants';
import axios from 'axios';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';

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
};

const dashboardIsLoading = (v) => {
  return {
    type: SET_DASHBOARD_LOADING,
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

export const onApplyFilter = (filterCriteria) => {
  return async (dispatch) => {
    dispatch(dashboardIsLoading(true));
    try {
      const isApplyDisabled = filterCriteria.isRange
        ? !filterCriteria.startDate || !filterCriteria.endDate
        : !filterCriteria.startDate || !filterCriteria.target;
      if (isApplyDisabled) {
        if (filterCriteria.isRange) {
          return handleError({ message: 'Select a start and end date' }, dispatch)
        } else {
          return handleError({ message: 'Select a date' }, dispatch)
        }
      }
      const response = await axios.post(`${API_URL}/dashboard/first-three`, filterCriteria);
      const target = filterCriteria.target;
      if (response.status === 200) {
        dispatch({
          type: SET_DASHBOARD_ANALYTICS,
          payload: { [target]: response.data[target] }
        })
      }
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(dashboardIsLoading(false));
    }
  }
}

export const fetchAnalData = () => {
  return async (dispatch) => {
    dispatch(dashboardIsLoading(true));
    try {
      const response = await axios.get(`${API_URL}/dashboard/all-data`);
      if (response.status === 200) {
        dispatch({
          type: SET_DASHBOARD_ANALYTICS,
          payload: response.data 
        })
      }
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(dashboardIsLoading(false));
    }
  }
}

export const fetchStatsOverview = () => {
  return async(dispatch) => {
    dispatch(dashboardIsLoading(true));
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats/overview`);
      if (response.status === 200) {
        dispatch({
          type: SET_DASHBD_STATS_OVERVIEW,
          payload: response.data
        })
      }
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(dashboardIsLoading(false));
    }
  }
}

export const fetchAttendees = (page = 1) => {
  return async(dispatch) => {
    dispatch(dashboardIsLoading(true));
    try {
      const res = await axios.get(`${API_URL}/dashboard/attendees?page=${page}`);
      console.log(res)
      dispatch({ type: SET_ATTENDEES_DATA, payload: res.data })
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(dashboardIsLoading(false));
    }
  }
};

