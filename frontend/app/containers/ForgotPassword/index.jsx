/*
 *
 * ForgotPassword
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from '../../actions';
import Input from '../../components/Common/HtmlTags/Input';
import Button from '../../components/Common/HtmlTags/Button';
import { useNavigate, Navigate } from 'react-router-dom';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import { BackIcon } from '../../components/Common/Icons/Back';

const ForgotPasswordForm = (props) => {
  const {
    authenticated,
    forgotFormData,
    formErrors,
    forgotPasswordChange,
    forgotPassowrd,
    isLoading
  } = props;
    if (authenticated) return <Navigate to='/dashboard' />;
    const n = useNavigate()

    const handleSubmit = event => {
      event.preventDefault();
      forgotPassowrd(n);
    };

    return (
      <div className='forgot-password-form p-black'>
        { isLoading && <LoadingIndicator /> }
        <Link className="back-to-home" to="/">
          <BackIcon color={"purple"}/>
          <p style={{ fontSize: '16px' }} className="p-purple">Back to Home</p>
        </Link>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type={'text'}
            error={formErrors['email']}
            label={'Email Address'}
            name={'email'}
            placeholder={'Please Enter Your Email'}
            value={forgotFormData.email}
            onInputChange={(name, value) => {
              forgotPasswordChange(name, value);
            }}
          />
          <div style={{ justifyContent: 'space-between' }} className='mt-5 d-flex flex-md-row align-items-md-center'>
            <Button
              text='Send Email'
            />
            <Link className='mt-md-0' to={'/login'}>
            <Button className='padding_top_extender' type='last' text='Back to login'>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
}

class ForgotPassword extends React.PureComponent {
  render () {
    return ( <ForgotPasswordForm { ...this.props } /> )
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    forgotFormData: state.forgotPassword.forgotFormData,
    formErrors: state.forgotPassword.formErrors,
    isLoading: state.forgotPassword.isLoading,
  };
};

export default connect(mapStateToProps, actions)(ForgotPassword);
