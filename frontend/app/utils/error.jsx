import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { signOut } from '../containers/Login/actions';

const handleError = (err, dispatch, title = '') => {
  let message = title || 'Something went wrong';

  if (err.response) {
    if (err.response.status === 400) {
      message = err.response.data.error || 'Please try again.';
    } else if (err.response.status === 401) {
      message = 'Unauthorized Access! Please login again.';
      // dispatch(signOut());
    } else if (err.response.status === 403) {
      message = 'Forbidden! You are not allowed to access this resource.';
    } else if (err.response.status === 404) {
      message = 'Not found. Please check your request.';
    } else {
      message = err.response.data.message || message;
    }
  } else if (err.message) {
    message = err.message;
  }

  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export default handleError;
