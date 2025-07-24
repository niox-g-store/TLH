import React from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardText,
  CProgressBar,
  CProgress,
  CAvatar,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartLine from '../../../components/store/Core/chartLine';
import ChartBar from '../../../components/store/Core/chartBar';
import ChartBubble from '../../../components/store/Core/chartBubble';
import ChartArea from '../../../components/store/Core/chartArea';
import BarChart from '../../../components/store/Core/barChart';
import { IoBasketOutline, IoReceiptOutline } from 'react-icons/io5';
import { MdOutlineEventRepeat } from 'react-icons/md';
import DropdownConfirm from '../../../components/store/DropdownConfirm';
import AttendeesTable from '../../../components/store/AttendeesTable';
import PeriodDropdown from '../../../components/store/PeriodPicker';
import { Link } from 'react-router-dom';
// import { FilterSystem } from '../../../components/store/PeriodPicker';
import FilterSystem from '../../../components/store/AnalyticsFilterSystem';
import Button from '../../../components/Common/HtmlTags/Button';
import LoadingIndicator from '../../../components/store/LoadingIndicator';
import actions from '../../../actions';
import { connect } from 'react-redux';

const AdminDashboardTemplate = (props) => {
  const {
    isLightMode,
    toggleFilterSystem,
    filterSystemOpen,
    isDashboardLoading,
    dashboardAnalytics,
    stats,

    attendees,
    attendeesPage,
    attendeesTotalPages,
    fetchAttendees,
    onApplyFilter,
    attendeesDownload
  } = props;

  const ticketsSold = dashboardAnalytics?.tickets?.totalSold || 0
  const ticketPeriod = dashboardAnalytics?.tickets?.labels?.length > 1 ?
    dashboardAnalytics?.tickets?.labels[0] +
    '-'
    +
    dashboardAnalytics?.tickets?.labels[dashboardAnalytics?.tickets?.labels?.length - 1]
    :
    dashboardAnalytics?.tickets?.labels[0]

  const incomePeriod = dashboardAnalytics?.income?.labels?.length > 1 ?
    dashboardAnalytics?.income?.labels[0] +
    '-'
    +
    dashboardAnalytics?.income?.labels[dashboardAnalytics?.income?.labels?.length - 1]
    :
    dashboardAnalytics?.income?.labels[0]

  return (
    <div className='body-panel'>
      {isDashboardLoading && <LoadingIndicator />}
      <div className='container-lg px-4 mb-custom-5em'>
        <div style={{ alignItems: 'center', flexWrap: 'wrap' }} className='d-flex dashboard-controls-container'>
          <div className='d-flex dashboard-controls-head'>
            <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black': 'p-white'}`}>Dashboard</h2>
            <Button className="third-btn" text={`${filterSystemOpen ? 'Close filter controls' : 'Open Filter controls'}`} onClick={toggleFilterSystem} />
          </div>
          {filterSystemOpen &&
            <FilterSystem {...props} />
          }
        </div>
        <hr className={`${isLightMode ? 'p-black': 'p-white'}`}></hr>
        <div data-aos='fade-up' className='d-flex gap-3 flex-wrap mb-4' style={{ alignItems: 'stretch', zIndex: '1', position: 'relative' }}>
          <div className='dashboard-analytics d-flex flex-column gap-3' style={{ maxWidth: '100%', flexShrink: 0 }}>

            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary border-15`}>
              <CCardBody>
                <div className='d-flex justify-content-between align-items-start mb-2'>
                  <CCardTitle>{ticketsSold} Ticket Sold</CCardTitle>
                  <PeriodDropdown
                    dashboardAnalytics={dashboardAnalytics}
                    onApplyFilter={onApplyFilter}
                    className='period-d-md'
                    target={"tickets"}
                  />                  
                </div>
                <CCardText>{ticketPeriod}</CCardText>
                <ChartLine ticket={dashboardAnalytics?.tickets || ''}/>
              </CCardBody>
            </CCard>

            {/* Event Created + Orders */}
            <div className='d-flex gap-3'>
              <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary border-15`} style={{ flex: 1 }}>
                <CCardBody>
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <CCardTitle>Events Created</CCardTitle>
                  </div>

                  <CCardText className='d-flex justify-content-between align-items-center font-size-20'>{dashboardAnalytics?.events?.total} <MdOutlineEventRepeat size={30} /></CCardText>
                  <CCardText>{dashboardAnalytics?.events?.start} - {dashboardAnalytics?.events?.end}</CCardText>
                  <PeriodDropdown
                    dashboardAnalytics={dashboardAnalytics}
                    onApplyFilter={onApplyFilter}
                    className='period-d-md'
                    target={'events'}
                  />
                </CCardBody>
              </CCard>

              <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary border-15 `} style={{ flex: 1 }}>
                <CCardBody>
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <CCardTitle>Orders Received</CCardTitle>
                  </div>
                  <CCardText className='d-flex justify-content-between align-items-center font-size-20'>{dashboardAnalytics?.orders?.total} <IoReceiptOutline size={30} /></CCardText>
                  <CCardText>{dashboardAnalytics?.orders?.start} - {dashboardAnalytics?.orders?.end}</CCardText>
                  <PeriodDropdown
                    dashboardAnalytics={dashboardAnalytics}
                    onApplyFilter={onApplyFilter}
                    className='period-d-md'
                    target={'orders'}
                  />
                </CCardBody>
              </CCard>
            </div>
          </div>

          {/* RIGHT COLUMN - Income card */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary h-100 border-15 `}>
              <CCardBody className='d-flex flex-column justify-content-between'>
                <div className='d-flex justify-content-between align-items-start mb-2'>
                  <CCardTitle>NGN {(dashboardAnalytics?.income?.total)?.toLocaleString() || ''} Income</CCardTitle>
                  <PeriodDropdown
                    dashboardAnalytics={dashboardAnalytics}
                    onApplyFilter={onApplyFilter}
                    className='period-d-md'
                    target={"income"}
                  />
                </div>
                <CCardText>{incomePeriod}</CCardText>
                <div style={{ height: '14em' }}>
                  <BarChart
                    incomeData={dashboardAnalytics?.income?.data || ''}
                    labels={dashboardAnalytics?.income?.labels || ''}
                  />
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>



        {/* Social Cards */}
