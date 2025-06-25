import React, { useState, memo } from "react";
import GoogleLogo from "../../../public/assets/google-logo.svg";
import "./Login.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import { doLogin } from "../../../../Backend/auth";
import UserDb from "../../pages/UserDb";
import { BackIcon } from "../Common/Icons/Back";
import Input from "../Common/HtmlTags/Input";

const LoginForm = () => {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState();
  const navigate = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const logo = "./assets/login.JPG"

  return (
    <>
      <div className="login">
        <div className="left-login">
          <img
            src={logo}
            width={"100%"}
            height={"100%"}
          />
        </div>
        <div className="right-login">
            <Link className="back-to-home" to="/">
              <BackIcon />
              <p> Back to Home</p>
            </Link>
          <div className="col-login-form" data-aos="fade-up">
            <h1>Hi there!</h1>
            <p className="p-content p-black">Log in as a User or Access Your Organizer Account</p>
            <form method="post">
              <div className="form-field email">
                  <Input type={"email"} label={"Email/Username"}/>
              </div>
              <div className="form-field password">
                  <Input type={"password"} label={"Password"}/>
              </div>
              <div className="forget-pass-sec">
                <div className="remember-me">
                  <Input type={"checkbox"} />&nbsp; &nbsp;
                  <div className="form-label">
                    <label>Remember Me</label>
                  </div>
                </div>
                <div className="forget-pass">
                  <a href="#">Forget Password?</a>
                </div>
              </div>
              <div className="form-field input login-btn">
                <Input type={"submit"} value={"Log in"} className={"form-btn"} />
              </div>
            </form>
            <div className="or-line login-btn">
              <p>
                <span>or</span>
              </p>
            </div>
            <div className="google-btn login-btn">
              <a href="https://accounts.google.com/v3/signin/identifier?hl=en-gb&ifkv=ATuJsjxhaMNjAdBT4wg9095p_x1QpK7uahzPPfHwnA_2uc_iFr9zJO3yoQcwfW9JcdvmKJQLmYFA&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1863207922%3A1710508530091824&theme=glif&ddm=0">
                <span>
                  <img src={GoogleLogo} />
                  Log In to Google
                </span>
              </a>
            </div>
            <div className="create-account-links">
              <p>
                Haven't sign up?
                <span className="h6">
                  <Link to="/signup">Create Account</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(LoginForm);
