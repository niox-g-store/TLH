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
  CTableDataCell,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ChartLine from '../../../components/store/Core/chartLine';
import ChartBar from '../../../components/store/Core/chartBar';
import ChartBubble from '../../../components/store/Core/chartBubble';
import ChartArea from '../../../components/store/Core/chartArea';
import BarChart from '../../../components/store/Core/barChart';
import { IoBasketOutline, IoReceiptOutline } from "react-icons/io5";
import { MdOutlineEventRepeat } from "react-icons/md";
import DropdownConfirm from '../../../components/store/DropdownConfirm';
import { attendeesData } from './attendeesData';
import AttendeesTable from '../../../components/store/AttendeesTable';
import PeriodDropdown from '../../../components/store/PeriodPicker';

const BodyPanel = (props) => {
  const [ticketPeriod, setTicketPeriod] = useState('month');
const [eventPeriod, setEventPeriod] = useState('week');
const [incomePeriod, setIncomePeriod] = useState('today');
  return (
    <div className='body-panel'>
        <div className='container-lg px-4'>
<div data-aos="fade-up" className="d-flex gap-3 flex-wrap mb-4" style={{ alignItems: 'stretch' }}>
  <div className="d-flex flex-column gap-3" style={{ maxWidth: '100%', flexShrink: 0 }}>


    <CCard className="text-white c-primary">
      <CCardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <CCardTitle>2,000 Ticket Sold</CCardTitle>
          <PeriodDropdown />
        </div>
        <CCardText>June 1st - June 30th</CCardText>
        <ChartLine />
      </CCardBody>
    </CCard>

    {/* Event Created + Orders */}
    <div className="d-flex gap-3">
      <CCard className="text-white c-primary" style={{ flex: 1 }}>
        <CCardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <CCardTitle>Events Created</CCardTitle>
          <PeriodDropdown className={"d-none d-lg-block"}/>
        </div>
          
          <CCardText className='d-flex justify-content-between align-items-center font-size-20'>10 <MdOutlineEventRepeat size={30}/></CCardText>
          <CCardText>June 1st - June 30th</CCardText>
          <PeriodDropdown className={"period-d-md"}/>
        </CCardBody>
      </CCard>


      <CCard className="text-white c-primary" style={{ flex: 1 }}>
        <CCardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <CCardTitle>Orders</CCardTitle>
          <PeriodDropdown className={"d-none d-lg-block"}/>
        </div>
          <CCardText className='d-flex justify-content-between align-items-center font-size-20'>50 <IoReceiptOutline size={30}/></CCardText>
          <CCardText>June 1st - June 30th</CCardText>
        <PeriodDropdown className={"period-d-md"}/>
        </CCardBody>
      </CCard>
    </div>
  </div>

  {/* RIGHT COLUMN - Income card */}
  <div style={{ flex: 1, minWidth: '280px' }}>
    <CCard className="text-white c-primary h-100">
      <CCardBody className="d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-2">
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
      <CRow className="mb-4">
        <CCol sm={3}>
          <CCard>
            <CCardBody>
              <CCardTitle>Upcoming Events</CCardTitle>
              <CCardText>2</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard>
            <CCardBody>
              <CCardTitle>Past Events</CCardTitle>
              <CCardText>8</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard>
            <CCardBody>
              <CCardTitle>LinkedIn</CCardTitle>
              <CCardText>500 Contacts, 1,292 Feeds</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard>
            <CCardBody>
              <CCardTitle>Events</CCardTitle>
              <CCardText>12+ Events, 4 Meetings</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      <AttendeesTable data={attendeesData}/>

      </div>
    </div>
  )
}

export default BodyPanel