<CRow className='mb-4 g-3'>
  <h2 className={`${isLightMode ? 'p-black': 'p-white'}`}>All time stats</h2>
    <hr className={`${isLightMode ? 'p-black': 'p-white'}`}></hr>
  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Top Selling Event</CCardTitle>
        <CCardText>
          <Link to='/dashboard/event/white-house-party'>{stats?.topSellingEvent || ''}</Link>
        </CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Upcoming Events</CCardTitle>
        <CCardText>{stats?.upcomingEvents || ''}</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Past Event</CCardTitle>
        <CCardText>{stats?.pastEvents || ''}</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Total Events</CCardTitle>
        <CCardText>{stats?.totalEvents || ''}</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Guest Users</CCardTitle>
        <CCardText>{stats?.guestUsers || ''}</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Total Users</CCardTitle>
        <CCardText>{stats?.totalUsers || ''}</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Organizers</CCardTitle>
        <CCardText>{stats?.organizers || ''}</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol xs={6} md={3}>
    <CCard className='purple-bg p-white border-15 linear-grad-2'>
      <CCardBody>
        <CCardTitle>Admins</CCardTitle>
        <CCardText>{stats?.admins || ''}</CCardText>
      </CCardBody>
    </CCard>
  </CCol>
</CRow>
      <AttendeesTable
        {...props}
        attendees={attendees}
        currentPage={attendeesPage}
        totalPages={attendeesTotalPages}
        onPageChange={fetchAttendees}
        attendeesDownload={attendeesDownload}
      />
      </div>
    </div>
  );
};

class AdminDashboard extends React.PureComponent {
  componentDidMount() {
    this.props.fetchAnalData();
    this.props.fetchStatsOverview();
    this.props.fetchAttendees();
  }

  render() {
    return (
      <AdminDashboardTemplate
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    isLoading: state.account.isLoading,
    isMenuOpen: state.dashboard.isMenuOpen,
    isLightMode: state.dashboard.isLightMode,

    isRangeSelection: state.dashboard.isRangeSelection,
    startDate: state.dashboard.startDate,
    endDate: state.dashboard.endDate,
    singleDate: state.dashboard.singleDate,
    filterTarget: state.dashboard.filterTarget,
    filterSystemOpen: state.dashboard.filterSystemOpen,
    isDashboardLoading: state.dashboard.isDashboardLoading,
    dashboardAnalytics: state.dashboard.dashboardAnalytics,
    stats: state.dashboard.stats,
    
    attendees: state.dashboard.attendees,
    attendeesPage: state.dashboard.attendeesPage,
    attendeesTotalPages: state.dashboard.attendeesTotalPages,
  };
};

export default connect(mapStateToProps, actions)(AdminDashboard);
