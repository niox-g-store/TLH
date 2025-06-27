// utils/handleError.js

import { toast } from 'react-toastify';

const handleError = (err, dispatch, title = '') => {
  let message = title || 'Something went wrong';

  if (err.response) {
    switch (err.response.status) {
      case 400:
        message = err.response.data?.error || 'Bad Request';
        break;
      case 401:
        message = 'Unauthorized. Please login again.';
        // Optional: dispatch(logout()) if needed
        break;
      case 403:
        message = 'Forbidden. You do not have permission.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      default:
        message = err.response.data?.message || 'Unexpected error occurred.';
    }
  } else if (err.message) {
    message = err.message;
  }

  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true
  });
};

export default handleError;
