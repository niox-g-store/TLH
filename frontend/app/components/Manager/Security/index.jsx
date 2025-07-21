import {
  CCard,
  CCardBody,
  CCardTitle,
  CForm,
  CButton,
  CFormSwitch,
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
import { withRouter } from '../../../withRouter';
import { ROLES } from '../../../constants';

const AccountSecurityForm = (props) => {
  let {
    isLightMode, resetFormData,
    verifyTwoFactor, resetAccountPassword,
    accountResetPasswordChange, formErrors,
    code, twoFaVerificationCodeChange, qrCodeUrl,
    isLoading, user, setupTwoFactor, secretKey,
    twoFactorFormError, setShow2FASetup, show2FASetup
  } = props;
  const [copied, setCopied] = useState(false);
  if (user.role === ROLES.Member) { isLightMode = false }

  const handleSubmit = (e) => {
    e.preventDefault();
    resetAccountPassword();
  };

  const handle2FAToggle = () => {
    if (user.isTwoFactorActive) { return; }
    setShow2FASetup(true);
    setupTwoFactor();
  };

  const verify2FA = () => {
    verifyTwoFactor();
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
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
          <CForm className={`${isLightMode ? 'p-black' : 'p-white'} d-flex flex-column`} onSubmit={handleSubmit}>
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
                  <p className={`${isLightMode ? 'p-black' : 'p-white'} small mb-0`}>
                    2FA is enabled and cannot be disabled for security reasons
                  </p>
                )}
              </div>
              <CFormSwitch
                checked={user.isTwoFactorActive}
                onChange={handle2FAToggle}
                disabled={user.isTwoFactorActive}
              />
            </div>
          </div>

          {/* 2FA Setup Modal */}
          <CModal visible={show2FASetup} onClose={() => setShow2FASetup(false)} alignment="center">
            <CModalHeader>
              <CModalTitle>Set up Two-Factor Authentication</CModalTitle>
            </CModalHeader>
            <CModalBody>
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
                  <div className="d-flex align-items-center mb-3 flex-wrap">
                    <code className="flex-grow-1 p-2 bg-light text-dark rounded w-100">
                      {secretKey}
                    </code>
                    <CButton 
                      color="secondary" 
                      size="sm"
                      onClick={copySecretKey}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </CButton>
                  </div>
                  
                  <p className="mb-3">
                    After scanning or entering the code, enter the 6-digit verification code:
                  </p>
                  
                  <Input
                    type="text"
                    name="code"
                    error={twoFactorFormError.code}
                    placeholder="Enter 6-digit code"
                    value={code}
                    onInputChange={(name, value) => twoFaVerificationCodeChange(name, value)}
                    className="mb-3"
                  />
                  
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      text="Verify & Enable 2FA"
                      onClick={verify2FA}
                      disabled={!code || code.length !== 6}
                    />
                    <CButton 
                      color="secondary" 
                      onClick={() => setShow2FASetup(false)}
                    >
                      Cancel
                    </CButton>
                  </div>
                </div>
            </CModalBody>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  );
};

class AccountSecurity extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.fetchProfile();
    }
  }
  render() {
    return (
      <AccountSecurityForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  resetFormData: state.account.resetFormData,
  formErrors: state.account.formErrors,
  twoFactorFormError: state.account.twoFactorFormError,
  code: state.account.twoFactor.code,
  secretKey: state.account.twoFactor.secret,
  qrCodeUrl: state.account.twoFactor.qrCodeUrl,
  show2FASetup: state.account.show2FASetup,
  isLoading: state.account.isLoading,
  isLightMode: state.dashboard.isLightMode,
  user: state.account.user
});

export default connect(mapStateToProps, actions)(withRouter(AccountSecurity));