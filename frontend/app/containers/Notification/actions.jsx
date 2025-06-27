import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showNotification = (type, message) => () => {
  if (type === 'success') toast.success(message);
  else if (type === 'error') toast.error(message);
  else toast(message);
};
