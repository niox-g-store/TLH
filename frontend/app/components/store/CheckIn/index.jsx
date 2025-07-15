import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

const CheckInModal = ({ visible, onClose, onCheckIn, data = {} }) => {
  const { name, email, ticket = {} } = data;

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={onClose}
      size="md"
      scrollable={false}
    >
      <CModalHeader onClose={onClose}>
        <strong>Attendee Check-In</strong>
      </CModalHeader>

      <CModalBody>
        <p><strong>Name:</strong> {name || 'N/A'}</p>
        <p><strong>Email:</strong> {email || 'N/A'}</p>
        <p><strong>Ticket Type:</strong> {ticket.type || 'N/A'}</p>
        <p><strong>Price:</strong> ₦{ticket.price?.toLocaleString() || '0'}</p>
      </CModalBody>

      <CModalFooter>
        <CButton color="success" onClick={onCheckIn}>
          ✅ Check In
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CheckInModal;
