import "./Login.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { BackIcon } from "../Icons/Back";
import Input from "../HtmlTags/Input";

const logo = "./assets/login.JPG";
const GoogleLogo = "./assets/google-logo.svg";

const LoginForm = (props) => {
  const {
    loginFormData,
    loginChange,
    login,
    formErrors,
    isLoading,
    isSubmitting,
    rememberMeChange,
    rememberMe
  } = props;
  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="login">
      <div className="left-login">
        <img src={logo} width="100%" height="100%" alt="Login Visual" />
      </div>

      <div className="right-login">
        <Link className="back-to-home" to="/">
          <BackIcon />
          <p>Back to Home</p>
        </Link>

        <div className="col-login-form" data-aos="fade-up">
          <h1>Hi there!</h1>
          <p className="p-content p-black">
            Log in as a User or Access Your Organizer Account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-field email">
              <Input
                type="text"
                label="Email/Username"
                name="email"
                value={loginFormData.email}
                error={formErrors?.email}
                onInputChange={(n, v) => loginChange(n, v)}
              />
            </div>

            <div className="form-field password">
              <Input
                type="password"
                label="Password"
                name="password"
                value={loginFormData.password}
                error={formErrors?.password}
                onInputChange={(n, v) => loginChange(n, v)}
              />
            </div>

            <div className="forget-pass-sec">
              <div className="remember-me">
                <Input
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onInputChange={(n, v) => rememberMeChange()}
                />
                &nbsp;&nbsp;
                <div className="form-label">
                  <label>Remember Me</label>
                </div>
              </div>

              <div className="forget-pass">
                <a href="#">Forget Password?</a>
              </div>
            </div>

            <div className="form-field input login-btn">
              <Input
                type="submit"
                value={isSubmitting ? "Logging In..." : "Log in"}
                className="form-btn"
                disabled={isSubmitting || isLoading}
              />
            </div>
          </form>

          <div className="or-line login-btn">
            <p>
              <span>or</span>
            </p>
          </div>

          <div className="google-btn login-btn">
            <a
              href="https://accounts.google.com/v3/signin/identifier?hl=en-gb"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <img src={GoogleLogo} alt="Google Logo" />
                Log In to Google
              </span>
            </a>
          </div>

          <div className="create-account-links">
            <p>
              Haven't signed up?
              <span className="h6">
                <Link to="/signup">Create Account</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
