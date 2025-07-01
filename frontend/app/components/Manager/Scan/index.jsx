import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardTitle,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import QRScanner from './QrScanner';

const mockScannedTickets = Array.from({ length: 34 }, (_, i) => ({
  code: `TCKT${1000 + i}`,
  event: `Event ${i % 5 + 1}`,
  ticketType: ['VIP', 'Regular', 'Backstage'][i % 3],
  owner: i % 2 === 0 ? 'User' : 'Guest',
  used: i % 4 === 0,
  scannedAt: new Date().toLocaleString()
}));

const TicketScanner = (props) => {
  const { isLightMode } = props;
  const [code, setCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const [scannedCode, setScannedCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const currentTickets = mockScannedTickets.slice(startIndex, startIndex + ticketsPerPage);
  const totalPages = Math.ceil(mockScannedTickets.length / ticketsPerPage);

  const handleScan = () => {
    if (code.trim()) {
      alert(`Searching ticket code: ${code}`);
      setCode('');
    }
  };

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <CCard className={`${isLightMode ? '' : 'border-0'} mb-4`}>
        <CCardBody className={`${isLightMode ? 'bg-white' : 'bg-black'}`}>
          <CCardTitle className={`${isLightMode ? 'p-black' : 'p-white'} mb-3 font-size-30`}>Ticket Scanner</CCardTitle>
          <div className='d-flex flex-column gap-2'>
          <CForm className='d-flex gap-2'>
            <CFormInput
              style={{ width: '90%' }}
              placeholder='Enter ticket code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <CButton className='linear-grad p-white' onClick={handleScan}>
              Scan Ticket
            </CButton>
          </CForm>


            <div style={{ marginTop: '1em' }} className='d-flex flex-column-reverse gap-2 align-items-center'>
    <CButton
      className='linear-grad p-white'
      onClick={() => setShowScanner(true)}
    >
        Scan QR Code
    </CButton>

<CModal
  visible={showScanner}
  onClose={() => setShowScanner(false)}
  fullscreen
>
  <CModalHeader>
    <CModalTitle>Scan Ticket</CModalTitle>
  </CModalHeader>
  <CModalBody className="d-flex justify-content-center align-items-center">
    <QRScanner
      onScanSuccess={(code) => {
        setScannedCode(code);
        setShowScanner(false);
      }}
    />
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setShowScanner(false)}>
      Close
    </CButton>
  </CModalFooter>
</CModal>
  </div>

          </div>

        </CCardBody>
      </CCard>

      <CCard className={`${isLightMode ? '' : 'border-0'}`}>
        <CCardBody className={`${isLightMode ? 'bg-white' : 'bg-black'}`}>
          <CCardTitle className={`${isLightMode ? 'p-black' : 'p-white'} mb-3`}>Scanned Tickets</CCardTitle>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Code</CTableHeaderCell>
                <CTableHeaderCell>Event</CTableHeaderCell>
                <CTableHeaderCell>Ticket Type</CTableHeaderCell>
                <CTableHeaderCell>Owner Type</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Scanned At</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentTickets.map((ticket, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{startIndex + idx + 1}</CTableDataCell>
                  <CTableDataCell>{ticket.code}</CTableDataCell>
                  <CTableDataCell>{ticket.event}</CTableDataCell>
                  <CTableDataCell>{ticket.ticketType}</CTableDataCell>
                  <CTableDataCell>{ticket.owner}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={ticket.used ? 'danger' : 'success'}>
                      {ticket.used ? 'Used' : 'Valid'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{ticket.scannedAt}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className='d-flex justify-content-between align-items-center mt-3'>
            <div className={`${isLightMode ? 'p-black' : 'p-white'} text-muted`}>
              Showing {startIndex + 1}-{startIndex + currentTickets.length} of {mockScannedTickets.length}
            </div>
            <CPagination className='mb-0'>
              {[...Array(totalPages)].map((_, index) => (
                <CPaginationItem
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => {
                    setCurrentPage(index + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TicketScanner;
