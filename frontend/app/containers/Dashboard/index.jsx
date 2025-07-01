/**
 *
 * Dashboard
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { ROLES } from '../../constants';
import dashboardLinks from './links.json';
import { isDisabledOrganizerAccount } from '../../utils/app';
import Admin from '../Admin';
import Organizer from '../Organizer';
import Customer from '../Customer/Dashboard';
import DisabledOrganizerAccount from '../Organizer/DisabledAccount';
import LoadingIndicator from '../../components/store/LoadingIndicator';

class Dashboard extends React.PureComponent {
  componentDidMount() {
    this.props.fetchProfile();
  }

  render() {
    const {
      user, isLoading,
      isMenuOpen, toggleDashboardMenu,
      signOut, toggleDashboardTheme,
      isLightMode
    } = this.props;
    // if (isDisabledOrganizerAccount(user)) { return <DisabledOrganizerAccount user={user} />; }
    console.log(user)

    return (
      <div className='dashboard'>
        {isLoading ?  (
          <LoadingIndicator isLightMode={isLightMode}/>
        ) : user.role === ROLES.Admin ? (
          <Admin
          {...props}
          />
        ) : user.role === ROLES.Organizer && user.organizer ? (
          <Organizer
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Organizer]}
            toggleMenu={toggleDashboardMenu}
            signOut={signOut}
            toggleDashboardTheme={toggleDashboardTheme}
            isLightMode={isLightMode}
          />
        ) : (
          <Customer
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Member]}
            toggleMenu={toggleDashboardMenu}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    isLoading: state.account.isLoading,
    isMenuOpen: state.dashboard.isMenuOpen,
    isLightMode: state.dashboard.isLightMode
  };
};

export default connect(mapStateToProps, actions)(Dashboard);
