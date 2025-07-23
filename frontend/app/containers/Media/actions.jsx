// actions.js
// Assuming this is within your Redux module, e.g., 'src/actions/media/actions.js'

import axios from 'axios';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

import {
  FETCH_MEDIA,
  FETCH_MEDIAS,
  MEDIA_CHANGE,
  SET_MEDIA_FORM_ERRORS,
  RESET_MEDIA,
  ADD_MEDIA,
  REMOVE_MEDIA,
  UPDATE_MEDIA,
  SET_MEDIA_LOADING,
  SET_MEDIA_EDIT_FORM_ERRORS,
  HOME_MEDIA,
  POPOVER_MEDIA
} from './constants';

export const defaultWarning = () => {
  return (dispatch) => {
    resetMedia()
    handleError({ message: 'Only one media can be set as default. Please unmark the current default media first.' },
                dispatch)}
}

// --- Form Data Handling ---
export const mediaChange = (name, value) => {
  return {
    type: MEDIA_CHANGE,
    payload: { [name]: value }
  };
};

export const resetMedia = () => {
  return (dispatch) => {
    dispatch({ type: RESET_MEDIA });
  };
};

export const setMediaLoading = (value) => {
  return {
    type: SET_MEDIA_LOADING,
    payload: value
  };
};

// --- API Calls ---

export const fetchHomeMedia = () => {
    return async (dispatch) => {
    dispatch({ type: SET_MEDIA_LOADING, payload: true })
    try {
      const response = await axios.get(`${API_URL}/media/fetch_all`);
      dispatch({
        type: HOME_MEDIA,
        payload: response.data.medias
      });
    } catch (error) {
      handleError(error, dispatch, 'Failed to fetch medias.');
    } finally {
      dispatch({ type: SET_MEDIA_LOADING, payload: false })
    }
  };
}

export const fetchMedias = () => {
  return async (dispatch) => {
    dispatch(setMediaLoading(true));
    try {
      const response = await axios.get(`${API_URL}/media`);
      dispatch({
        type: FETCH_MEDIAS,
        payload: response.data.medias
      });
    } catch (error) {
      handleError(error, dispatch, 'Failed to fetch medias.');
    } finally {
      dispatch(setMediaLoading(false));
    }
  };
};

export const addMedia = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setMediaLoading(true));
    try {
      const mediaFormData = getState().media.mediaFormData; // Get form data from state

      const rules = {
        mediaUrl: 'required', // Rule for the uploaded file
      };

      // Perform validation. 'mediaUrl' here will be the File object from AdvancedUpload
      const validationData = {
        mediaUrl: mediaFormData.mediaUrl,
        // active and default are booleans, generally not 'required' for simple existence
      };

      const { isValid, errors } = allFieldsValidation(validationData, rules, {
        'required.mediaUrl': 'Media file is required.',
      });

      if (!isValid) {
        return dispatch({ type: SET_MEDIA_FORM_ERRORS, payload: errors });
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('mediaUrl', mediaFormData.mediaUrl); // Append the file itself
      formData.append('active', mediaFormData.active !== undefined ? mediaFormData.active : true);
      formData.append('default', mediaFormData.default !== undefined ? mediaFormData.default : false);

      const response = await axios.post(`${API_URL}/media/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: ADD_MEDIA, payload: response.data.media });
        dispatch(resetMedia());
        navigate(-1); // Go back to media list
      }
    } catch (error) {
      handleError(error, dispatch, 'Error saving media, please try again!');
    } finally {
      dispatch(setMediaLoading(false));
    }
  };
};

export const updateMedia = (mediaId, updateData, navigate) => {
  return async (dispatch) => {
    dispatch(setMediaLoading(true));
    try {
      // Send only the changed fields
      const response = await axios.put(`${API_URL}/media/${mediaId}`, updateData);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({
          type: UPDATE_MEDIA,
          payload: response.data.media // Backend should return the updated media object
        });
        // You might want to re-fetch all medias if the default status changed
        // across the list to ensure consistency, or simply update the one.
        // For simplicity, we'll assume the backend sends back the updated item
        // and the reducer can handle it. If default is involved, a re-fetch might be safer.
        dispatch(fetchMedias()); // Re-fetch to update default status across all items
      }
    } catch (error) {
      handleError(error, dispatch, 'Error updating media!');
      // If update fails, re-fetch to revert the UI switch
      dispatch(fetchMedias());
    } finally {
      dispatch(setMediaLoading(false));
    }
  };
};

export const fetchVisibleEvents = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/media/popover`);
      if (response.data.success === true) {
        dispatch({
          type: POPOVER_MEDIA,
          payload: response.data.events
        })
      }
    } catch (error) {
      handleError(error, dispatch, 'Error fetching events')
    }
  }
}

export const deleteMedia = (mediaId, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API_URL}/media/${mediaId}`);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: REMOVE_MEDIA, payload: mediaId });
      }
    } catch (error) {
      handleError(error, dispatch, 'Error deleting media!');
    }
  };
};