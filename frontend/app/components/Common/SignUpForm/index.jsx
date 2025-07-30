import React from "react";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Input from "../HtmlTags/Input";
import { BackIcon } from "../Icons/Back";
import SignupProvider from "../../store/SignUpProvider";
import LoadingIndicator from "../../store/LoadingIndicator";
import { CModal, CModalBody, CModalHeader, CButton } from '@coreui/react';

const SignForm = (props) => {
  const {
    signupFormData,
    signupChange,
    subscribeChange,
    formErrors,
    isLoading,
    isSubmitting,
    isSubscribed,
    signUpSubmit,
    comparePasswords,
    signupReset,
    googleSignup,
    showOtpModal,
    setOtpModal,
    otpCode,
    otpChange,
    verifyOtp,
    otpErrors
  } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpSubmit()
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    verifyOtp(false);
  };

  return (
    <div className="n-signup bg-white">
      {isLoading && <LoadingIndicator />}
      <div className="signup signup-left">
        <Link className="back-to-home" to="/" onClick={signupReset}>
          <BackIcon />
          <p style={{ fontSize: '16px' }} className="p-purple">Back to Home</p>
        </Link>

        <div data-aos="fade-up" className="col-login-form">
          <h1 className="p-black">Join The Link Hangouts!</h1>
          <p className="p-content p-black">
            Join our community to discover and attend amazing events near you.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <Input
                type="text"
                label="Name"
                name="name"
                value={signupFormData.name}
                error={formErrors?.name}
                onInputChange={(n, v) => signupChange(n, v)}
              />
            </div>

            <div className="form-field">
              <Input
                type="text"
                label="Username"
                name="userName"
                value={signupFormData.userName}
                error={formErrors?.userName}
                onInputChange={(n, v) => signupChange(n, v)}
              />
            </div>

            <div className="form-field email">
              <Input
                type="email"
                label="Email"
                name="email"
                value={signupFormData.email}
                error={formErrors?.email}
                onInputChange={(n, v) => signupChange(n, v)}
              />
            </div>

            <div className="form-field password">
              <Input
                type="password"
                label="Password"
                name="password"
                value={signupFormData.password}
                error={formErrors?.password}
                onInputChange={(n, v) => {
                  signupChange(n, v);
                  comparePasswords(v, signupFormData.confirmPassword)
                }}
              />
            </div>

            <div className="form-field password">
              <Input
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={signupFormData.confirmPassword}
                error={formErrors?.confirmPassword}
                onInputChange={(n, v) => {
                  signupChange(n, v);
                  comparePasswords(signupFormData.password, v)
                }}
              />
            </div>

                  <Input
                    className="mb-3"
                    type="checkbox"
                    name="checkbox"
                    checked={isSubscribed}
                    onInputChange={(n, v) => subscribeChange()}
                    label="I want to receive updates about The Link Hangouts"
                  />

            <div className="form-field input">
              <Input
                type="submit"
                value={isSubmitting ? "Creating Account..." : "Create Account"}
                className="form-btn font-family-default p-white"
                disabled={isLoading || isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="signup-right">
          <SignupProvider googleSignup={(v) => googleSignup(v)}/>

        <div className="create-account-links">
          <p className="p-black">
            Already have an account?
            <span className="h6">
              <Link to="/login">Log In</Link>
            </span>
          </p>
          <p className="p-black">
            Want to host events?
            <span className="h6">
              <Link to="/organizer-signup">Create an organizer account</Link>
            </span>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <CModal visible={showOtpModal} onClose={() => setOtpModal(false)} alignment="center">
        <CModalHeader>
          <h5>Verify Your Email</h5>
        </CModalHeader>
        <CModalBody>
          <div className="text-center">
            <p className="mb-3">
              We've sent a 6-digit verification code to your email address. Please enter it below to complete your registration.
            </p>
            
            <form onSubmit={handleOtpSubmit}>
              <Input
                type="text"
                name="otp"
                placeholder="Enter 6-digit code"
                value={otpCode}
                error={otpErrors.otp}
                onInputChange={(name, value) => otpChange(value)}
                className="mb-3"
                style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
              />
              
              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="submit"
                  disabled={!otpCode || otpCode.length !== 6 || isLoading}
                  style={{
                    backgroundColor: 'var(--primary_color)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: otpCode && otpCode.length === 6 ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
                <CButton 
                  color="secondary" 
                  onClick={() => setOtpModal(false)}
                >
                  Cancel
                </CButton>
              </div>
            </form>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default SignForm;
