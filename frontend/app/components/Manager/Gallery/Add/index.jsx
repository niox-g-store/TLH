// AddGallery.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';

import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import LoadingIndicator from '../../../store/LoadingIndicator';
import DescriptionBox from '../../../store/DescriptionBox';
import { GoBack } from '../../../../containers/goBack/inedx';
import AdvancedUpload from '../../../store/AdanceFileUpload';
import { connect } from 'react-redux';
import { withRouter } from '../../../../withRouter';
import actions from "../../../../actions";

const AddGalleryForm = (props) => {
  const {
    galleryFormData,
    galleryFormErrors,
    galleryChange,
    addGallery,
    galleryIsLoading,
    isLightMode,
  } = props;

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    addGallery(navigate);
  };


  return (
    <div className='add-event d-flex flex-column mb-custom-5em'>
      {galleryIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Create Gallery</h2>
        <GoBack navigate={navigate} />
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Gallery Name */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={galleryFormErrors.name}
              label='Gallery Name'
              name='name'
              placeholder='Enter gallery name'
              value={galleryFormData.name}
              onInputChange={galleryChange}
            />
          </Col>

          {/* Description */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <DescriptionBox
              error={galleryFormErrors.description}
              formData={galleryFormData}
              placeholder='Enter gallery description... (Optional)'
              isLightMode={isLightMode}
              onChange={galleryChange}
            />
          </Col>

          {/* Party Date (Single Date) */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='date'
              error={galleryFormErrors.date}
              label='Event Date'
              name='date'
              value={galleryFormData.date}
              onInputChange={galleryChange}
            />
          </Col>

          {/* Gallery Banenr Upload (AdvancedUpload for multiple files) */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <h5>Upload Gallery Banner</h5>
            <AdvancedUpload
              error={galleryFormErrors.banner}
              onFilesChange={(files) => galleryChange('banner', files)}
              imageLimit={500 * 1024 * 1024}
              videoLimit={500 * 1024 * 1024}
              limit={1}
              vLimit={0}
            />
          </Col>

          {/* Image Upload (AdvancedUpload for multiple files) */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
          <h5>Upload Gallery media</h5>
            <AdvancedUpload
              error={galleryFormErrors.media}
              onFilesChange={(files) => galleryChange('media', files)}
              imageLimit={500 * 1024 * 1024}
              videoLimit={500 * 1024 * 1024}
              limit={10}
              vLimit={2}
            />
          </Col>

          {/* Gallery Active Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-gallery'
              name='active'
              label='Is Active?'
              checked={galleryFormData.active}
              toggleCheckboxChange={(value) =>
                galleryChange('active', value)}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: '1em' }}>
          <div className='add-gallery-actions'>
            <Button style={{ padding: '10px 20px' }} text='Save Gallery' />
          </div>
        </Row>

      </form>
    </div>
  );
};


class AddGallery extends React.PureComponent {
  render () {
    const { addGallery } = this.props;
    return (
      <AddGalleryForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  galleryFormData: state.gallery.galleryFormData,
  galleryFormErrors: state.gallery.formErrors,
  isLightMode: state.dashboard.isLightMode,
  galleryIsLoading: state.gallery.isLoading,
});

export default connect(mapStateToProps, actions)(withRouter(AddGallery));