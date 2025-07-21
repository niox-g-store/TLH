/*
 *
 * ResetPassword
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { withRouter } from '../../withRouter';
import actions from '../../actions';
import Input from '../../components/Common/HtmlTags/Input';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import Button from '../../components/Common/HtmlTags/Button';
import { Link } from 'react-router-dom';
import { BackIcon } from '../../components/Common/Icons/Back';

const ResetPasswordForm = (props) => {
  const {
    resetFormData, resetPassword,
    resetPasswordChange, formErrors,
    isLoading, token
  } = props;
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      resetPassword(token, navigate);
    }
  }
  return (
    <div className='forgot-password-form p-black'>
        { isLoading && <LoadingIndicator /> }
        <Link className="back-to-home" to="/">
          <BackIcon color={"purple"}/>
          <p style={{ fontSize: '16px' }} className="p-purple">Back to Home</p>
        </Link>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <Input
              type="password"
              name="password"
              label="New Password"
              placeholder="Enter new password"
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
              label="Confirm Password"
              placeholder="Confirm password"
              className="mb-4"
              value={resetFormData.confirmPassword}
              error={formErrors['confirmPassword']}
              onInputChange={(name, value) => {
                resetPasswordChange(name, value);
              }}              
            />
          <div style={{ justifyContent: 'space-between' }} className='mt-5 d-flex flex-md-row align-items-md-center'>
            <Button text='Change Password'/>
              <Link className='mt-md-0' to={'/login'}>
                <Button className='last' text='Back to login' />
              </Link>
          </div>
        </form>
      </div>
  );
};

class ResetPassword extends React.PureComponent {
  componentDidMount() {
    const token = this.props.match.params.token;
    this.props.setResetPasswordToken(token);
  }

  render() {
    const { authenticated } = this.props;

    if (authenticated) return <Navigate to='/dashboard' />;

    return ( <ResetPasswordForm {...this.props} /> );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    resetFormData: state.resetPassword.resetFormData,
    formErrors: state.resetPassword.formErrors,
    token: state.resetPassword.token,
    isLoading: state.resetPassword.loading
  };
};

export default connect(mapStateToProps, actions)(withRouter(ResetPassword));
