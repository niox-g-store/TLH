import React, { useState } from 'react';
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CButton,
  CFormInput
} from '@coreui/react';

const TwoFactorPrompt = ({ twoFaLogin, twoFaPromptToggle, twoFaPrmpt }) => {
  const [code, setCode] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    twoFaLogin(code);
  };

  return (
    <CModal className='d-flex flex-column w-100' style={{ justifyContent: 'center' }} visible={twoFaPrmpt} onClose={() => twoFaPromptToggle(false)}>
      <CModalHeader onClose={() => twoFaPromptToggle(false)}>
        <CModalTitle>Enter 2FA Code</CModalTitle>
      </CModalHeader>
      <CModalBody className='w-100'>
        <CForm onSubmit={handleSubmit}>
          <CFormInput
            type="text"
            value={code}
            onChange={handleChange}
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="text-center text-black mb-3"
          />
          <CButton type="submit" className="w-100 p-white purple-bg">
            Submit
          </CButton>
        </CForm>
      </CModalBody>
    </CModal>
  );
};

export default TwoFactorPrompt;
