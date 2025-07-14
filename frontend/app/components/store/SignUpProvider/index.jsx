import React, { useEffect } from 'react';

const SignupProvider = (props) => {
  const { googleSignup } = props;
  useEffect(() => {
    window.handleToken = (response) => {
      googleSignup(response);
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, []);


  return (
    <div className='signup-provider' style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        id='g_id_onload'
        data-client_id='418853884066-d19un4l7q6adm08ib1av5dsavejgmnri.apps.googleusercontent.com'
	      // data-login_uri={`${API_URL}/auth/register`}
        data-callback='handleToken'
      />
      <div
        className='g_id_signin'
        data-type='standard'
        data-theme='outline'
        data-text='signup_with'
        data-shape='rectangular'
        data-size='large'
        data-logo_alignment='left'
      />
    </div>
  );
};

export default SignupProvider;
