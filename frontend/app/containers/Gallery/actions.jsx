/*
 *
 * Coupon actions
 *
 */

import axios from 'axios';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

import {
FETCH_GALLERY,
FETCH_GALLERIES,
GALLERY_CHANGE,
GALLERY_EDIT_CHANGE,
SET_GALLERY_FORM_ERRORS,
SET_GALLERY_FORM_EDIT_ERRORS,
RESET_GALLERY,
ADD_GALLERY,
REMOVE_GALLERY,
SELECT_GALLERY,
GALLERY_CHANGED,
SET_GALLERY_LOADING,
IMAGE_TO_REMOVE,
} from './constants';

export const galleryChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: GALLERY_CHANGE,
    payload: formData
  };
};

export const galleryEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: GALLERY_EDIT_CHANGE,
    payload: formData
  };
};

export const resetGallery = () => {
  return async (dispatch) => {
    dispatch({ type: RESET_GALLERY });
  };
};

export const setGalleryLoading = (value) => {
  return {
    type: SET_GALLERY_LOADING,
    payload: value
  };
};

export const galleryImageToRemove = (value) => {
  return {
    type: IMAGE_TO_REMOVE,
    payload: value
  }
}

export const resetGallerySlugChange = () => {
  return {
    type: GALLERY_CHANGED,
    paylaod: false
  }
}

// Fetch all galleries
export const fetchGalleries = () => {
  return async (dispatch) => {
    try {
      dispatch(setGalleryLoading(true));

      const response = await axios.get(`${API_URL}/gallery`);
      dispatch({
        type: FETCH_GALLERIES,
        payload: response.data.galleries
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setGalleryLoading(false));
    }
  };
};

// Fetch single gallery by ID
export const fetchGallery = (id) => {
  return async (dispatch) => {
    try {
      dispatch(setGalleryLoading(true));
      const response = await axios.get(`${API_URL}/gallery/${id}`);
      dispatch({
        type: FETCH_GALLERY,
        payload: response.data.gallery
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setGalleryLoading(false));
    }
  };
};

export const fetchGallerySlug = (slug) => {
  return async(dispatch) => {
    dispatch(setGalleryLoading(true))
    //dispatch(vewingEventToggler(true))
    try {
      const response = await axios.get(`${API_URL}/gallery/fetch_slug/${slug}`);
      if (response.status === 201) {
        dispatch({
          type: GALLERY_CHANGED,
          payload: true
        })
      }
      dispatch({
        type: SELECT_GALLERY,
        payload: response.data.gallery
      })
    } catch (error) {
      handleError(error, dispatch, 'error fetching gallery!!');
    } finally {
      dispatch(setGalleryLoading(false));
    }
  }
}

// Add new gallery
export const addGallery = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setGalleryLoading(true));
    try {
      const rules = {
        name: 'required',
        date: 'required',
        banner: 'required',
        media: 'required',
      };
      const gallery = getState().gallery.galleryFormData;

      const newGallery = {
        name: gallery.name,
        description: gallery.description,
        date: gallery.date,
        banner: gallery.banner,
        media: gallery.media,
        active: gallery.active !== undefined ? gallery.active : true
      };

      const { isValid, errors } = allFieldsValidation(newGallery, rules, {
        'required.name': 'Name is required.',
        'required.date': 'Date is required.',
        'required.banner': 'Banner is requried',
        'required.media': 'Media is required.',
      });
      if (!isValid) {
        return dispatch({ type: SET_GALLERY_FORM_ERRORS, payload: errors });
      }
      const formData = new FormData();
      for (const key in newGallery) {
        if (newGallery.hasOwnProperty(key)) {
          if (key === 'media') {
            for (const file of newGallery.media) {
              formData.append('media', file);
            }
          } else if (key === 'banner') {
            for (const file of newGallery.banner) {
              formData.append('banner', file)
            }
          } else {
          formData.set(key, newGallery[key]);
        }
      }
    }
      const response = await axios.post(`${API_URL}/gallery/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: ADD_GALLERY, payload: response.data.gallery });
        dispatch(resetGallery());
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error saving gallery, try again!');
    } finally {
      dispatch(setGalleryLoading(false));
    }
  };
};

// Update existing gallery
export const updateGallery = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setGalleryLoading(true));

    try {
      const rules = {
        name: 'required',
        date: 'required',
      };

      const gallery = getState().gallery.gallery;
      const removeImage = getState().gallery.imageToRemove || [];

      const updatedGallery = {
        name: gallery.name,
        description: gallery.description,
        date: gallery.date,
        media: gallery.medias || [],
        banner: gallery.bannerUrl,
        active: gallery.active !== undefined ? gallery.active : true
      };

      const { isValid, errors } = allFieldsValidation(updatedGallery, rules, {
        'required.name': 'Name is required.',
        'required.date': 'Date is required.',
      });

      if (!isValid) {
        return dispatch({ type: SET_GALLERY_FORM_EDIT_ERRORS, payload: errors });
      }
      const formData = new FormData();
      for (const key in updatedGallery) {
        if (updatedGallery.hasOwnProperty(key)) {
          if (key === 'media') {
            for (const file of updatedGallery.media) {
              formData.append('media', file);
            }
          } else if (key === 'banner') {
            for (const file of updatedGallery.banner) {
              formData.append('banner', file)
            }
          } else {
            formData.set(key, updatedGallery[key]);
          }
        }
      }
      removeImage.forEach((str) => {
        formData.append('removeMedia', str);
      });

      const response = await axios.put(`${API_URL}/gallery/${gallery._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch(resetGallery());
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error updating gallery, try again!');
    } finally {
      dispatch(setGalleryLoading(false));
    }
  };
};

// Delete gallery
export const deleteGallery = (id, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API_URL}/gallery/${id}`);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: REMOVE_GALLERY, payload: id });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'error');
    }
  };
};