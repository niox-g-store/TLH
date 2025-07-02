/*
 *
 * Event actions
 *
 */
import { useState } from 'react';
import { showNotification } from '../Notification/actions';
import axios from 'axios';

import {
  FETCH_EVENT,
  FETCH_EVENTS,
  FETCH_USER_EVENT,
  EVENT_CHANGE,
  EVENT_EDIT_CHANGE,
  SET_EVENT_FORM_ERRORS,
  SET_EVENT_FORM_EDIT_ERRORS,
  RESET_EVENT,
  ADD_EVENT,
  REMOVE_EVENT,
  FETCH_EVENTS_SELECT,
  SET_EVENTS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS,
} from './constants';

import { API_URL } from '../../constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';

export const eventChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: EVENT_CHANGE,
    payload: formData
  };
};

export const eventEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: EVENT_EDIT_CHANGE,
    payload: formData
  };
};

export const resetEvent = () => {
  return async (dispatch) => {
    dispatch({ type: RESET_EVENT });
  };
};

export const setEventLoading = (value) => {
  return {
    type: SET_EVENTS_LOADING,
    payload: value
  };
};

// Fetch all events
export const fetchEvents = () => {
  return async (dispatch) => {
    try {
      dispatch(setEventLoading(true));

      const response = await axios.get(`${API_URL}/event`);
      dispatch({
        type: FETCH_EVENTS,
        payload: response.data.events
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Fetch single event by ID
export const fetchEvent = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/event/${id}`);
      dispatch({
        type: FETCH_EVENT,
        payload: response.data.event
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// Fetch single event by slug
export const fetchStoreEvent = (slug) => {
  return async (dispatch) => {
    dispatch(setEventLoading(true));
    try {
      const response = await axios.get(`${API_URL}/event/item/${slug}`);
      dispatch({
        type: FETCH_STORE_EVENT,
        payload: response.data.event
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Fetch all events for store listing
export const fetchStoreEvents = () => {
  return async (dispatch) => {
    dispatch(setEventLoading(true));
    try {
      const response = await axios.get(`${API_URL}/event/list`);
      dispatch({
        type: FETCH_STORE_EVENTS,
        payload: response.data.events
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Add new event
export const addEvent = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setEventLoading(true));
    /*
      const data = new FormData();
  data.append('name', eventFormData.name);
  data.append('description', eventFormData.description);
  // ...append other fields
  data.append('image', imageFile); 
  */

    try {
      const rules = {
        name: 'required',
        description: 'required|max:5000',
        date: 'required',
        location: 'required',
        image: 'required'
      };

      const event = getState().event.eventFormData;

      const newEvent = {
        name: event.name,
        description: event.description,
        date: event.date,
        location: event.location,
        image: event.image,
        isActive: event.isActive,
      };

      const { isValid, errors } = allFieldsValidation(newEvent, rules, {
        'required.name': 'Name is required.',
        'required.description': 'Description is required.',
        'max.description': 'Description may not be greater than 5000 characters.',
        'required.date': 'Date is required.',
        'required.location': 'Location is required.',
        'required.image': 'Image is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_EVENT_FORM_ERRORS, payload: errors });
      }

      const formData = new FormData();
      for (const key in newEvent) {
        if (newEvent.hasOwnProperty(key)) {
          formData.set(key, newEvent[key]);
        }
      }

      const response = await axios.post(`${API_URL}/event/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: ADD_EVENT, payload: response.data.event });
        dispatch(resetEvent());
        dispatch(navigate(-1));
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Update existing event
export const updateEvent = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setEventLoading(true));

    try {
      const rules = {
        name: 'required',
        slug: 'required|alpha_dash',
        description: 'required|max:5000',
        date: 'required',
        location: 'required',
      };

      const event = getState().event.event;

      const updatedEvent = {
        name: event.name,
        slug: event.slug,
        description: event.description,
        date: event.date,
        location: event.location,
        isActive: event.isActive,
      };

      const { isValid, errors } = allFieldsValidation(updatedEvent, rules, {
        'required.name': 'Name is required.',
        'required.slug': 'Slug is required.',
        'alpha_dash.slug': 'Slug may have alpha-numeric characters, dashes, and underscores only.',
        'required.description': 'Description is required.',
        'max.description': 'Description may not be greater than 5000 characters.',
        'required.date': 'Date is required.',
        'required.location': 'Location is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_EVENT_FORM_EDIT_ERRORS, payload: errors });
      }

      const response = await axios.put(`${API_URL}/event/${event._id}`, {
        event: updatedEvent
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch(resetEvent());
        dispatch(navigate(-1));
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Delete event
export const deleteEvent = (id, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API_URL}/event/delete/${id}`);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: REMOVE_EVENT, payload: id });
        dispatch(navigate(-1));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// Activate/Deactivate event
export const activateEvent = (id, value) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${API_URL}/event/${id}/active`, {
        event: { isActive: value }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
