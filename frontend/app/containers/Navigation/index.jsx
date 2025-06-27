/**
 *
 * Navigation
 * 
 */

import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import Header from '../../components/Common/Header';
import dashboardLinks from "../Dashboard/links.json";
import { ROLES } from '../../constants';

class Navigation extends React.PureComponent {
  
  componentDidMount () {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.fetchProfile();
    }
  }
    componentDidUpdate() {
    }
    componentWillUnmount() {
    }

    render() {
      const {
        history,
        authenticated,
        user,
        signOut,
        isMenuOpen,
        toggleMenu,
        links
      } = this.props;

      return (
        <Header {...this.props} />
      );
  }
}

const mapStateToProps = (state) => {
  const u = state.account.user;
  const filterLinks = dashboardLinks[u.role]
  return {
    authenticated: state.authentication.authenticated,
    user: state.account.user,
    isMenuOpen: state.navigation.isMenuOpen,
    links: filterLinks
  };
};

export default connect(mapStateToProps, actions)(Navigation);