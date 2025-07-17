/*
 *
 * ForgotPassword
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import Row from '../../components/Common/Row';
import Col from '../../components/Common/Col';
import { Link } from 'react-router-dom';

import actions from '../../actions';
import Input from '../../components/Common/HtmlTags/Input';
import Button from '../../components/Common/HtmlTags/Button';
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";

class ForgotPassword extends React.PureComponent {
  render() {
    const {
      authenticated,
      forgotFormData,
      formErrors,
      forgotPasswordChange,
      forgotPassowrd
    } = this.props;

    if (authenticated) return <Navigate to='/dashboard' />;

    const handleSubmit = event => {
      event.preventDefault();
      const n = useNavigate()
      forgotPassowrd(n);
    };

    return (
      <div className='forgot-password-form'>
        <h3>Forgot Password</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs='12' md='6'>
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
            </Col>
          </Row>
          <hr />
          <div className='d-flex flex-column flex-md-row align-items-md-center forgot_password_div'>
            <Button
              className='mb-3 mb-md-0 signup_signup padding_top_extender'
              type='submit'
              text='Send Email'
            />
            <Link className='mt-3 mt-md-0 redirect-link signup_login' to={'/login'}>
            <Button className='padding_top_extender' type='btn-secondary' text='Back to login'>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    forgotFormData: state.forgotPassword.forgotFormData,
    formErrors: state.forgotPassword.formErrors
  };
};

export default connect(mapStateToProps, actions)(ForgotPassword);
