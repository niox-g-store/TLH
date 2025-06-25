import React, { useState } from "react";

import ConferenceIMG from "../../../public/assets/conference.png";
import GoogleLogo from "../../../public/assets/google-logo.svg";
import logoIMG from "../../../public/assets/logo.png";
import "./SignForm.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import PButton from "../Common/HtmlTags/PrimaryButton/PButton";
import { doLogin } from "../../../../Backend/auth";
import BrandSection from "../BrandSection/BrandSection";

const SignForm = () => {
  const submitted = false;
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  return (
    <>
      <div className="login sing">
        <div className="left-login">
          <div className="col-login-image">
            <div className="logo-signup">
              <Link to="/">
                <svg
                  fill="currentColor"
                  width="15px"
                  height="15px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <g data-name="Layer 2">
                    <g data-name="arrow-back">
                      <rect
                        width="24"
                        height="24"
                        transform="rotate(90 12 12)"
                        opacity="0"
                      />

                      <path d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23 1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z" />
                    </g>
                  </g>
                </svg>
                <p> Back to Home</p>
              </Link>
            </div>
            <img
              src={ConferenceIMG}
              alt="login-confernce-image"
              width="100%"
              height="100%"
              data-aos="fade-up"
            />
            <h1 className="h2-all-features h2-content h2 p-black">
              Join The Link Hangouts
            </h1>
            <p className="p-all-features p-content h2-content p-black">
              Create an account as a 
            </p>

          </div>
        </div>

        <div className="right-login">
          <div data-aos="fade-up" className={`col-login-form  ${submitted ? "toggle " : " "}`}>
            <h1>Hi there!</h1>
            <p className="p-content"></p>
            <p>Join us to try the different experiments fot the conference</p>
            <form method="post">
              <div className="name">
                <div className="first-name form-field">
                  <div className="form-label">
                    <label htmlFor="fname">First Name</label>
                  </div>
                  <div className="input">
                    <input
                      type="text"
                      name="fname"
                      placeholder="First Name"
                      value={inputs.fname || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="last-name">
                  <div className="form-label">
                    <label htmlFor="lname">Last Name</label>
                  </div>
                  <div className="input">
                    <input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Last Name"
                      value={inputs.lname || ""}
                      onChange={handleChange}
                    />
                  </div>
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
                    placeholder="abc@eventup.com"
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
                    <input type="checkbox" />
                  </div>
                  <div className="form-label">
                    <label>I want to recieve updates about EventUp</label>
                  </div>
                </div>
              </div>
              {/* <div className="form-field input">
                <input type="submit" value="Sign In" className="form-btn" />
              </div> */}
              <div className="form-field input">
                <input
                  type="submit"
                  value="Create Account"
                  className="form-btn"
                />
              </div>
            </form>
            <div className="or-line">
              <p>
                <span>or</span>
              </p>
            </div>
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
      </div>
    </>
  );
};

export default SignForm;
