import React from "react";
import LoginForm from "../../components/Common/LoginPage/LoginForm";

const Login = () => {
  return (
    <>
      <LoginForm />
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
  };
};

export default connect(mapStateToProps, actions)(Login);
