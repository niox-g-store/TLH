import {
  FETCH_NEWSLETTERS,
  CREATE_NEWSLETTER,
  SET_NEWSLETTER_EVENT_ID,
  NEWSLETTER_FORM_ERRORS,
  NEWSLETTER_FORM,
  RESET_NEWSLETTER_FORM,
  NEWSLETTER_LOADING
} from './constants';
import axios from 'axios';
import { API_URL } from '../../constants';
import handleError from '../../utils/error';
import { showNotification } from '../Notification/actions';

export const fetchNewsletters = () => async dispatch => {
  dispatch({ type: NEWSLETTER_LOADING, payload: true })
  try {
    const response = await axios.get(`${API_URL}/newsletter`);
    const { campaigns } = response.data;
    dispatch({ type: FETCH_NEWSLETTERS, payload: campaigns });
  } catch(error) {
    handleError(error, dispatch)
  } finally {
    dispatch({ type: NEWSLETTER_LOADING, payload: false })
  }
};

export const newsletterChange = (name, v) => {
  const formData = {};
  formData[name] = v;
  return {
    type: NEWSLETTER_FORM,
    payload: formData
  }
}

export const setNewsletter = (eventId) => {
  return {
    type: SET_NEWSLETTER_EVENT_ID,
    payload: eventId
  }
}

export const createNewsletter = (navigate) => async (dispatch, getState) => {
  dispatch({ type: NEWSLETTER_LOADING, payload: true })
  try {
    const rules = {
      title: 'required',
      content: 'required',
    };
    const n = getState().newsletter.formData;
    const eventId = getState().newsletter.eventId || null;
    const data = {
      title: n.title,
      content: n.description,
      image: n.image,
      eventId
    }

    const { isValid, errors } = allFieldsValidation(data, rules, {
      'required.title': 'Title is required.',
      'required.content': 'Content is required.',
    });

    if (!isValid) {
      return dispatch({ type: NEWSLETTER_FORM_ERRORS, payload: errors });
    }
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === 'image') {
          for (const file of data.image) {
            formData.append('images', file);
          }
        } else {
          formData.set(key, data[key]);
        }
      }
    }
    const response = await axios.post(`${API_URL}/newsletter/create`, formData)
    const { newsletter } = response.data;
    dispatch({ type: CREATE_NEWSLETTER, payload: newsletter });
    dispatch(showNotification('success', 'Newsletter successfully created!!'))
    dispatch({ type: RESET_NEWSLETTER_FORM })
    navigate(-1)
  } catch (error) {
    handleError(error, dispatch)
  } finally {
    dispatch({ type: NEWSLETTER_LOADING, payload: false })
  }
};