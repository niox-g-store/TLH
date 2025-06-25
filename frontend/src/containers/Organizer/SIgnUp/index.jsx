import React, { useState } from "react";

import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { BackIcon } from "../../../components/Common/Icons/Back";

const OrganizerSignUp = () => {
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
        <div className="signup">
            <Link className="back-to-home" to="/">
              <BackIcon />
              <p> Back to Home</p>
            </Link>
          <div data-aos="fade-up" className={`col-login-form  ${submitted ? "toggle " : " "}`}>
            <h1>Become an event organizer</h1>
            <h4 className="p-content p-black">The world’s waiting for your next event. Let’s make it happen.</h4>
            <form method="post">

              <div className="form-field-section">
              <div className="form-field-left">
                <div className="first-name form-field">
                  <div className="form-label">
                    <label htmlFor="fname">Username</label>
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
                  <label htmlFor="email">Company name</label>
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
                  <label htmlFor="pass">Email</label>
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
              </div>





                {/** */}
              <div className="form-field-right">
                <div className="first-name form-field">
                  <div className="form-label">
                    <label htmlFor="fname">Phone number</label>
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
                  <label htmlFor="email">Password</label>
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

                {/** */}


              <div className="form-field input create-account">
                <input
                  type="submit"
                  value="Create Account"
                  className="form-btn"
                />
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizerSignUp;
