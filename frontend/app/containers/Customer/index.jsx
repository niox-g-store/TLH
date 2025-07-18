/*
 *
 * Customer
 *
 */

import React from 'react';

import { Routes, Route } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import ManagerAccount from '../../components/Manager/Account';
import AccountSecurity from '../../components/Manager/Security';
import UserOrder from '../../components/Manager/Orders/UserOrders';
import ViewOrder from '../../components/Manager/Orders/UserOrders/view';
import CustomerDashboard from './Dashboard';
import Page404 from '../Page404';
import { isProviderAllowed } from '../../utils/app';

const Customer = (props) => {
  const { user } = props;

  return (
    <div className='customer'>
      <Routes>
        <Route index element={<CustomerDashboard {...props} />} />
        <Route path='account' element={<ManagerAccount {...props} />} />
        <Route path='order/:id' element={<ViewOrder {...props} />} />
        <Route path='orders/my-orders' element={<UserOrder {...props} />} />
        {isProviderAllowed(user.provider) && (
          <Route path='security' element={<AccountSecurity {...props} />} />
        )}
        <Route path='*' element={<Page404 />} />
        </Routes>
    </div>
  );
};

export default Customer;
