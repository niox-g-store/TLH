import {
  CCard,
  CCardBody,
  CCardTitle,
  CForm,
  CFormInput,
  CButton,
  CAlert,
  CFormSwitch,
  CCollapse
} from '@coreui/react';
import { useState } from 'react';

const AccountSecurity = ({ isLightMode }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', color: '' });

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      return setAlert({ show: true, message: 'All fields are required.', color: 'danger' });
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return setAlert({ show: true, message: 'Passwords do not match.', color: 'warning' });
    }

    setAlert({ show: true, message: 'Password changed successfully.', color: 'success' });
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
      setAlert({ show: true, message: 'Two-Factor Authentication disabled.', color: 'danger' });
      setIs2FAEnabled(false);
      setShow2FASetup(false);
    } else {
      setIs2FAEnabled(true);
      setShow2FASetup(true);
    }
  };

  return (
    <div data-aos="fade-up" className="container-lg px-4 mb-5">
      <CCard className={`${isLightMode ? '' : 'border-0'}`}>
        <CCardBody className={`${isLightMode ? 'bg-white' : 'bg-black'}`}>
          <CCardTitle className={`${isLightMode ? 'p-black' : 'p-white'} mb-3 font-size-30`}>
            Account Security
          </CCardTitle>

          {alert.show && (
            <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, show: false })}>
              {alert.message}
            </CAlert>
          )}

          {/* Password Change Section */}
          <CForm className={`${isLightMode ? 'p-black' : 'p-white'}`} onSubmit={handleSubmit}>
            <CFormInput
              type="password"
              name="currentPassword"
              label="Current Password"
              placeholder="Enter current password"
              className="mb-3"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            <CFormInput
              type="password"
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              className="mb-3"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <CFormInput
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm new password"
              className="mb-4"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <CButton type="submit" className="linear-grad p-white mb-4">
              Change Password
            </CButton>
          </CForm>

          <hr />

          {/* 2FA Toggle */}
          <div className='mb-3'>
            <div className='d-flex justify-content-between align-items-center'>
              <label className={`${isLightMode ? 'p-black' : 'p-white'} fw-bold mb-0`}>
                Two-Factor Authentication (2FA)
              </label>
              <CFormSwitch
                checked={is2FAEnabled}
                onChange={handleToggle2FA}
              />
            </div>
          </div>

          {/* 2FA Setup Section */}
          <CCollapse visible={show2FASetup}>
            <div className="p-3 border rounded bg-light text-dark">
              <p>
                To set up 2FA, scan the QR code using Google Authenticator or any TOTP-compatible app.
              </p>
              <p>
                After scanning, enter the 6-digit code to verify and complete the setup.
              </p>
              <CButton className="linear-grad p-white mt-2">
                Setup 2FA
              </CButton>
            </div>
          </CCollapse>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AccountSecurity;
