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
} from '@coreui/react';
import React, { useState } from 'react';
// import BankSelector from '../../Common/Banks';

import { EMAIL_PROVIDER, ROLES } from '../../../constants';
import UserRole from '../../store/UserRole';
import Input from '../../Common/HtmlTags/Input';
import Button from '../../Common/HtmlTags/Button';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile();
  };

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <CCard className={`${isLightMode ? 'bg-white': 'bg-black'}  w-100`}>
        <CCardHeader>
          <CCardTitle className={`${isLightMode ? 'p-black': 'p-white'} font-size-30`}>Account Details</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3 g-3">
            <CCol className={`${isLightMode ? 'p-black': 'p-white'}`} md={6}>
              <CFormInput
                type="email"
                label="Email"
                value={user.email || ''}
                disabled
              />
            </CCol>

              <CCol className={`${isLightMode ? 'p-black': 'p-white'}`} md={6}>
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

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3 g-3">
              {user.role !== ROLES.Organizer &&
              <CCol className={`${isLightMode ? 'p-black': 'p-white'}`} md={6}>
                <CFormInput
                  type="text"
                  label="Name"
                  name="Name"
                  placeholder="Enter your name"
                  value={user.name || ''}
                  onChange={(e) => accountChange('name', e.target.value)}
                />
              </CCol>
              }
              
              {[ROLES.Admin, ROLES.Organizer].includes(user?.role) && 
              <CCol className={`${isLightMode ? 'p-black': 'p-white'}`} md={6}>
                <CFormInput
                  type="text"
                  label="Company Name"
                  name="companyName"
                  placeholder="Enter your company name"
                  value={user.companyName}
                  onChange={(e) => accountChange('companyName', e.target.value)}
                />
              </CCol>
              }
              {user?.organizer &&
              <CCol className={`${isLightMode ? 'p-black': 'p-white'}`} md={6}>
                <Input type={"phone"}
                       val={user.organizer && user.organizer.phoneNumber || ''}
                       onPhoneChange={(v) => accountChange('phoneNumber', v)}
                />
              </CCol>
              }
            </CRow>

            <div className="d-flex justify-content-center mt-3">
              <CButton type="submit" className={`p-white linear-grad`}>
                Save Changes
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

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
