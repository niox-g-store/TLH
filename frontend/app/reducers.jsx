import { combineReducers } from '@reduxjs/toolkit';
import signupReducer from './containers/SignUp/reducer'
import authenticationReducer from './containers/Authentication/reducer';


const rootReducer = combineReducers({
    authenticationReducer,
    signup: signupReducer
})
export default rootReducer;

