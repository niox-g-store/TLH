import axios from 'axios';
import { showNotification } from "../Notification/actions";
import handleError from "../../utils/error";
import { API_URL } from "../../constants";
import {
  FETCH_ORGANIZERS,
  FETCH_ORGANIZER_BY_ID,
  SET_LOADING
} from './constants';

export const fetchOrganizers = () => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const res = await axios.get(`${API_URL}/organizer`);
    dispatch({ type: FETCH_ORGANIZERS, payload: res.data });
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const fetchOrganizerById = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const res = await axios.get(`${API_URL}/organizer/${id}`);
    dispatch({ type: FETCH_ORGANIZER_BY_ID, payload: res.data });
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const suspendOrganizer = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await axios.patch(`${API_URL}/organizer/${id}/suspend`);
    dispatch(fetchOrganizerById(id));
    dispatch(showNotification('Organizer suspended.'));
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const resumeOrganizer = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await axios.patch(`${API_URL}/organizer/${id}/resume`);
    dispatch(fetchOrganizerById(id));
    dispatch(showNotification('Organizer resumed.'));
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const deleteOrganizer = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await axios.delete(`${API_URL}/organizer/${id}`);
    dispatch(fetchOrganizers());
    dispatch(showNotification('Organizer deleted.'));
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};
