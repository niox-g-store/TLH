import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createNewsletter } from '../../../containers/Newsletter/actions';
import DescriptionBox from '../../../store/DescriptionBox';
import Switch from '../../../store/Switch';
import AdvancedUpload from '../../../store/AdanceFileUpload';
import { ROLES } from '../../../constants';
import actions from '../../../../actions';

const AddNewsletter = (props) => {
  const { createNewsletter, userRole, formData  } = props;

  const handleInputChange = (name, value) => {
    newsletterChange( name, value);
  }
  
  const handleSubmit = () => {
    createNewsletter(formData);
  };

  return (
    <div>
      <h2>Create Newsletter</h2>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
      />
      <DescriptionBox
        value={formData.content}
        onChange={(value) => handleInputChange('content', value)}
      />
      <AdvancedUpload
        onUpload={(file) => handleInputChange('image', file)}
      />
      <Switch
        label="Send to Newsletter Subscribers"
        checked={formData.sendToSubscribers}
        onChange={() => handleInputChange('sendToSubscribers', !formData.sendToSubscribers)}
      />
      <Switch
        label="Send to Users"
        checked={formData.sendToUsers}
        onChange={() => handleInputChange('sendToUsers', !formData.sendToUsers)}
      />
      <Button text="Submit" onClick={handleSubmit} />
    </div>
  );
};

const mapStateToProps = state => ({
  userRole: state.account.user.role,
  formData: state.newsletter.formData
});

export default connect(mapStateToProps, actions)(AddNewsletter);