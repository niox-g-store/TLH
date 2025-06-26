import { bindActionCreators } from 'redux';

import * as authentication from "../app/containers/Authentication/actions";
import * as signUp from "../app/containers/SignUp/actions";

export default function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            ...authentication,
            ...signUp,
        },
        dispatch
    );
}
