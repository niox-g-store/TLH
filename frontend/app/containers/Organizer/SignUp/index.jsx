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
import LoadingIndicator from '../../../components/store/LoadingIndicator';
import { CModal, CModalBody, CModalHeader, CButton } from '@coreui/react';

const OrganizerSignUp = (props) => {
  const {
    organizerSignupFormData, authenticated, organizerSignupSubmit, comparePasswords,
    formErrors, isLoading, isSubscribed, organizerSignupChange, subscribeChange,
    showOtpModal, setOtpModal, otpCode, otpChange, verifyOtp, otpErrors
  } = props;

  if (authenticated) return <Navigate to='/dashboard' replace/>;

  const handleSubmit = (e) => {
    e.preventDefault();
    organizerSignupSubmit();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    verifyOtp(true);
  };

  return (
    <>
      <div className='login sing'>
        <div className='signup'>
          {isLoading && <LoadingIndicator />}
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
                      <Input
                        name='checkbox'
                        checked={isSubscribed}
                        onInputChange={(n, v) => subscribeChange()}
                        type='checkbox'
                        label="I want to recieve updates about The link hangouts"
                      />
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

        {/* OTP Modal */}
        <CModal visible={showOtpModal} onClose={() => setOtpModal(false)} alignment="center">
          <CModalHeader>
            <h5>Verify Your Email</h5>
          </CModalHeader>
          <CModalBody>
            <div className="text-center">
              <p className="mb-3">
                We've sent a 6-digit verification code to your email address. Please enter it below to complete your organizer registration.
              </p>
              
              <form onSubmit={handleOtpSubmit}>
                <Input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  error={otpErrors.otp}
                  onInputChange={(name, value) => otpChange(value)}
                  className="mb-3"
                  style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
                />
                
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    type="submit"
                    disabled={!otpCode || otpCode.length !== 6 || isLoading}
                    style={{
                      backgroundColor: 'var(--primary_color)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      cursor: otpCode && otpCode.length === 6 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <CButton 
                    color="secondary" 
                    onClick={() => setOtpModal(false)}
                  >
                    Cancel
                  </CButton>
                </div>
              </form>
            </div>
          </CModalBody>
        </CModal>
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
    isSubscribed: state.signup.isSubscribed,
    showOtpModal: state.signup.showOtpModal,
    otpCode: state.signup.otpCode,
    otpErrors: state.signup.otpErrors
  };
};

export default connect(mapStateToProps, actions)(OrganizerSignUp);
