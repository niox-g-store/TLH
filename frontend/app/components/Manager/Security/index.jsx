import {
  CCard,
  CCardBody,
  CCardTitle,
  CForm,
  CButton,
  CAlert,
  CFormSwitch,
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle
} from '@coreui/react';
import React, { useState } from 'react';
import Input from '../../Common/HtmlTags/Input';
import actions from '../../../actions';
import { connect } from 'react-redux';
import LoadingIndicator from '../../store/LoadingIndicator';
import Button from '../../Common/HtmlTags/Button';

const AccountSecurityForm = (props) => {
  const {
    isLightMode, resetFormData,
    handleToggle2FA, resetAccountPassword,
    accountResetPasswordChange, formErrors,
    isLoading, user
  } = props;

  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    resetAccountPassword();
  };

  const handle2FAToggle = async () => {
    if (user.isTwoFactorActive) {
      // User cannot turn off 2FA once enabled
      return;
    }

    setSetupLoading(true);
    try {
      // Generate 2FA setup (this would be an API call)
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
      setSecretKey(data.secret);
      setShow2FASetup(true);
    } catch (error) {
      console.error('Error setting up 2FA:', error);
    } finally {
      setSetupLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    setSetupLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: verificationCode,
          secret: secretKey
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShow2FASetup(false);
        alert('2FA has been successfully enabled!');
        window.location.reload(); // Refresh to update user state
      } else {
        alert('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      alert('Error verifying code. Please try again.');
    } finally {
      setSetupLoading(false);
    }
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    alert('Secret key copied to clipboard!');
  };

  return (
    <div data-aos="fade-up" className="container-lg px-4 mb-5">
      {isLoading && <LoadingIndicator />}
      <CCard className={`${isLightMode ? '' : 'border-0'}`}>
        <CCardBody className={`${isLightMode ? 'bg-white' : 'bg-black'}`}>
          <CCardTitle className={`${isLightMode ? 'p-black' : 'p-white'} mb-3 font-size-30`}>
            Account Security
          </CCardTitle>

          {/* Password Change Section */}
          <CForm className={`${isLightMode ? 'p-black' : 'p-white'}`} onSubmit={handleSubmit}>
            <Input
              type="password"
              name="password"
              label="Old Password"
              placeholder="Enter Old password"
              className="mb-3"
              value={resetFormData.password}
              error={formErrors['password']}
              onInputChange={(name, value) => {
                accountResetPasswordChange(name, value);
              }}              
            />
            <Input
              type="password"
              name="confirmPassword"
              label="New Password"
              placeholder="Enter new password"
              className="mb-4"
              value={resetFormData.confirmPassword}
              error={formErrors['confirmPassword']}
              onInputChange={(name, value) => {
                accountResetPasswordChange(name, value);
              }}              
            />
            <CButton type="submit" className="linear-grad p-white mb-4">
              Change Password
            </CButton>
          </CForm>

          <hr />

          {/* 2FA Toggle */}
          <div className='mb-3'>
            <div className='d-flex justify-content-between align-items-center'>
              <div>
                <label className={`${isLightMode ? 'p-black' : 'p-white'} fw-bold mb-0`}>
                  Two-Factor Authentication (2FA)
                </label>
                {user.isTwoFactorActive && (
                  <p className={`${isLightMode ? 'text-muted' : 'text-gray'} small mb-0`}>
                    2FA is enabled and cannot be disabled for security reasons
                  </p>
                )}
              </div>
              <CFormSwitch
                checked={user.isTwoFactorActive}
                onChange={handle2FAToggle}
                disabled={user.isTwoFactorActive || setupLoading}
              />
            </div>
          </div>

          {/* 2FA Setup Modal */}
          <CModal visible={show2FASetup} onClose={() => setShow2FASetup(false)} alignment="center">
            <CModalHeader>
              <CModalTitle>Set up Two-Factor Authentication</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {setupLoading ? (
                <LoadingIndicator />
              ) : (
                <div className="text-center">
                  <p className="mb-3">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  
                  {qrCodeUrl && (
                    <div className="mb-3">
                      <img src={qrCodeUrl} alt="2FA QR Code" className="img-fluid" />
                    </div>
                  )}
                  
                  <p className="mb-2">Or manually enter this secret key:</p>
                  <div className="d-flex align-items-center mb-3">
                    <code className="flex-grow-1 p-2 bg-light text-dark rounded">
                      {secretKey}
                    </code>
                    <CButton 
                      color="secondary" 
                      size="sm" 
                      className="ms-2"
                      onClick={copySecretKey}
                    >
                      Copy
                    </CButton>
                  </div>
                  
                  <p className="mb-3">
                    After scanning or entering the code, enter the 6-digit verification code:
                  </p>
                  
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onInputChange={(name, value) => setVerificationCode(value)}
                    className="mb-3"
                  />
                  
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      text="Verify & Enable 2FA"
                      onClick={verify2FA}
                      disabled={!verificationCode || verificationCode.length !== 6}
                    />
                    <CButton 
                      color="secondary" 
                      onClick={() => setShow2FASetup(false)}
                    >
                      Cancel
                    </CButton>
                  </div>
                </div>
              )}
            </CModalBody>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  );
};

class AccountSecurity extends React.PureComponent {
  render() {
    return (
      <AccountSecurityForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  resetFormData: state.account.resetFormData,
  formErrors: state.account.formErrors,
  isLoading: state.account.isLoading,
  isLightMode: state.dashboard.isLightMode,
  user: state.account.user
});

export default connect(mapStateToProps, actions)(AccountSecurity);