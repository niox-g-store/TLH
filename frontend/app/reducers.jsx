import { combineReducers } from '@reduxjs/toolkit';
import signup from './containers/SignUp/reducer';
import authentication from './containers/Authentication/reducer';
import account from './containers/Account/reducer';
import dashboard from './containers/Dashboard/reducer';
import login from './containers/Login/reducer';
import navigation from './containers/Navigation/reducer';
import event from './containers/Events/reducer';
import cart from './containers/Cart/reducer';
import ticket from './containers/Ticket/reducer';
import coupon from './containers/Coupon/reducer';
import gallery from './containers/Gallery/reducer';
import media from './containers/Media/reducer';
import order from './containers/Order/reducer';
import user from './containers/User/reducer';
import guest from './containers/Guest/reducer';
import organizer from './containers/Organizer/reducer';
import scan from './containers/Scan/reducer';
import forgotPassword from './containers/ForgotPassword/reducer';
import resetPassword from './containers/ResetPassword/reducer';
import product from './containers/Product/reducer';
import setting from './containers/Setting/reducer';
import newsletter from './containers/Newsletter/reducer';
import newsletterUnsubscribe from './containers/Unsubscribe/reducer';
import withdraw from './containers/Withdrawal/reducer';

const rootReducer = combineReducers({
  account,
  authentication,
  signup,
  dashboard,
  login,
  navigation,
  cart,
  event,
  ticket,
  coupon,
  gallery,
  media,
  order,
  user,
  guest,
  organizer,
  scan,
  forgotPassword,
  resetPassword,
  product,
  setting,
  newsletter,
  newsletterUnsubscribe,
  withdraw,
});
export default rootReducer;