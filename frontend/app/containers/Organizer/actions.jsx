import axios from 'axios';
import { showNotification } from "../Notification/actions";
import handleError from "../../utils/error";
import { API_URL } from "../../constants";
import {
  FETCH_ORGANIZERS,
  FETCH_ORGANIZER_BY_ID,
  SET_LOADING,
  RESET_ORGANIZER
} from './constants';

export const resetOrganizer = () => {
  return {
    type: RESET_ORGANIZER
  }
}

export const fetchOrganizers = () => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const res = await axios.get(`${API_URL}/organizer`);
    dispatch({ type: FETCH_ORGANIZERS, payload: res.data.organizers });
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
    dispatch({ type: FETCH_ORGANIZER_BY_ID, payload: res.data.organizer });
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const suspendOrganizer = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await axios.put(`${API_URL}/organizer/${id}/suspend`);
    dispatch(fetchOrganizerById(id));
    dispatch(showNotification('success', 'Organizer suspended.'));
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const resumeOrganizer = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await axios.put(`${API_URL}/organizer/${id}/resume`);
    dispatch(fetchOrganizerById(id));
    dispatch(showNotification('success', 'Organizer resumed.'));
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const deleteOrganizer = (id, navigate) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await axios.delete(`${API_URL}/organizer/${id}`);
    dispatch(showNotification('success', 'Organizer deleted.'));
    navigate(-1)
  } catch (err) {
    handleError(err, dispatch);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};
