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
import Customer from '../Customer/';
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
      isLightMode, eventFormData,
      eventFormErrors, eventCategories,
      eventIsLoading, ticketFormData,
      ticketFormErrors, events,
      eventEditFormErrors, event,
      eventTickets, tickets,
      ticket, ticketEditFormErrors,
      couponFormData, couponFormErrors,
      couponEditFormErrors, coupons,
      coupon, couponIsLoading,

      eventChange, addEvent,
      ticketChange, addTicket,
      couponChange, addCoupon,
      fetchEvents, updateEvent,
      createEventTicket, editEventTicket,
      deleteEventTicket, addEventTicket,
      editTicketChange, couponEditChange,
      updateCoupon, fetchCoupons,
      deleteCoupon, resetCoupon,
      fetchCoupon, getUserCoupons,
      couponsOptions,

      accountEditFormErrors,
      isRangeSelection, startDate, endDate, singleDate, filterTarget,
      filterSystemOpen, toggleFilterSystem, isDashboardLoading,
      dashboardAnalytics, addUserBank, banks, bankFormError,

      initialiseWithdrawal, fetchWithdrawals,
      routeType, setDashboardRouter
    } = this.props;
    
    if (isDisabledOrganizerAccount(user)) {
      return (
        <DisabledOrganizerAccount signOut={signOut}
                                  isLightMode={isLightMode}
                                  user={user}
        />
      )
    }
    if (user?.banned || user?.organizer?.banned) {
      return signOut();
    }

    if (user.role === ROLES.Admin) {
      return (
        <div className='dashboard'>
          {isLoading && <LoadingIndicator isLightMode={isLightMode}/> }
            <Admin
              {...this.props}
              links={dashboardLinks[ROLES.Admin]}
              toggleMenu={toggleDashboardMenu}
            />
        </div>
      );
    }

    if (user.role === ROLES.Organizer) {
      return (
        <div className='dashboard'>
          {isLoading && <LoadingIndicator isLightMode={isLightMode}/> }
          <Organizer
            {...this.props}
            links={dashboardLinks[ROLES.Organizer]}
            toggleMenu={toggleDashboardMenu}
          />
        </div>
      )
    }

    if (user.role === ROLES.Member) {
      return (
        <div className='dashboard'>
          {isLoading && <LoadingIndicator isLightMode={isLightMode}/> }
            <Customer
              {...this.props}
              isMenuOpen={isMenuOpen}
              links={dashboardLinks[ROLES.Member]}
              toggleMenu={toggleDashboardMenu}
            />
        </div>
      );
    }

  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    isLoading: state.account.isLoading,
    isMenuOpen: state.dashboard.isMenuOpen,
    isLightMode: state.dashboard.isLightMode,
    routeType: state.dashboard.routeType,

    event: state.event.event,
    events: state.event.events,
    eventFormData: state.event.eventFormData,
    eventFormErrors: state.event.formErrors,
    eventCategories: state.event.eventCategories,
    eventIsLoading: state.event.isLoading,
    eventEditFormErrors: state.event.editFormErrors,
    eventTickets: state.event.eventTickets,

    ticketFormData: state.ticket.ticketForm,
    ticketFormErrors: state.ticket.ticketFormErrors,
    ticketEditFormErrors: state.ticket.editFormErrors,
    ticketIsLoading: state.ticket.isLoading,
    tickets: state.ticket.tickets,
    ticket: state.ticket.ticket,

    couponFormData: state.coupon.couponFormData,
    couponFormErrors: state.coupon.formErrors,
    couponEditFormErrors: state.coupon.editFormErrors,
    couponIsLoading: state.coupon.isLoading,
    coupons: state.coupon.coupons,
    coupon: state.coupon.coupon,
    couponsOptions: state.coupon.couponsSelect,

    accountEditFormErrors: state.account.editFormErrors,

    isRangeSelection: state.dashboard.isRangeSelection,
    startDate: state.dashboard.startDate,
    endDate: state.dashboard.endDate,
    singleDate: state.dashboard.singleDate,
    filterTarget: state.dashboard.filterTarget,
    filterSystemOpen: state.dashboard.filterSystemOpen,
    isDashboardLoading: state.dashboard.isDashboardLoading,
    dashboardAnalytics: state.dashboard.dashboardAnalytics,

    banks: state.account.banks,
  };
};

export default connect(mapStateToProps, actions)(Dashboard);