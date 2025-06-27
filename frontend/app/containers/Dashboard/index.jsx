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
import Admin from '../Admin/Dashboard';
import Organizer from '../Organizer/Dashboard';
import Customer from '../Customer/Dashboard';
import DisabledOrganizerAccount from '../Organizer/DisabledAccount';
import LoadingIndicator from '../../components/store/LoadingIndicator';

class Dashboard extends React.PureComponent {
  componentDidMount() {
    this.props.fetchProfile();
  }

  render() {
    const { user, isLoading, isMenuOpen, toggleDashboardMenu } = this.props;
    console.log(user)
    // if (isDisabledOrganizerAccount(user)) { return <DisabledOrganizerAccount user={user} />; }

    return (
      <>
        {isLoading ?  (
          <LoadingIndicator />
        ) : user.role === ROLES.Admin ? (
          <Admin
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Admin]}
            toggleMenu={toggleDashboardMenu}
          />
        ) : user.role === ROLES.Organizer && user.organizer ? (
          <Organizer
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Organizer]}
            toggleMenu={toggleDashboardMenu}
          />
        ) : (
          <Customer
            user={user}
            isMenuOpen={isMenuOpen}
            links={dashboardLinks[ROLES.Member]}
            toggleMenu={toggleDashboardMenu}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    isLoading: state.account.isLoading,
    isMenuOpen: state.dashboard.isMenuOpen
  };
};

export default connect(mapStateToProps, actions)(Dashboard);
