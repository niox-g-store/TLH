import axios from "axios";
import { API_URL } from "../../constants";
import { GUEST_LOADING, GUEST_ERROR, SET_GUESTS } from "./constants";
import { showNotification } from "../Notification/actions";
import handleError from "../../utils/error";

export const fetchGuests = () => {
  return async (dispatch) => {
    dispatch({ type: GUEST_LOADING, payload: true });
    try {
      const response = await axios.get(`${API_URL}/guest`);
      dispatch({ type: SET_GUESTS, payload: response.data.guests });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({ type: GUEST_ERROR });
    } finally {
      dispatch({ type: GUEST_LOADING, payload: false });
    }
  };
};

