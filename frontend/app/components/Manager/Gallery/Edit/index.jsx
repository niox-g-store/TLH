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
import { withRouter } from '../../../../withRouter';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import { formatDateForInput } from '../../../../utils/formatDate';
import AdvancedUpload from '../../../store/AdanceFileUpload';
import { API_URL } from '../../../../constants';
import AdvancedUploadHelper from '../../../store/AdanceFileUpload/updateFileUpload';

const EditGalleryForm = (props) => {
  const {
    gallery,
    galleryEditFormErrors,
    galleryEditChange,
    updateGallery,
    galleryIsLoading,
    isLightMode,
    deleteGallery,
    galleryImageToRemove,
    media,
  } = props;

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    updateGallery(navigate);
  };

  const imageUrls = Array.isArray(gallery.media)
    ? gallery.media.map((url) => `${API_URL}${url.mediaUrl}`)
    : [];
  const bannerUrls = Array(API_URL + gallery.bannerUrl) || ''
    
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
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Gallery Details</h2>
        <GoBack navigate={navigate} />
      </div>

      <form noValidate>
        <Row>
          {/* Gallery Name */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={galleryEditFormErrors.name}
              label='Gallery Name'
              name='name'
              placeholder='Enter gallery name'
              value={gallery.name || ''}
              onInputChange={galleryEditChange}
            />
          </Col>

          {/* Party Date (Single Date) */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='date'
              error={galleryEditFormErrors.date}
              label='Party Date'
              name='date'
              value={formatDateForInput(gallery.date) || ''}
              onInputChange={galleryEditChange}
            />
          </Col>

          {/* Description */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <DescriptionBox
              error={galleryEditFormErrors.description}
              formData={gallery}
              placeholder='Enter gallery description...'
              isLightMode={isLightMode}
              onChange={galleryEditChange}
            />
          </Col>

          {/* Gallery Banenr Upload (AdvancedUpload for multiple files) */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <h5>Edit Gallery Banner</h5>
            <AdvancedUpload
              error={galleryEditFormErrors.banner}
              onFilesChange={(files) => galleryEditChange('bannerUrl', files)}
              imageLimit={500 * 1024 * 1024}
              videoLimit={500 * 1024 * 1024}
              limit={1}
              vLimit={0}
            />
            <AdvancedUploadHelper
              error={galleryEditFormErrors.banner}
              initialUrls={bannerUrls}
              onRemoveUrlChange={(url) => galleryImageToRemove(url)}
            />
          </Col>

          {/* New Image Upload */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <h5 style={{ paddingTop: '1em' }}>Upload New Gallery media</h5>
            <AdvancedUpload
              error={galleryEditFormErrors.media}
              onFilesChange={(files) => galleryEditChange('medias', files)}
              imageLimit={500 * 1024 * 1024}
              videoLimit={500 * 1024 * 1024}
              limit={10}
              vLimit={2}
            />
            <h5 style={{ paddingTop: '1em' }}>Existing Gallery media</h5>
            <AdvancedUploadHelper
              error={galleryEditFormErrors.media}
              initialUrls={imageUrls}
              onRemoveUrlChange={(url) => galleryImageToRemove(url)}
            />
          </Col>


          {/* Gallery Active Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-gallery'
              name='active'
              label='Is Active?'
              checked={gallery.active || false}
              toggleCheckboxChange={(value) =>
                galleryEditChange('active', value)}
            />
          </Col>
        </Row>
      </form>
      <Row>
          <div className='edit-event-actions'>
            <Button onClick={handleSubmit} style={{ padding: '10px 20px' }} text='Save Gallery' />
            <Button
              onClick={() => deleteGallery(gallery._id, navigate)}
              style={{ padding: '10px 20px' }}
              text='Delete Gallery'
            />
          </div>
        </Row>
    </div>
  );
};

class EditGallery extends React.PureComponent {
  componentDidMount () {
    this.props.resetGallery();
    const galleryId = this.props.match.params.id;
    this.props.fetchGallery(galleryId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetGallery();
      const galleryId = this.props.match.params.id;
      this.props.fetchGallery(galleryId);
    }
  }

  render () {
    return (
      <EditGalleryForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  gallery: state.gallery.gallery,
  galleryEditFormErrors: state.gallery.editFormErrors,
  galleryIsLoading: state.gallery.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(EditGallery));