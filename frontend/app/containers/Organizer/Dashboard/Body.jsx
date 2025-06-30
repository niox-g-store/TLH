import React, { useState } from 'react';
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
import { attendeesData } from './attendeesData';
import AttendeesTable from '../../../components/store/AttendeesTable';
import PeriodDropdown from '../../../components/store/PeriodPicker';
import { Link } from 'react-router-dom';

const BodyPanel = (props) => {
  const { toggleDashboardTheme, isLightMode } = props;

  return (
    <div className='body-panel'>
      <div className='container-lg px-4 mb-custom-5em'>
        <div data-aos='fade-up' className='d-flex gap-3 flex-wrap mb-4' style={{ alignItems: 'stretch' }}>
          <div className='d-flex flex-column gap-3' style={{ maxWidth: '100%', flexShrink: 0 }}>

            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary border-15`}>
              <CCardBody>
                <div className='d-flex justify-content-between align-items-start mb-2'>
                  <CCardTitle>2,000 Ticket Sold</CCardTitle>
                  <PeriodDropdown />
                </div>
                <CCardText>June 1st - June 30th</CCardText>
                <ChartLine />
              </CCardBody>
            </CCard>

            {/* Event Created + Orders */}
            <div className='d-flex gap-3'>
              <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary border-15`} style={{ flex: 1 }}>
                <CCardBody>
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <CCardTitle>Events Created</CCardTitle>
                  </div>

                  <CCardText className='d-flex justify-content-between align-items-center font-size-20'>10 <MdOutlineEventRepeat size={30} /></CCardText>
                  <CCardText>June 1st - June 30th</CCardText>
                  <PeriodDropdown className='period-d-md' />
                </CCardBody>
              </CCard>

              <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary border-15 `} style={{ flex: 1 }}>
                <CCardBody>
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <CCardTitle>Orders</CCardTitle>
                  </div>
                  <CCardText className='d-flex justify-content-between align-items-center font-size-20'>50 <IoReceiptOutline size={30} /></CCardText>
                  <CCardText>June 1st - June 30th</CCardText>
                  <PeriodDropdown className='period-d-md' />
                </CCardBody>
              </CCard>
            </div>
          </div>

          {/* RIGHT COLUMN - Income card */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white c-primary h-100 border-15 `}>
              <CCardBody className='d-flex flex-column justify-content-between'>
                <div className='d-flex justify-content-between align-items-start mb-2'>
                  <CCardTitle>NGN 620,000 Income</CCardTitle>
                  <PeriodDropdown />
                </div>
                <CCardText>June 1st - June 30th</CCardText>
                <div style={{ height: '14em' }}>
                  <BarChart />
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>

        {/* Social Cards */}
        <CRow className='mb-4 g-2'>
          <CCol sm={3}>
            <CCard className='purple-bg p-white border-15 linear-grad-2'>
              <CCardBody>
                <CCardTitle>Top Selling Event</CCardTitle>
                <CCardText><Link to='/dashboard/event/white-house-party'>White House Party</Link></CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className='purple-bg p-white border-15 linear-grad-2'>
              <CCardBody>
                <CCardTitle>Upcoming Events</CCardTitle>
                <CCardText>2</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className='purple-bg p-white border-15 linear-grad-2'>
              <CCardBody>
                <CCardTitle>Past Event</CCardTitle>
                <CCardText>8</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={3}>
            <CCard className='purple-bg p-white border-15 linear-grad-2'>
              <CCardBody>
                <CCardTitle>Events</CCardTitle>
                <CCardText>12+ Events, 4 Meetings</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <AttendeesTable {...props} data={attendeesData} />

      </div>
    </div>
  );
};

export default BodyPanel;
