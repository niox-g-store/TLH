import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  CCard, CCardBody, CCardTitle, CForm, CFormInput, CButton,
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell,
  CTableDataCell, CPagination, CPaginationItem, CBadge, CModal,
  CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import QRScanner from './QrScanner';
import actions from '../../../actions';
import { formatDateScan } from '../../../utils/formatDate';
import LoadingIndicator from '../../store/LoadingIndicator';

const ManagerScannerView = (props) => {
  const { isLoading,
          isLightMode, scannedTicket = {},
          addScannedTicket, scannedTickets = [],
          showScanModal, getTicketDetails,
          code, setCode } = props;
  const [showScanner, setShowScanner] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  useEffect(() => {
    if (showScanModal) {
      setShowScanner(false);
    }
  }, [showScanModal]);

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const currentTickets = scannedTickets.slice(startIndex, startIndex + ticketsPerPage);
  const totalPages = Math.ceil(scannedTickets.length / ticketsPerPage);

  const handleScan = () => {
    if (code.trim()) {
      const ticket = {
        code,
        scannedAt: new Date()
      };
      getTicketDetails(ticket);
    }
  };
  const handleTicketCheckIn = () => {
    if (code.trim()) {
      const ticket = {
        code,
        scannedAt: new Date()
      }
      addScannedTicket(ticket);
      setCode('')
    }
  }

  return (
    <div className='container-lg px-4 d-flex flex-column'>
      {isLoading && <LoadingIndicator />}
      <CCard>
        <CCardBody className={`${isLightMode ? 'bg-white' : 'bg-black'} d-flex flex-column`}>
          <CCardTitle className={isLightMode ? 'p-black' : 'p-white'}>Ticket Scanner</CCardTitle>

          <CForm className='d-flex gap-2 my-3'>
            <CFormInput
              placeholder='Enter ticket code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <CButton className='linear-grad p-white' onClick={handleScan}>Scan Ticket</CButton>
          </CForm>

          <CButton style={{ width: 'fit-content', alignSelf: 'center', padding: '15px' }} className='linear-grad p-white' onClick={() => setShowScanner(true)}>
            Scan QR Code
          </CButton>

<CModal visible={showScanner} onClose={() => setShowScanner(false)} fullscreen>
  <CModalHeader>
    <CModalTitle>Scan Ticket</CModalTitle>
  </CModalHeader>
  <CModalBody className='d-flex justify-content-center align-items-center'>
    {showScanner && (
      <QRScanner
        onScanSuccess={(code) => {
            const codeData = JSON.parse(code);
            setCode(codeData.code);
            getTicketDetails({ code: codeData.code, scannedAt: new Date() }, true);
            // don’t close modal yet, let user see result
        }}
      />
    )}
  </CModalBody>
  <CModalFooter style={{ justifyContent: 'center' }}>
    <CButton className="purple-bg p-white" onClick={() => setShowScanner(false)}>
      Close
    </CButton>
  </CModalFooter>
</CModal>

        </CCardBody>
      </CCard>

      <CCard className='mt-4'>
        <CCardBody className={`${isLightMode ? 'bg-white' : 'bg-black'} d-flex flex-column`}>
          <CCardTitle className={isLightMode ? 'p-black' : 'p-white'}>Scanned Tickets</CCardTitle>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Code</CTableHeaderCell>
                <CTableHeaderCell>Event</CTableHeaderCell>
                <CTableHeaderCell>Ticket Type</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Owner</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Scanned At</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentTickets.map((ticket, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                  <CTableDataCell>{ticket.code}</CTableDataCell>
                  <CTableDataCell>{ticket.eventName}</CTableDataCell>
                  <CTableDataCell>{ticket.ticketType}</CTableDataCell>
                  <CTableDataCell>{ticket.billingName || ''}</CTableDataCell>
                  <CTableDataCell>{ticket.billingEmail || ''}</CTableDataCell>
                  <CTableDataCell>{ticket.ownedByModel || ''}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={ticket.used ? 'success' : 'danger'}>
                      {ticket.used ? 'Used' : 'Valid'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{formatDateScan(ticket.scannedAt)}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className='d-flex justify-content-between align-items-center mt-3'>
            <div className={`${isLightMode ? 'p-black' : 'p-white'} text-muted`}>
              Showing {startIndex + 1}-{startIndex + currentTickets.length} of {scannedTicket.length}
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
                >
                  {index + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </div>
        </CCardBody>
      </CCard>

<CModal  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} visible={showScanModal} onClose={() => {}}>
  <CModalHeader>
    <CModalTitle>Ticket Details</CModalTitle>
  </CModalHeader>
  <CModalBody>
    {scannedTicket && (
      <div className='d-flex flex-column gap-2'>
        <p><strong>Code: </strong>{scannedTicket.code || 'N/A'}</p>
        <p><strong>Name:</strong> {scannedTicket.billingName || 'N/A'}</p>
        <p><strong>Email:</strong> {scannedTicket.billingEmail || 'N/A'}</p>
        <p><strong>Owner Type:</strong> {scannedTicket.ownedByModel}</p>
        <p><strong>Event:</strong> {scannedTicket.eventName}</p>
        <p><strong>Ticket Type:</strong> {scannedTicket.ticketType}</p>

        {/* Coupon Info */}
        {scannedTicket.coupon && (
          <>
            <p><strong>Coupon:</strong> {scannedTicket.coupon}</p>
            {scannedTicket.couponAmount > 0 && (
              <p><strong>Coupon Discount:</strong> ₦{scannedTicket.couponAmount.toLocaleString()} off</p>
            )}
            {scannedTicket.couponPercentage > 0 && (
              <p><strong>Coupon Discount:</strong> {scannedTicket.couponPercentage}% off</p>
            )}
          </>
        )}

        {/* Ticket Discount Info */}
        {scannedTicket.discount && (
          <>
            <p><strong>Original Price:</strong> ₦{(scannedTicket.price).toLocaleString()}</p>
            <p><strong>Discount Amount:</strong> ₦{scannedTicket.discountAmount.toLocaleString()}</p>
            <p><strong>Discounted Price:</strong> ₦{scannedTicket.discountPrice.toLocaleString()}</p>
          </>
        )}
      </div>
    )}
  </CModalBody>
  <CModalFooter style={{ justifyContent: 'center' }}>
    <CButton onClick={handleTicketCheckIn} className="purple-bg p-white">Check in</CButton>
  </CModalFooter>
</CModal>
    </div>
  );
};
class ManagerScanner extends React.PureComponent {
  componentDidMount () {
    this.props.fetchScannedTicket();
  }

  /*componentDidUpdate() {
    this.props.fetchScannedTicket();
  }*/

  render () {
    return (
      <ManagerScannerView {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  scannedTickets: state.scan.scannedTickets,
  scannedTicket: state.scan.scannedTicket,
  isLightMode: state.dashboard.isLightMode,
  isLoading: state.scan.isLoading,
  showScanModal: state.scan.showScanModal,
  code: state.scan.code,
});

export default connect(mapStateToProps, actions)(ManagerScanner);

