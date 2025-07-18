import './style.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import actions from '../../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BackIcon } from '../../../components/Common/Icons/Back';
import Input from '../../../components/Common/HtmlTags/Input';
import { Navigate } from 'react-router-dom';

const OrganizerSignUp = (props) => {
  const {
    organizerSignupFormData, authenticated, organizerSignupSubmit, comparePasswords,
    formErrors, isLoading, isSubscribed, organizerSignupChange, subscribeChange
  } = props;

  if (authenticated) return <Navigate to='/dashboard' replace/>;

  const handleSubmit = (e) => {
    e.preventDefault();
    organizerSignupSubmit();
  }

  return (
    <>
      <div className='login sing'>
        <div className='signup'>
          <Link className='back-to-home' to='/'>
            <BackIcon />
            <p style={{ fontSize: '16px' }} className='p-purple'> Back to Home</p>
          </Link>
          <div data-aos='fade-up' className='col-login-form'>
            <h1 className='p-black'>Become an event organizer</h1>
            <h4 className='p-content p-black'>The world’s waiting for your next event. Let’s make it happen.</h4>
            <form method='post' onSubmit={handleSubmit}>

              <div className='form-field-section'>
                <div className='form-field-left'>
                  <div className='first-name form-field'>
                    <Input
                      type='text'
                      name='userName'
                      label='Username'
                      value={organizerSignupFormData.userName}
                      error={formErrors?.userName}
                      onInputChange={(n, v) => organizerSignupChange(n, v)}
                    />
                  </div>
                  <div className='form-field email'>

                    <Input
                      type='text'
                      name='companyName'
                      label='Company name'
                      value={organizerSignupFormData.companyName}
                      error={formErrors?.companyName}
                      onInputChange={(n, v) => organizerSignupChange(n, v)}
                    />
                  </div>

                  <div className='form-field password'>
                    <Input
                      type='email'
                      name='email'
                      label='Email'
                      value={organizerSignupFormData.email}
                      error={formErrors?.email}
                      onInputChange={(n, v) => organizerSignupChange(n, v)}
                    />
                  </div>
                </div>

                {/** */}
                <div className='form-field-right'>
                  <div className='first-name form-field org-phone-input'>
                    <Input type={"phone"}
                       val={organizerSignupFormData.phoneNumber}
                       error={formErrors?.phoneNumber}
                       onPhoneChange={(v) => organizerSignupChange('phoneNumber', v)}
                    />
                  </div>
                  <div className='form-field email'>
                    <Input
                      type='password'
                      label='Password'
                      name='password'
                      value={organizerSignupFormData.password}
                      error={formErrors?.password}
                      onInputChange={(n, v) => {
                        organizerSignupChange(n, v);
                        comparePasswords(v, organizerSignupFormData.confirmPassword);
                      }}
                    />
                  </div>

                  <div className='form-field password'>
                    <Input
                      type='password'
                      label='Confirm Password'
                      name='confirmPassword'
                      value={organizerSignupFormData.confirmPassword}
                      error={formErrors?.confirmPassword}
                      onInputChange={(n, v) => {
                        organizerSignupChange(n, v);
                        comparePasswords(organizerSignupFormData.password, v);
                      }}
                    />
                  </div>
                  <div className='form-field input create-account-large-screen'>
                    <Input
                      type='submit'
                      value='Create Account'
                      style={{ color: 'white' }}
                      className='form-btn font-family-default p-white'
                    />
                  </div>

                  <div className='forget-pass-sec'>
                    <div className='remember-me signup'>
                      <Input name='checkbox' checked={isSubscribed} onInputChange={(n, v) => subscribeChange()} type='checkbox' />&nbsp;&nbsp;
                        <label className='p-black'>I want to recieve updates about The link hangouts</label>
                    </div>
                  </div>
                  <div className='create-account-links'>
                    <p className="p-black">
                      Already have an account?
                      <span className='h6'>
                        <Link to='/login'>Log In</Link>
                  &nbsp; &nbsp; OR &nbsp; <Link to='/signup'>Sign up as a user</Link>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/** */}

              <div className='form-field input create-account'>
                <input
                  type='submit'
                  value='Create Account'
                  style={{ color: 'white' }}
                  className='form-btn font-family-default'
                />
              </div>

              <div className='large-screens'>
                <div className='forget-pass-sec-large-screen'>
                  <div className='remember-me signup'>
                    <Input
                      name='checkbox'
                      checked={isSubscribed}
                      onInputChange={(n, v) => subscribeChange()}
                      type='checkbox'
                    />&nbsp;&nbsp;
                    <div className='form-label'>
                      <label className="p-black">I want to recieve updates about The link hangouts</label>
                    </div>
                  </div>
                </div>
                <div className='create-account-links-large-screen'>
                  <p className="p-black">
                    Already have an account? &nbsp;
                    <span className='h6'>
                      <Link to='/login' className='p-purple'>Log In</Link>
                  &nbsp; &nbsp; OR &nbsp; &nbsp; <Link to='/signup' className='p-purple'>Sign up as a user</Link>
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
const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    organizerSignupFormData: state.signup.organizerSignupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting,
    isSubscribed: state.signup.isSubscribed
  };
};

export default connect(mapStateToProps, actions)(OrganizerSignUp);
