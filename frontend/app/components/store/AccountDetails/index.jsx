/**
 *
 * AccountDetails
 *
 */

import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Row, Col } from 'reactstrap';
// import BankSelector from '../../Common/Banks';

import { EMAIL_PROVIDER, ROLES } from '../../../constants';
import UserRole from '../UserRole';
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
            <Col className='display_banks'>
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
            </Col>
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

const AccountDetails = (props) => {
  const {
    user, accountChange, updateProfile,
    banks, deleteBank, formErrors, createBank } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile();
  };

  return (
    <div className="account-details">
      <div className="info">
        <div className="desc">
          <Col xs="12" md="6">
            <Input
              type="text"
              label="Email"
              name="email"
              value={user.email || ''}
              disabled={true}
            />
          </Col>
          <UserRole user={user} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs="12" md="6">
            <Input
              type="text"
              label="First Name"
              name="firstName"
              placeholder="Enter Your Name"
              value={user.name || ''}
              onInputChange={(name, value) => accountChange(name, value)}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type="text"
              label="Last Name"
              name="lastName"
              placeholder="Enter a new username"
              value={user.userName || ''}
              onInputChange={(name, value) => accountChange(name, value)}
            />
          </Col>
          {/*<Col xs="12" md="12">
            <PhoneNumberInput
              val={user.phoneNumber || ''}
              onPhoneChange={(phoneNumber) => accountChange('phoneNumber', phoneNumber)}
            />
          </Col>*/}
        </Row>
        <hr />
        <div className="profile-actions">
          <Button type="secondary" text="Save changes" />
        </div>

        {/*user.role === ROLES.Admin  && (
            <Col>
              <BankAccountComponent
                banks={banks} createBank={createBank}
                formErrors={formErrors}
                deleteBank={deleteBank}
              />
            </Col>
          )*/}
      </form>
    </div>
  );
};

export default AccountDetails;
