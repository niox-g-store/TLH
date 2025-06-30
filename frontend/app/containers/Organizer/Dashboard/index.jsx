/*
 *
 * Organizer Dashboard
 *
 */

import { Routes, Route } from 'react-router-dom';
import { HomePanel } from './panel';
import AccountMenu from '../../../components/store/AccountMenu';
import Account from '../../Account';
import Page404 from '../../Page404';

/* import AccountMenu from '../AccountMenu';
import Page404 from '../../Common/Page404';

import Account from '../../../containers/Account';
import AccountSecurity from '../../../containers/AccountSecurity';
import Address from '../../../containers/Address';
import Product from '../../../containers/Product';
import Brand from '../../../containers/Brand';
import Order from '../../../containers/Order';
import Wishlist from '../../../containers/WishList'; */
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

const OrganizerDashboard = (props) => {
  const { isMenuOpen, isLightMode } = props;
  return (
    <div className='organizer'>
      <AccountMenu {...props} />
      <div className={`${isLightMode ? 'bg-light-mode' : 'bg-dark-mode'} wrapper d-flex flex-column min-vh-100 panel-body bg-black`}>
        <Routes>
          <Route index element={<HomePanel {...props} />} />
          <Route path='account' element={<Account />} />
          {/* <Route exact path='/dashboard' component={Account} />
              <Route path='/dashboard/security' component={AccountSecurity} />
              <Route path='/dashboard/address' component={Address} />
              <Route path='/dashboard/product' component={Product} />
              <Route path='/dashboard/brand' component={Brand} />
              <Route path='/dashboard/orders' component={Order} />
              <Route path='/dashboard/wishlist' component={Wishlist} /> */}
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
