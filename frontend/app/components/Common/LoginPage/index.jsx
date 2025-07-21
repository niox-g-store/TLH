import "./Login.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { BackIcon } from "../Icons/Back";
import Input from "../HtmlTags/Input";
import SigninProvider from "../../store/SignInProvider";
import LoadingIndicator from "../../store/LoadingIndicator";
import TwoFactorPrompt from "../../store/TwoFactorPrompt";

const logo = "./assets/login.JPG";
const LoginForm = (props) => {
  const {
    loginFormData,
    loginChange,
    login,
    formErrors,
    isLoading,
    isSubmitting,
    rememberMeChange,
    rememberMe,
    googleSignin,
    twoFaPrmpt,
  } = props;
  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="login">
      {isLoading && <LoadingIndicator />}
      <div className="left-login">
        <img src={logo} width="100%" height="100%" alt="Login Visual" />
      </div>

      <div className="right-login">
        <Link className="back-to-home" to="/">
          <BackIcon color={"purple"}/>
          <p style={{ fontSize: '16px' }} className="p-purple">Back to Home</p>
        </Link>

        <div className="col-login-form" data-aos="fade-up">
          <h1 className="p-black">Hi there!</h1>
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
                  label="Remember Me"
                />
              </div>

              <div className="forget-pass">
                <a href="/forgot-password">Forget Password?</a>
              </div>
            </div>

            <div className="form-field input login-btn">
              <Input
                type="submit"
                value={isSubmitting ? "Logging In..." : "Log in"}
                className="p-white form-btn font-family-default"
                disabled={isSubmitting || isLoading}
              />
            </div>
          </form>

          <div className="or-line login-btn">
            <span className="first"> </span>
              <span>or</span>
            <span className="second"></span>
          </div>

          <div className="login-btn">
            <SigninProvider googleSignin={(v) => googleSignin(v)}/>
          </div>

          <div className="create-account-links">
            <p className="p-black">
              Haven't signed up?
              <span className="h6">
                <Link to="/signup">Create Account</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
      {twoFaPrmpt && <TwoFactorPrompt {...props}/> }
    </div>
  );
};

export default LoginForm;
