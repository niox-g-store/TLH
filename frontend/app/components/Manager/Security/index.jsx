import {
  CCard,
  CCardBody,
  CCardTitle,
  CForm,
  CButton,
  CAlert,
  CFormSwitch,
  CCollapse
} from '@coreui/react';
import React from 'react';
import Input from '../../Common/HtmlTags/Input';
import actions from '../../../actions';
import { connect } from 'react-redux';
import LoadingIndicator from '../../store/LoadingIndicator';

const AccountSecurityForm = (props) => {
  const {
    isLightMode, resetFormData,
    handleToggle2FA, resetAccountPassword,
    resetPasswordChange, formErrors,
    isLoading
  } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetAccountPassword();
  };
  return (
    <div data-aos="fade-up" className="container-lg px-4 mb-5">
      { isLoading && <LoadingIndicator /> }
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
                resetPasswordChange(name, value);
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
                resetPasswordChange(name, value);
              }}              
            />
            <CButton type="submit" className="linear-grad p-white mb-4">
              Change Password
            </CButton>
          </CForm>

          <hr />

          {/* 2FA Toggle */}
          {/*<div className='mb-3'>
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
          </CCollapse>*/}
        </CCardBody>
      </CCard>
    </div>
  );
};

class AccountSecurity extends React.PureComponent {
  componentDidMount() {
    const token = this.props.match.params.token;
    if (token) {
      this.props.resetPassword(token);
    }
  }
  render () {
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
});
export default connect(mapStateToProps, actions)(AccountSecurity);
