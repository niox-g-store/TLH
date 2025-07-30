/**
 *
 * AccountDetails
 *
 */

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalBody
} from '@coreui/react';
import React, { useState } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import { ROLES } from '../../../constants';
import Input from '../../Common/HtmlTags/Input';
import Button from '../../Common/HtmlTags/Button';
import AdvancedUpload from '../../store/AdanceFileUpload';
import { API_URL } from '../../../constants';
import resolveImage from '../../store/ResolveImage';
import { useNavigate, Link } from 'react-router-dom';
import { withRouter } from '../../../withRouter';
import LoadingIndicator from '../../store/LoadingIndicator';

const ManagerAccountForm = (props) => {
  let {
    user,
    accountChange,
    updateProfile,
    banks,
    deleteBank,
    formErrors,
    createBank,
    isLightMode,
    accountEditFormErrors,
    isLoading
  } = props;
  const navigate = useNavigate()

  if (user.role === ROLES.Member) { isLightMode = false }
  const isUserAllowed = user => user.role === ROLES.Member
  const google = user.provider !== 'Email';

  const [editPicModal, setEditPicModal] = useState(false);
  const [profileUpload, setProfileUpload] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(navigate, google);
  };

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      {isLoading && <LoadingIndicator />}
      <CCard className={`${isLightMode ? 'bg-white': 'bg-black'} w-100`}>
        <CCardHeader>
          <CCardTitle className={`${isLightMode ? 'p-black': 'p-white'} font-size-30`}>Account Details</CCardTitle>
        </CCardHeader>
        <CCardBody>
          {!isUserAllowed(user) &&
          <div style={{ width: 'fit-content' }} className='d-flex align-items-center justify-content-center mb-4'>
              <img
                src={resolveImage(API_URL + user?.imageUrl, 'profile')}
                alt="Profile"
                style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
              />
            <CButton className='ms-3 purple-bg p-white' onClick={() => setEditPicModal(true)}>{user?.imageUrl.length > 0 ? 'Edit' : 'Add a profile picture'}</CButton>
          </div>
          }

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3 g-3">
              <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <CFormInput
                  type="email"
                  label="Email"
                  value={user.email || ''}
                  disabled
                />
              </CCol>
              {user.provider === 'Email' &&
              <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <Input
                  type="text"
                  label="User Name"
                  name="userName"
                  placeholder="Enter a new username"
                  value={user.userName || ''}
                  error={accountEditFormErrors.userName}
                  onInputChange={(e, v) => accountChange('userName', v)}
                />
              </CCol>
              }
            </CRow>

            <CRow className="mb-3 g-3">
              {user.role !== ROLES.Organizer && (
                <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                  <CFormInput
                    type="text"
                    label="Name"
                    value={user.name || ''}
                    onChange={(e) => accountChange('name', e.target.value)}
                  />
                </CCol>
              )}
              {[ROLES.Admin, ROLES.Organizer].includes(user.role) && (
                <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                  <CFormInput
                    type="text"
                    label="Company Name"
                    value={user.companyName || ''}
                    onChange={(e) => accountChange('companyName', e.target.value)}
                  />
                </CCol>
              )}
              <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <Input
                  type='phone'
                  label='Phone Number'
                  val={user.phoneNumber || ''}
                  onPhoneChange={(v) => accountChange('phoneNumber', v)}
                />
              </CCol>
              {!isUserAllowed(user) &&
              <>
              <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <Input
                  type='email'
                  placeholder="Enter email"
                  label='Contact email'
                  value={user.contactEmail || ''}
                  onInputChange={(n, v) => accountChange('contactEmail', v)}
                />
              </CCol>
              <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <Input
                  type='text'
                  label='Instagram'
                  value={user.instagram || ''}
                  placeholder='Paste Instagram link'
                  onInputChange={(name, val) => accountChange('instagram', val)}
                />
              </CCol>
              <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <Input
                  type='text'
                  label='TikTok'
                  value={user.tiktok || ''}
                  placeholder='Paste TikTok link'
                  onInputChange={(name, val) => accountChange('tiktok', val)}
                />
              </CCol>
              <CCol md={6} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <Input
                  type='text'
                  label='Facebook'
                  value={user.facebook || ''}
                  placeholder='Paste Facebook link'
                  onInputChange={(name, val) => accountChange('facebook', val)}
                />
              </CCol>
              <CCol md={12} className={`${isLightMode ? 'p-black': 'p-white'}`}>
                <label className='mb-2'>Bio</label>
                <textarea
                  label='Bio'
                  value={user.bio}
                  placeholder='Enter your bio (Optional)'
                  onChange={(e) => accountChange('bio', e.target.value)}
                />
              </CCol>
              </>}
            </CRow>

            <div className="d-flex justify-content-center mt-3">
              <CButton type="submit" className={`p-white linear-grad`}>
                Save Changes
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      <CModal visible={editPicModal} onClose={() => setEditPicModal(false)} alignment="center">
        <CModalBody>
          <h5 className='mb-3'>Upload Profile Picture</h5>
          <AdvancedUpload
            limit={1}
            onFilesChange={(files) => setProfileUpload(files)}
          />
          <div className="d-flex justify-content-end mt-3">
            <Button style={{ padding: '10px 15px' }} text='Save' onClick={() => {
              if (profileUpload.length > 0) {
                accountChange('image', profileUpload[0]);
              }
              setEditPicModal(false);
            }} />
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};
class ManagerAccount extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.fetchProfile();
    }
  }
  render() {
    return (
      <ManagerAccountForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  accountEditFormErrors: state.account.editFormErrors,
  user: state.account.user,
  isLoading: state.account.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(ManagerAccount));
