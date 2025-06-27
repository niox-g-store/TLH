import { combineReducers } from '@reduxjs/toolkit';
import signup from './containers/SignUp/reducer'
import authentication from './containers/Authentication/reducer';
import account from './containers/Account/reducer';
import dashboard from './containers/Dashboard/reducer';
import login from './containers/Login/reducer';


const rootReducer = combineReducers({
    account,
    authentication,
    signup,
    dashboard,
    login,
})
export default rootReducer;

