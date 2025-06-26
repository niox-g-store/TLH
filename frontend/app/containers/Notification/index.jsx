import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = (props) => {
  // Example: trigger a toast notification anywhere in your app
  const notifySuccess = () => toast.success('Action was successful!');
  const notifyError = () => toast.error('Something went wrong.');

  return (
    <>
      {/* Your existing app components */}
      <button onClick={notifySuccess}>Success Toast</button>
      <button onClick={notifyError}>Error Toast</button>

      {/* Toast container must be added once in your app */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Notification;
