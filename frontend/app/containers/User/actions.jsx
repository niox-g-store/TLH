import axios from "axios";
import { API_URL } from "../../constants";
import { USER_LOADING, USER_ERROR, SET_USERS } from "./constants";
import { showNotification } from "../Notification/actions";
import handleError from "../../utils/error";

export const fetchUsers = () => {
  return async (dispatch) => {
    dispatch({ type: USER_LOADING, payload: true });
    try {
      const response = await axios.get(`${API_URL}/user/non-organizers`);
      dispatch({ type: SET_USERS, payload: response.data.users });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({ type: USER_ERROR });
    } finally {
      dispatch({ type: USER_LOADING, payload: false });
    }
  };
};
