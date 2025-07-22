import {
  FETCH_NEWSLETTERS,
  CREATE_NEWSLETTER,
  SET_NEWSLETTER_EVENT_ID
} from './constants';

import { API_URL } from '../../constants';

export const fetchNewsletters = () => async dispatch => {
  const response = await fetch(`${API_URL}/newsletters`);
  const { newsletters } = await response.data;
  dispatch({ type: FETCH_NEWSLETTERS, payload: newsletters });
};

export const setNewsletter = (eventId) => {
  return {
    type: SET_NEWSLETTER_EVENT_ID,
    payload: eventId
  }
}

export const createNewsletter = (data) => async dispatch => {
  const response = await fetch('/api/newsletters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const newsletter = await response.json();
  dispatch({ type: CREATE_NEWSLETTER, payload: newsletter });
};