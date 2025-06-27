import { combineReducers } from '@reduxjs/toolkit';
import signup from './containers/SignUp/reducer'
import authentication from './containers/Authentication/reducer';
import account from './containers/Account/reducer';
import dashboard from './containers/Dashboard/reducer';


const rootReducer = combineReducers({
    account,
    authentication,
    signup,
    dashboard,
})
export default rootReducer;

