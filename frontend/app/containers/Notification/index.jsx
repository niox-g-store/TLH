import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import actions from '../../actions';

const Notification = ({ notifications, clearNotifications }) => {
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      notifications.forEach(({ type, message }) => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast(message); // fallback

        // Optional: clear notification after showing
        clearNotifications();
      });
    }
  }, [notifications, clearNotifications]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.notifications
});

const mapDispatchToProps = {
  clearNotifications: actions.clearNotifications // <- define this in your actions
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
