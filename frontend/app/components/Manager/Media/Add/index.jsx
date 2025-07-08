import React from 'react';
import { useNavigate } from 'react-router-dom';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';

import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';
import AdvancedUpload from '../../../store/AdanceFileUpload'; // For file upload
import { connect } from 'react-redux';
import { withRouter } from '../../../../withRouter';
import actions from "../../../../actions";

const AddMediaForm = (props) => {
  const {
    mediaFormData,
    mediaFormErrors,
    mediaChange,
    addMedia,
    mediaIsLoading,
    isLightMode,
    medias // To check for existing default media
  } = props;

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    addMedia(navigate);
  };

  // Find the currently default media
  const existingDefaultMedia = medias.find(media => media.default);
  const isDefaultSwitchDisabled = mediaFormData.default === false && existingDefaultMedia;

  return (
    <div className='add-media d-flex flex-column mb-custom-5em'>
      {mediaIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Add New Media</h2>
        <GoBack navigate={navigate} />
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Media File Upload */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <h5 style={{ paddingTop: '1em' }}>Upload Media File</h5>
            <AdvancedUpload
              error={mediaFormErrors.mediaUrl} // Assuming 'mediaUrl' is the field for the file
              onFilesChange={(files) => mediaChange('mediaUrl', files[0])} // Assuming single file upload for a media item
            />
            {mediaFormErrors.mediaUrl && (
              <div className='input-field-error'>{mediaFormErrors.mediaUrl}</div>
            )}
          </Col>

          {/* Active Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-media'
              name='active'
              label='Active?'
              checked={mediaFormData.active}
              toggleCheckboxChange={(value) => mediaChange('active', value)}
            />
          </Col>

          {/* Default Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='default-media'
              name='default'
              label='Set as Default?'
              checked={mediaFormData.default}
              toggleCheckboxChange={(value) => mediaChange('default', value)}
              disabled={isDefaultSwitchDisabled} // Disable if another default exists
            />
            {isDefaultSwitchDisabled && (
              <p className={`${isLightMode ? 'p-black' : 'p-white'} text-muted mt-2`}>
                * Another media is currently set as default. Please unmark it first if you want to set this one as default.
              </p>
            )}
          </Col>
        </Row>

        <Row>
          <div className='add-media-actions'>
            <Button style={{ padding: '10px 20px' }} text='Save Media' />
          </div>
        </Row>
      </form>
    </div>
  );
};

class AddMedia extends React.PureComponent {
  // Reset mediaFormData when component mounts for a fresh form
  componentDidMount() {
    this.props.resetMedia();
    this.props.fetchMedias(); // Fetch existing medias to check for default
  }

  render() {
    return (
      <AddMediaForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  mediaFormData: state.media.mediaFormData,
  mediaFormErrors: state.media.formErrors,
  isLightMode: state.dashboard.isLightMode,
  mediaIsLoading: state.media.isLoading,
  medias: state.media.medias, // Pass existing medias to the form
});

export default connect(mapStateToProps, actions)(withRouter(AddMedia));