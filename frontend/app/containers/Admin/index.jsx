/*
 *
 * Admin
 *
 */
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './Dashboard';
import HeaderPanel from '../../components/Manager/Header';
import AccountMenu from '../../components/store/AccountMenu';
import ManagerAccount from '../../components/Manager/Account';
import ManagerEvent from '../../components/Manager/Event';
import ManagerTicket from '../../components/Manager/Ticket';
import ManagerCoupon from '../../components/Manager/Coupon';
import ManagerOrder from '../../components/Manager/Orders';
import ManagerScanner from '../../components/Manager/Scan';
import AccountSecurity from '../../components/Manager/Security';
import ManagerNewsletter from '../../components/Manager/Newsletter';
import ManagerGallery from '../../components/Manager/Gallery';
import ManagerMedia from '../../components/Manager/Media';
import Page404 from '../Page404';

import AddEvent from '../../components/Manager/Event/Add';
import EditEvent from '../../components/Manager/Event/Edit';
import AdminEvent from '../../components/Manager/Event/AdminEvent';

import AddTicket from '../../components/Manager/Ticket/Add';
import EditTicket from "../../components/Manager/Ticket/Edit";
import AdminTicket from '../../components/Manager/Ticket/AdminTicket';

import AddCoupon from '../../components/Manager/Coupon/Add';
import EditCoupon from '../../components/Manager/Coupon/Edit';
import AdminCoupon from '../../components/Manager/Coupon/AdminCoupon';

import AddGallery from '../../components/Manager/Gallery/Add';
import EditGallery from '../../components/Manager/Gallery/Edit';

import AddMedia from '../../components/Manager/Media/Add';

import AdminOrder from '../../components/Manager/Orders/AdminOrders';
import ViewOrder from '../../components/Manager/Orders/View';

import ManagerUsers from '../../components/Manager/User';

import ManagerGuests from '../../components/Manager/Guest';

import ManagerOrganizers from '../../components/Manager/Organizer';
import OrganizerView from '../../components/Manager/Organizer/View';

import ManagerProduct from '../../components/Manager/Product';
import AddProduct from '../../components/Manager/Product/Add';
import EditProduct from '../../components/Manager/Product/Edit';

import Setting from '../../components/Manager/Setting';

import AddNewsletter from '../../components/Manager/Newsletter/Add';
import CampaignView from '../../components/Manager/Newsletter/View';

import ManagerWithdraw from '../../components/Manager/Withdrawal';
import WithdrawView from '../../components/Manager/Withdrawal/View';
import OrganizersManagerWithdraw from '../../components/Manager/Withdrawal/Organizer/organizers';
import OrganizerManagerWithdraw from '../../components/Manager/Withdrawal/Organizer';
import HistoryWithdrawals from '../../components/Manager/Withdrawal/View/history';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

const Admin = (props) => {
  const { isLightMode } = props;
  return (
    <div className='admin'>
      <AccountMenu {...props} />
      <div className={`${isLightMode ? 'bg-light-mode' : 'bg-dark-mode'} wrapper d-flex flex-column min-vh-100 panel-body bg-black`}>
        <HeaderPanel {...props} />
        <Routes>
          <Route index element={<AdminDashboard {...props} />} />
          <Route path='events' element={<ManagerEvent {...props} />} />
          <Route path='tickets' element={<ManagerTicket {...props} />} />
          <Route path='coupons' element={<ManagerCoupon {...props} />} />
          <Route path='orders' element={<ManagerOrder {...props} />} />
          <Route path='scan' element={<ManagerScanner {...props} />} />
          <Route path='media' element={<ManagerMedia {...props}/>} />
          <Route path='gallery' element={<ManagerGallery {...props}/>} />
          <Route path='account' element={<ManagerAccount {...props} />} />
          <Route path='security' element={<AccountSecurity {...props} />} />
          <Route path='newsletter' element={<ManagerNewsletter {...props} />} />
          <Route path='settings' element={<Setting {...props} />} />

          <Route path='events/add' element={<AddEvent {...props} />} />
          <Route path='events/edit/:id' element={<EditEvent {...props} />} />
          <Route path='events/my-events' element={<AdminEvent />} />

          <Route path='tickets/add' element={<AddTicket {...props}/>} />
          <Route path='tickets/edit/:id' element={<EditTicket {...props}/>} />
          <Route path='tickets/my-tickets' element={<AdminTicket {...props}/>} />
          
          <Route path='coupons/add' element={<AddCoupon {...props}/>} />
          <Route path='coupons/edit/:id' element={<EditCoupon {...props}/>} />
          <Route path='coupons/my-coupons' element={<AdminCoupon {...props}/>} />

          <Route path='gallery/add' element={<AddGallery {...props}/>} />
          <Route path='gallery/edit/:id' element={<EditGallery {...props}/>} />

          <Route path='media/add' element={<AddMedia {...props}/>} />

          <Route path='order/:id' element={<ViewOrder {...props} />} />
          <Route path='orders/my-orders' element={<AdminOrder {...props} />} />

          <Route path='users' element={<ManagerUsers {...props} />} />
          <Route path='guests' element={<ManagerGuests {...props} />} />

          <Route path='organizers' element={<ManagerOrganizers {...props} />} />
          <Route path='organizer/:id' element={<OrganizerView {...props} />} />
          
          <Route path='products' element={<ManagerProduct {...props} />} />
          <Route path='products/add' element={<AddProduct {...props} />} />
          <Route path='products/edit/:id' element={<EditProduct {...props} />} />

          <Route path='newsletter/add' element={<AddNewsletter {...props} />} />
          <Route path='newsletter/:id' element={<CampaignView {...props} />} />

          <Route path='withdrawals' element={<ManagerWithdraw {...props} />} />
          <Route path='withdrawal/:id' element={<WithdrawView {...props} />} />
          <Route path='withdrawals/organizers' element={<OrganizersManagerWithdraw {...props} />} />
          <Route path='withdrawals/organizer/:id' element={<OrganizerManagerWithdraw {...props} />} />
          <Route path='withdrawals/history' element={<HistoryWithdrawals {...props} />} />
          
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;