import axios from 'axios';
import { FETCH_SETTINGS, UPDATE_SETTINGS, SETTINGS_ERROR, SETTING_LOADING } from './constants';
import { API_URL } from '../../constants';
import handleError from '../../utils/error';
import { showNotification } from '../Notification/actions';

export const fetchSettings = () => async dispatch => {
  dispatch({ type: SETTING_LOADING, payload: true })
  try {
    const response = await axios.get(`${API_URL}/setting`);
    dispatch({ type: FETCH_SETTINGS, payload: response.data });
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch({ type: SETTING_LOADING, payload: false })
  }
};

export const updateSettings = (settings) => async dispatch => {
  dispatch({ type: SETTING_LOADING, payload: true })
  try {
    const response = await axios.put(`${API_URL}/setting`, settings);
    dispatch({ type: UPDATE_SETTINGS, payload: response.data });
    dispatch(showNotification('success', 'Settings applied'));
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch({ type: SETTING_LOADING, payload: false })
  }
};