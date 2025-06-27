import { bindActionCreators } from 'redux';

import * as authentication from "../app/containers/Authentication/actions";
import * as signUp from "../app/containers/SignUp/actions";
import * as notifications from "../app/containers/Notification/actions";
import * as account from "../app/containers/Account/actions";
import * as dashboard from "../app/containers/Dashboard/actions";

export default function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            ...authentication,
            ...signUp,
            ...notifications,
            ...account,
            ...dashboard,
        },
        dispatch
    );
}
