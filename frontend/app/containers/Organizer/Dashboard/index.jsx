/*
 *
 * Organizer Dashboard
 *
 */

import { Routes, Route } from 'react-router-dom';
import { HomePanel } from './home';
import HeaderPanel from '../../../components/Manager/Header';
import AccountMenu from '../../../components/store/AccountMenu';
import ManagerAccount from '../../../components/Manager/Account';
import ManagerEvent from '../../../components/Manager/Event';
import ManagerTicket from '../../../components/Manager/Ticket';
import ManagerCoupon from '../../../components/Manager/Coupons';
import OrderList from '../../../components/Manager/Orders';
import TicketScanner from '../../../components/Manager/Scan';
import AccountSecurity from '../../../components/Manager/Security';
import ManagerNewsletter from '../../../components/Manager/Newsletter';
import Page404 from '../../Page404';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

const OrganizerDashboard = (props) => {
  const { isMenuOpen, isLightMode } = props;
  return (
    <div className='organizer'>
      <AccountMenu {...props} />
      <div className={`${isLightMode ? 'bg-light-mode' : 'bg-dark-mode'} wrapper d-flex flex-column min-vh-100 panel-body bg-black`}>
        <HeaderPanel {...props} />
        <Routes>
          <Route index element={<HomePanel {...props} />} />
          <Route path='events' element={<ManagerEvent {...props}/>} />
          <Route path='tickets' element={<ManagerTicket {...props}/>} />
          <Route path='coupons' element={<ManagerCoupon {...props}/>} />
          <Route path='orders' element={<OrderList {...props}/>} />
          <Route path='scan' element={<TicketScanner {...props}/>} />
          <Route path='account' element={<ManagerAccount {...props}/>} />
          <Route path='security' element={<AccountSecurity {...props}/>} />
          <Route path='newsletter' element={<ManagerNewsletter {...props}/>} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
