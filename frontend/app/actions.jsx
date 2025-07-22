import { bindActionCreators } from 'redux';

import * as authentication from '../app/containers/Authentication/actions';
import * as signUp from '../app/containers/SignUp/actions';
import * as notifications from '../app/containers/Notification/actions';
import * as account from '../app/containers/Account/actions';
import * as dashboard from '../app/containers/Dashboard/actions';
import * as login from '../app/containers/Login/actions';
import * as navigation from '../app/containers/Navigation/actions';
import * as event from '../app/containers/Events/actions';
import * as ticket from '../app/containers/Ticket/actions';
import * as coupon from '../app/containers/Coupon/actions';
import * as gallery from '../app/containers/Gallery/actions';
import * as media from '../app/containers/Media/actions';
import * as cart from '../app/containers/Cart/actions';
import * as order from '../app/containers/Order/actions';
import * as user from '../app/containers/User/actions';
import * as guest from '../app/containers/Guest/actions';
import * as organizer from '../app/containers/Organizer/actions';
import * as scan from '../app/containers/Scan/actions';
import * as forgotPassword from '../app/containers/ForgotPassword/action';
import * as resetPassword from '../app/containers/ResetPassword/actions';
import * as product from '../app/containers/Product/actions';
import * as setting from '../app/containers/Setting/actions';
import * as newsletter from '../app/containers/Newsletter/actions';

export default function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      ...authentication,
      ...signUp,
      ...notifications,
      ...account,
      ...dashboard,
      ...login,
      ...navigation,
      ...event,
      ...ticket,
      ...coupon,
      ...gallery,
      ...media,
      ...cart,
      ...order,
      ...user,
      ...guest,
      ...organizer,
      ...scan,
      ...forgotPassword,
      ...resetPassword,
      ...product,
      ...setting,
      ...newsletter,
    },
    dispatch
  );
}