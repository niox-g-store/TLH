import React, { useState } from "react";

import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { BackIcon } from "../../../components/Common/Icons/Back";
import Input from "../../../components/Common/HtmlTags/Input";

const OrganizerSignUp = () => {
  const submitted = false;
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  
  const handleCheckboxChange = (name, value) => {
    if (name === 'checkbox') {
      setIsChecked(value);
    }
  };

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
                  <Input type={"text"} label={"Username"} />
              </div>
                <div className="form-field email">
                  <Input type={"text"} label={"Company name"} />
              </div>

              <div className="form-field password">
                  <Input type={"email"} label={"Email"} />
              </div>
              </div>





                {/** */}
              <div className="form-field-right">
                <div className="first-name form-field">
                  <Input type={"text"} label={"Phone Number"} />
              </div>
              <div className="form-field email">
                  <Input type={"password"} label={"Password"} />
              </div>

              <div className="form-field password">
                  <Input type={"password"} label={"Confirm Password"} />
              </div>
              <div className="form-field input create-account-large-screen">
                <input
                  type="submit"
                  value="Create Account"
                  className="form-btn"
                />
              </div>

              <div className="forget-pass-sec">
                <div className="remember-me signup">
                  <Input name={"checkbox"} checked={isChecked} onInputChange={handleCheckboxChange} type={"checkbox"}/>&nbsp;&nbsp;
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

              <div className="large-screens">
              <div className="forget-pass-sec-large-screen">
                <div className="remember-me signup">
                  <Input name={"checkbox"} checked={isChecked} onInputChange={handleCheckboxChange} type={"checkbox"}/>&nbsp;&nbsp;
                  <div className="form-label">
                    <label>I want to recieve updates about The link hangouts</label>
                  </div>
                </div>
              </div>
              <div className="create-account-links-large-screen">
                <p>
                  Already have an account? &nbsp;
                <span className="h6">
                  <Link to="/login">Log In</Link>
                </span>
              </p>
            </div>
            </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizerSignUp;
