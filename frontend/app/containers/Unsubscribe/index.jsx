/*
 *
 * Newsletter Unsubscribe
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from "../../withRouter";
import actions from '../../actions';
import Input from '../../components/Common/HtmlTags/Input';
import Button from '../../components/Common/HtmlTags/Input';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import { useNavigate } from 'react-router-dom'

const NewsletterUnsubscribeFrom = (props) => {
  const {
    isLoading,
    formErrors,
    eMail, email,
    newsletterUnsubscribeChange,
    unsubscribeToNewsletter
  } = props;
  const navigate = useNavigate();
  const handleSubmit = event => {
      event.preventDefault();
      unsubscribeToNewsletter(navigate);
    };
  const SubscribeButton = () => {
    return (
      <Button type='submit' className='primary p-white mt-4' text='Unsubscribe' />
    )
  };
  return (
      <div className='unsubscribe-newsletter-form p-black bg-white unsubscribe-news'>
        { isLoading && <LoadingIndicator /> }
        <p>Confirm the email you want to unsubscribe</p>
        <form onSubmit={handleSubmit}>
          <div className='unsubscribe'>
            <Input
              type={'text'}
              error={formErrors['email']}
              name={'email'}
              placeholder={'Please Enter Your Email'}
              value={eMail && eMail || email}
              onInputChange={(name, value) => {
                newsletterUnsubscribeChange(name, value);
              }}
            />
          </div>
          <SubscribeButton />
        </form>
      </div>
    );
}

class NewsletterUnsubscribe extends React.PureComponent {
  componentDidMount() {
    let eMail = this.props.match.params.email;
    try {
      eMail = atob(eMail);
    } catch (error) {
      eMail = '';
    }
        
    if ( eMail ) { this.props.newsletterUnsubscribeChange(null, eMail) }
  }

  render() {
    const {
        email, eMail, newsletterUnsubscribeChange,
        unsubscribeToNewsletter, formErrors, isLoading,
    } = this.props;

    

    return <NewsletterUnsubscribeFrom {...this.props}/>
  }
}

const mapStateToProps = state => {
  return {
    email: state.newsletterUnsubscribe.email,
    formErrors: state.newsletterUnsubscribe.formErrors,
    isLoading: state.newsletterUnsubscribe.isLoading,
  };
};

export default connect(mapStateToProps, actions)(withRouter(NewsletterUnsubscribe));
