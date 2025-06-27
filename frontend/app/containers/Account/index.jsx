/*
 *
 * Account
 *
 */

import React from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import { ROLES } from '../../constants';
import AccountDetails from '../../components/store/AccountDetails';
import SubPage from '../../components/store/SubPage';

class Account extends React.PureComponent {
  componentDidMount() {
    // this.props.fetchProfile();
    // this.props.fetchBanks();
  }

  render() {
    const { user, accountChange, updateProfile } = this.props;

    if (user.role === ROLES.Admin) {
    // const { deleteBank, banks, createBank, formErrors } = this.props;
    return (
      <div className='account'>
        <SubPage title={'Account Details'} isMenuOpen={null}>
          <AccountDetails
            user={user}
            // banks={banks}
            formErrors={formErrors}
            // accountChange={accountChange}
            // updateProfile={updateProfile}
            // deleteBank={(v) => deleteBank(v)}
            // createBank={(selectedBank, accountNumber, accountName) => createBank(selectedBank, accountNumber, accountName)}
          />
        </SubPage>
      </div>
    );
  } else if (user.role === ROLES.Organizer) {
    return (
        <div className='account'>
        <SubPage title={'Account Details'} isMenuOpen={null}>
          <AccountDetails
            user={user}
            // banks={banks}
            formErrors={formErrors}
            // accountChange={accountChange}
            // updateProfile={updateProfile}
            // deleteBank={(v) => deleteBank(v)}
            // createBank={(selectedBank, accountNumber, accountName) => createBank(selectedBank, accountNumber, accountName)}
          />
        </SubPage>
        </div>
    )
  } else {
    return (
      <div className='account'>
        <SubPage title={'Account Details'} isMenuOpen={null}>
          <AccountDetails
            user={user}
            // accountChange={accountChange}
            // updateProfile={updateProfile}
          />
        </SubPage>
      </div>
    );
  }
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    // resetFormData: state.resetPassword.resetFormData,
    // formErrors: state.resetPassword.formErrors,

    // banks: state.account.banks,
    // formErrors: state.account.bankFormError,
  };
};

export default connect(mapStateToProps, actions)(Account);
