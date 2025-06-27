import React from "react";
import { connect } from 'react-redux';
import actions from '../../actions';
import SignForm from "../../components/Common/SignForm/index.jsx";

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
    signupReset
  } = props;

  return (
    <SignForm {...props}/>
  );
};


const mapStateToProps = (state) => {
  return {
    signupFormData: state.signup.signupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting,
    isSubscribed: state.signup.isSubscribed,
  };
};

export default connect(mapStateToProps, actions)(Signup);
