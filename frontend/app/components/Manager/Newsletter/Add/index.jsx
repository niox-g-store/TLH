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

const AddNewsletterForm = (props) => {
  const {
    createNewsletter,
    formData,
    formErrors,
    isLightMode,
    newsletterChange
  } = props;

  const handleInputChange = (name, value) => {
    newsletterChange(name, value);
  }
  
  const handleSubmit = () => {
    createNewsletter();
  };

  return (
    <div className={`${isLightMode ? 'p-black' : 'p-white'} container-lg px-4 d-flex flex-column mb-custom-5em`}>
      <h2>Create Campaign</h2>
      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <Input
          type="text"
          name={"title"}
          label={"Title"}
          placeholder="Title"
          value={formData.title}
          error={formErrors.title}
          onInputChange={(e) => handleInputChange('title', e)}
        />
      </Col>

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <DescriptionBox
          label={"Content"}
          placeholder={"email content here"}
          formData={formData}
          error={formErrors.content}
          isLightMode={isLightMode}
          onChange={handleInputChange}
        />
      </Col>

      <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
        <AdvancedUpload
          name={"image"}
          error={formErrors.image}
          onFilesChange={(files) => handleInputChange('image', files)} />
      </Col>

      <Col xs='12' className={isLightMode ? 'text-dark' : 'text-white'}>
        <p className='p-purple mb-3'>
          Personalize your emails by including the recipient's name (e.g., "Hi [Recipient Name]...")
        </p>
        <Switch
          id="shouldEmailContainUserName"
          label="Do you want this email to contain names of your users?"
          checked={formData.shouldEmailContainUserName}
          toggleCheckboxChange={() => handleInputChange('shouldEmailContainUserName', !formData.shouldEmailContainUserName)}
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
    const eventId = this.props.match.params.id;
    this.props.setNewsletter(eventId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const eventId = this.props.match.params.id;
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