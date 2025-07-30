import React from "react";
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import actions from '../../actions';
import SignForm from "../../components/Common/SignUpForm/";

const Signup = (props) => {
  const {
    signupChange,
    subscribeChange,
    signupFormData,
    formErrors,
    isLoading,
    isSubmitting,
    isSubscribed,
    signUpSubmit,
    comparePasswords,
    signupReset,
    authenticated,
    googleSignup,
    showOtpModal,
    setOtpModal,
    otpCode,
    otpChange,
    verifyOtp,
    otpErrors
  } = props;

  if (authenticated) return <Navigate to='/dashboard' />;

  return (
    <SignForm {...props}/>
  );
};


const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    signupFormData: state.signup.signupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting,
    isSubscribed: state.signup.isSubscribed,
    showOtpModal: state.signup.showOtpModal,
    otpCode: state.signup.otpCode,
    otpErrors: state.signup.otpErrors
  };
};

export default connect(mapStateToProps, actions)(Signup);
