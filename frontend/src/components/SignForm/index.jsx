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
import Input from "../Common/HtmlTags/Input";

const SignForm = () => {
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

  const GoogleLogo = "../../../assets/google-logo.svg";
  return (
    <>
      <div className="n-signup">
        <div className="signup signup-left">
            <Link className="back-to-home" to="/">
              <BackIcon />
              <p> Back to Home</p>
            </Link>
          <div data-aos="fade-up" className={`col-login-form`}>
            <h1>Join The Link Hangouts!</h1>
            <p className="p-content p-black">Join our community to discover and attend amazing events near you.</p>
            <form method="post">
                <div className="first-name form-field">
                  <Input type={"text"} label={"Name"}/>
                </div>
                <div className="first-name form-field">
                  <Input type={"text"} label={"Username"}/>
                </div>

                <div className="form-field email">
                  <Input type={"email"} label={"email"} />
                </div>

                <div className="form-field password">
                  <Input type={"password"} label={"password"} />
                </div>

                <div className="form-field password">
                  <Input type={"password"} label={"Confirm password"} />
                </div>

              <div className="forget-pass-sec">
                <div className="remember-me signup">
                  <div className="input">
                    <Input name={"checkbox"} checked={isChecked} onInputChange={handleCheckboxChange} type={"checkbox"}/>
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
