/*
 *
 * Admin
 *
 */

import React from 'react';

import { Routes, Route } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

/*import AccountMenu from '../AccountMenu';
import Page404 from '../../Common/Page404';*/

/*import Account from '../../../containers/Account';
import AccountSecurity from '../../../containers/AccountSecurity';
import AdminDashboard from '../../../containers/AdminDashboard';
import Address from '../../../containers/Address';
import Order from '../../../containers/Order';
import Users from '../../../containers/Users';
import Category from '../../../containers/Category';
import Product from '../../../containers/Product';
import Brand from '../../../containers/Brand';
import Merchant from '../../../containers/Merchant';
import Review from '../../../containers/Review';
import Wishlist from '../../../containers/WishList';
import Banner from '../../../containers/Banner';
import Campaign from '../../../containers/Campaign';*/

const Admin = (props) => {
  return (
    <div className='admin'>
      <Row>
        <Col className='leftNav' xs='12' md='3' xl='2'>
          <AccountMenu {...props} />
        </Col>
        <Col className='rightMain' xs='12' md='7' xl='10'>
          <div className='panel-body'>
            <Routes>
              <Route exact path='/dashboard' component={AdminDashboard} />
              <Route path='/dashboard/details' component={Account} />
              <Route path='/dashboard/security' component={AccountSecurity} />
              <Route path='/dashboard/address' component={Address} />
              <Route path='/dashboard/product' component={Product} />
              <Route path='/dashboard/category' component={Category} />
              <Route path='/dashboard/brand' component={Brand} />
              <Route path='/dashboard/users' component={Users} />
              <Route path='/dashboard/merchant' component={Merchant} />
              <Route path='/dashboard/orders' component={Order} />
              <Route path='/dashboard/review' component={Review} />
              <Route path='/dashboard/banner' component={Banner} />
              <Route path='/dashboard/campaigns' component={Campaign} />
              <Route path='/dashboard/wishlist' component={Wishlist} />
              <Route path='*' component={Page404} />
            </Routes>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
