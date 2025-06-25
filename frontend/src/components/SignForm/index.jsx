import React, { useState } from "react";

import logoIMG from "../../../public/assets/logo.png";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import PButton from "../Common/HtmlTags/PrimaryButton/PButton";
import { doLogin } from "../../../../Backend/auth";
import BrandSection from "../BrandSection/BrandSection";
import { BackIcon } from "../Common/Icons/Back";

const SignForm = () => {
  const submitted = false;
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const GoogleLogo = "../../../assets/google-logo.svg";
  return (
    <>
      <div className="n-signup">
        <div className="signup signup-left">
            <Link className="back-to-home" to="/">
              <BackIcon />
              <p> Back to Home</p>
            </Link>
          <div data-aos="fade-up" className={`col-login-form  ${submitted ? "toggle " : " "}`}>
            <h1>Join The Link Hangouts!</h1>
            <p className="p-content p-black">Join our community to discover and attend amazing events near you.</p>
            <form method="post">
                <div className="first-name form-field">
                  <div className="form-label">
                    <label htmlFor="fname">Full Name</label>
                  </div>
                  <div className="input">
                    <input
                      type="text"
                      name="fname"
                      placeholder="Full Name"
                      value={inputs.fname || ""}
                      onChange={handleChange}
                    />
                  </div>
              </div>
              <div className="form-field email">
                <div className="form-label">
                  <label htmlFor="email">Email</label>
                </div>

                <div className={`input ${error ? "active" : ""}`}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="abc@thelinkhangouts.com"
                    value={inputs.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="error-form">
                  {error && (
                    <span className={error ? "active" : ""}>{error}</span>
                  )}
                </div>
              </div>

              <div className="form-field password">
                <div className="form-label">
                  <label htmlFor="pass">Password</label>
                </div>
                <div className="input">
                  <input
                    type="password"
                    id="pass"
                    placeholder="Password"
                    name="current_password"
                    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
                    value={inputs.current_password || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field password">
                <div className="form-label">
                  <label htmlFor="pass">Confirm Password</label>
                </div>
                <div className="input">
                  <input
                    type="password"
                    id="pass"
                    placeholder="Password"
                    name="current_password"
                    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
                    value={inputs.current_password || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="forget-pass-sec">
                <div className="remember-me signup">
                  <div className="input">
                    <input type="checkbox" checked />
                  </div>
                  <div className="form-label">
                    <label>I want to recieve updates about The link hangouts</label>
                  </div>
                </div>
              </div>

              <div className="form-field input">
                <input
                  type="submit"
                  value="Create Account"
                  className="form-btn"
                />
              </div>


            </form>
          </div>
        </div>

      <div className="signup-right">
        <div className="google-btn">
              <a href="https://accounts.google.com/v3/signin/identifier?hl=en-gb&ifkv=ATuJsjxhaMNjAdBT4wg9095p_x1QpK7uahzPPfHwnA_2uc_iFr9zJO3yoQcwfW9JcdvmKJQLmYFA&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1863207922%3A1710508530091824&theme=glif&ddm=0">
                <span>
                  <img src={GoogleLogo} />
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
    </>
  );
};

export default SignForm;
