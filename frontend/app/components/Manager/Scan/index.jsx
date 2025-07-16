import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  CCard, CCardBody, CCardTitle, CForm, CFormInput, CButton,
  CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell,
  CTableDataCell, CPagination, CPaginationItem, CBadge, CModal,
  CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import QRScanner from './QrScanner';
import { withRouter } from '../../../withRouter';
import actions from '../../../actions';
import LoadingIndicator from '../../store/LoadingIndicator';

const ManagerScannerView = (props) => {
  const { isLoading,
          isLightMode, scannedTicket = [],
          addScannedTicket, scannedTickets } = props;
  const [code, setCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const currentTickets = scannedTickets.slice(startIndex, startIndex + ticketsPerPage);
  const totalPages = Math.ceil(scannedTickets.length / ticketsPerPage);

  const handleScan = () => {
    if (code.trim()) {
      const ticket = {
        code,
        event: 'Unknown Event',
        ticketType: 'Unknown',
        owner: 'User',
        used: false,
        scannedAt: new Date().toLocaleString()
      };
      addScannedTicket(ticket);
      setCode('');
    }
  };

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

          <CButton style={{ width: 'fit-content', alignSelf: 'center' }} className='linear-grad p-white' onClick={() => setShowScanner(true)}>
            Scan QR Code
          </CButton>

          <CModal visible={showScanner} onClose={() => setShowScanner(false)} fullscreen>
            <CModalHeader>
              <CModalTitle>Scan Ticket</CModalTitle>
            </CModalHeader>
            <CModalBody className='d-flex justify-content-center align-items-center'>
              <QRScanner
                onScanSuccess={(code) => {
                  const ticket = {
                    code,
                    event: 'Scanned Event',
                    ticketType: 'QR',
                    owner: 'User',
                    used: false,
                    scannedAt: new Date().toLocaleString()
                  };
                  addScannedTicket(ticket);
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
                <CTableHeaderCell>Type</CTableHeaderCell>
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
              Showing {startIndex + 1}-{startIndex + currentTickets.length} of {scannedTicket.length}
            </div>
            <CPagination className='mb-0'>
              {[...Array(totalPages)].map((_, index) => (
                <CPaginationItem
                  isLightMode={isLightMode}
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
    </div>
  );
};
class ManagerScanner extends React.PureComponent {
  componentDidMount () {
    this.props.fetchEvents();
  }

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
  isLoading: state.scan.isLoading
});

export default connect(mapStateToProps, actions)(ManagerScanner);

