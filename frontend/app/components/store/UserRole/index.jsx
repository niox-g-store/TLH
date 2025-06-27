/**
 *
 * UserRole
 *
 */

import React from 'react';

import { ROLES } from '../../../constants';
import Badge from '../Badge';

const UserRole = (props) => {
  const { className, user } = props;

  return (
    <>
      {user.role === ROLES.Admin ? (
        <Badge variant='primary' className={className}>
          Admin
        </Badge>
      ) : user.role === ROLES.Organizer ? (
        <Badge variant='dark' className={className}>
          Merchant
        </Badge>
      ) : (
        <Badge variant='dark' className={className}>
          User
      </Badge>
      )}
    </>
  );
};

UserRole.defaultProps = {
  className: ''
};

export default UserRole;
