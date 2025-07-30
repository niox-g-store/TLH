/**
 *
 * AccountDetails
 *
 */

import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import { EMAIL_PROVIDER, ROLES } from '../../../constants';
import UserRole from '../UserRole';
import Input from '../../Common/HtmlTags/Input';
import Button from '../../Common/HtmlTags/Button';

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
