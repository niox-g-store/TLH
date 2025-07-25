import React from "react";
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import actions from '../../actions';
import LoginForm from "../../components/Common/LoginForm";

const Login = (props) => {
  const {
      authenticated,
      loginFormData,
      loginChange,
      login,
      formErrors,
      isLoading,
      isSubmitting,
      rememberMeChange,
      rememberMe,
      twoFaLogin,
      twoFaPromptToggle,
      twoFaPrmpt
  } = props;
  if (authenticated) return <Navigate to='/dashboard' />;
  return (
    <>
      <LoginForm {...props}/>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting,
    rememberMe: state.login.rememberMe,
    twoFaPrmpt: state.login.twoFaPrmpt
  };
};

export default connect(mapStateToProps, actions)(Login);
