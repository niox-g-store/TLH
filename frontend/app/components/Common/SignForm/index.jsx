import React from "react";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Input from "../HtmlTags/Input";
import { BackIcon } from "../Icons/Back";

const GoogleLogo = "../../../assets/google-logo.svg";

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
    signupReset
  } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpSubmit()
  };

  return (
    <div className="n-signup">
      <div className="signup signup-left">
        <Link className="back-to-home" to="/" onClick={signupReset}>
          <BackIcon />
          <p>Back to Home</p>
        </Link>

        <div data-aos="fade-up" className="col-login-form">
          <h1>Join The Link Hangouts!</h1>
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

            <div className="forget-pass-sec">
              <div className="remember-me signup">
                <div className="input">
                  <Input
                    type="checkbox"
                    name="checkbox"
                    checked={isSubscribed}
                    onInputChange={(n, v) => subscribeChange()}
                  />
                </div>
                <div className="form-label">
                  <label>I want to receive updates about The Link Hangouts</label>
                </div>
              </div>
            </div>

            <div className="form-field input">
              <Input
                type="submit"
                value={isSubmitting ? "Creating Account..." : "Create Account"}
                className="form-btn font-family-default"
                disabled={isLoading || isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="signup-right">
        <div className="google-btn">
          <a href="https://accounts.google.com/signin">
            <span>
              <img src={GoogleLogo} alt="Google Logo" />
              Log In to Google
            </span>
          </a>
        </div>

        <div className="create-account-links">
          <p>
            Already have an account?
            <span className="h6">
              <Link to="/login">Log In</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignForm;
