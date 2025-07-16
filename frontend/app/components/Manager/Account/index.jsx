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
import { ROLES } from '../../../constants';
import Input from '../../Common/HtmlTags/Input';
import Button from '../../Common/HtmlTags/Button';
import AdvancedUpload from '../../store/AdanceFileUpload';
import DescriptionBox from '../../store/DescriptionBox';
import { API_URL } from '../../../constants';
import ResolveImage from '../../store/ResolveImage';
import { useNavigate, Link } from 'react-router-dom';
 
// import BankSelector from '../../Common/Banks';

// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';
// import { TrashIcon } from '../../Common/Icon';
// import { getBankNameByCode } from '../../Common/BankCodes';

/*const LoadBankModal = ({ onBankSelect, accountNumber, setAccountNumber, accountName, setAccountName, formErrors }) => (
  <div>
    <div>
      <BankSelector onBankSelect={onBankSelect} error={formErrors['bankName']}/>
    </div>

    <div>
    <div>
      <Input
        label="Account Number"
        value={accountNumber}
        type="number"
        error={formErrors['accountNumber']}
        onInputChange={(name, value) => setAccountNumber(value)}
      />
    </div>
    <div>
      <Input
        label="Account Name"
        type="text"
        value={accountName}
        error={formErrors['nameOnAccount']}
        onInputChange={(name, value) => setAccountName(value)}
      />
    </div>
    </div>

  </div>
);*/

/*const BankAccountComponent = (props) => {
  const { banks, deleteBank, createBank, formErrors } = props;


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSave = () => {
    // Logic to save the bank details (API call or state update)
    createBank(selectedBank, accountNumber, accountName);
    if (selectedBank.length > 0 && accountNumber.length > 0 && accountName.length > 0) {
      setModalVisible(false);
    }
  };
  return (
    <div className="bank_account_admin">
      <h3>Your Bank Account</h3>
      {banks && banks.length > 0 ? (
        banks.map((bank, index) => (
          <Row key={index}>
            <div className='display_banks'>
            <div style={{ textAlign: 'left' }}>
              <p><b>Account name: </b>{bank.name}</p>
              <p><b>Bank: </b>{getBankNameByCode(bank.bank_name)}</p>
              <p><b>Account number: </b>{bank.number}</p>
            </div>
            <Button
              className='delete_bank'
              icon={<TrashIcon />}
              onClick={() => deleteBank(bank._id)}
            />
            </div>
          </Row>
        ))
      ) : (
        <p>No bank record</p>
      )}
      <Button className="add_bank_button" text="Add Bank" onClick={() => setModalVisible(true)} />

      <Modal isOpen={modalVisible} toggle={() => setModalVisible(!modalVisible)}>
        <ModalBody>
          <LoadBankModal
            onBankSelect={setSelectedBank}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            accountName={accountName}
            setAccountName={setAccountName}
            formErrors={formErrors}
          />
        </ModalBody>
        <ModalFooter>
          <Button text="Save" onClick={handleSave} />
          <Button text="Cancel" onClick={() => setModalVisible(false)} />
        </ModalFooter>
      </Modal>
    </div>
  );
};*/

/*const PhoneNumberInput = ({ onPhoneChange, val }) => {
  const [value, setValue] = useState(val);

  const handleChange = (phoneNumber) => {
    setValue(phoneNumber);
    if (onPhoneChange) {
      onPhoneChange(phoneNumber);
    }
  };

  return (
    <div>
      <label htmlFor="phone-input" style={{ marginBottom: '10px', display: 'block' }}>
        Phone Number:
      </label>
      <PhoneInput
        id="phone-input"
        placeholder="Enter phone number"
        defaultCountry="NG"
        value={value}
        onChange={handleChange}
        international
        countryCallingCodeEditable={true}
        className="phone-input"
      />
    </div>
  );
};*/

const ManagerAccount = (props) => {
  const {
    user,
    accountChange,
    updateProfile,
    banks,
    deleteBank,
    formErrors,
    createBank,
    isLightMode,
    accountEditFormErrors
  } = props;
  const navigate = useNavigate()

  const [editPicModal, setEditPicModal] = useState(false);
  const [profileUpload, setProfileUpload] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(navigate);
  };

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <CCard className={`${isLightMode ? 'bg-white': 'bg-black'} w-100`}>
        <CCardHeader>
          <CCardTitle className={`${isLightMode ? 'p-black': 'p-white'} font-size-30`}>Account Details</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <div style={{ width: 'fit-content' }} className='d-flex align-items-center justify-content-center mb-4'>
              <img
                src={ResolveImage(API_URL + user?.imageUrl, 'profile')}
                alt="Profile"
                style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
              />
            <CButton className='ms-3 purple-bg p-white' onClick={() => setEditPicModal(true)}>{user?.imageUrl.length > 0 ? 'Edit' : 'Add a profile picture'}</CButton>
          </div>

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

            {/* Uncomment this if Admins can manage bank accounts
      {user.role === ROLES.Admin && (
        <div className='mt-4 w-100'>
          <BankAccountComponent
            banks={banks}
            createBank={createBank}
            formErrors={formErrors}
            deleteBank={deleteBank}
          />
        </div>
      )}
      */}
    </div>
  );
};

export default ManagerAccount;
