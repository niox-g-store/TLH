import { FETCH_NEWSLETTERS, CREATE_NEWSLETTER } from './constants';

export const fetchNewsletters = () => async dispatch => {
  const response = await fetch('/api/newsletters');
  const newsletters = await response.json();
  dispatch({ type: FETCH_NEWSLETTERS, payload: newsletters });
};

export const createNewsletter = (data) => async dispatch => {
  const response = await fetch('/api/newsletters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const newsletter = await response.json();
  dispatch({ type: CREATE_NEWSLETTER, payload: newsletter });
};