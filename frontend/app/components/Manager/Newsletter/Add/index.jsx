import React from 'react';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import { withRouter } from '../../../../withRouter';
import DescriptionBox from '../../../store/DescriptionBox';
import Switch from '../../../store/Switch';
import AdvancedUpload from '../../../store/AdanceFileUpload';
import Input from '../../../Common/HtmlTags/Input';
import Col from '../../../Common/Col';
import Button from '../../../Common/HtmlTags/Button';
import { useNavigate } from 'react-router-dom';
import { GoBack } from '../../../../containers/goBack/inedx';

const AddNewsletterForm = (props) => {
  const {
    createNewsletter,
    formData,
    formErrors,
    isLightMode,
    newsletterChange
  } = props;
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    createNewsletter(navigate);
  };

  return (
    <div className={`${isLightMode ? 'p-black' : 'p-white'} container-lg px-4 d-flex flex-column mb-custom-5em`}>
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Create Campaign</h2>
        <GoBack navigate={navigate} />
      </div>
      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <Input
          type="text"
          name={"title"}
          label={"Title"}
          placeholder="Title"
          value={formData.title}
          error={formErrors.title}
          onInputChange={(e, v) => newsletterChange('title', v)}
        />
      </Col>

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <DescriptionBox
          label={"Content"}
          placeholder={"email content here"}
          formData={formData}
          error={formErrors.content}
          isLightMode={isLightMode}
          onChange={newsletterChange}
        />
      </Col>

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <Input
          type="text"
          name={"linkName"}
          label={"Link Name (Optional)"}
          placeholder="e.g., View Event, Learn More"
          value={formData.linkName}
          error={formErrors.linkName}
          onInputChange={(e, v) => newsletterChange('linkName', v)}
        />
      </Col>

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <Input
          type="text"
          name={"linkUrl"}
          label={"Link URL (Optional)"}
          placeholder="https://example.com"
          value={formData.linkUrl}
          error={formErrors.linkUrl}
          onInputChange={(e, v) => newsletterChange('linkUrl', v)}
        />
      </Col>

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <AdvancedUpload
          name={"image"}
          error={formErrors.image}
          onFilesChange={(files) => newsletterChange('image', files)} />
      </Col>

      <Col xs='12' className={isLightMode ? 'text-dark' : 'text-white'}>
        <p className='p-purple mb-3'>
          Personalize your emails by including the recipient's name (e.g., "Hi [Recipient Name]...")
        </p>
        <Switch
          id="shouldEmailContainUserName"
          label="Do you want this email to contain names of your users?"
          checked={formData.shouldEmailContainUserName}
          toggleCheckboxChange={() => newsletterChange('shouldEmailContainUserName', !formData.shouldEmailContainUserName)}
        />
      </Col>

      {/*<Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <Switch
          label="Send to Newsletter Subscribers"
          checked={formData.sendToSubscribers}
          onInputChange={() => handleInputChange('sendToSubscribers', !formData.sendToSubscribers)}
        />
      </Col>

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <Switch
          label="Send to Users"
          checked={formData.sendToUsers}
          onInputChange={() => handleInputChange('sendToUsers', !formData.sendToUsers)}
        />
      </Col>*/}

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <Button text="Submit" onClick={handleSubmit} />
      </Col>
    </div>
  );
};

class AddNewsletter extends React.PureComponent {
  componentDidMount () {
    const queryString = this.props.location.search;
    const params = new URLSearchParams(queryString);
    const eventId = params.get('eventId');
    this.props.setNewsletter(eventId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const queryString = this.props.location.search;
      const params = new URLSearchParams(queryString);
      const eventId = params.get('eventId');
      this.props.setNewsletter(eventId);
    }
  }

  render() {
    return (
      <AddNewsletterForm {...this.props} />
    )
  }
}

const mapStateToProps = state => ({
  formData: state.newsletter.formData,
  formErrors: state.newsletter.formErrors,
});

export default connect(mapStateToProps, actions)(withRouter(AddNewsletter));