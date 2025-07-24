import React from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';

const AttendeesTable = (props) => {
  const { attendees = [], currentPage = 1, totalPages = 1, onPageChange, isLightMode, attendeesDownload } = props;
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <CCard className={`${isLightMode ? '' : 'bg-dark-mode'} mb-4`}>
      <CCardHeader className={`${isLightMode ? 'p-black' : 'p-white'} d-flex`}>
        <p style={{ fontSize: '2em' }}>Attendees</p>
      <div className="d-flex align-items-center gap-2" style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <button
          onClick={() => attendeesDownload('pdf')}
          className="d-flex items-center justify-center p-2 rounded-md shadow-sm"
          style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', color: 'black', borderRadius: '10px' }}
        >
          <FiDownload size={16} /><FiFileText size={16} className="mr-1" /> PDF
        </button>
        <button
          onClick={() => attendeesDownload('csv')}
          className="d-flex items-center justify-center p-2 rounded-md shadow-sm"
          style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', color: 'black', borderRadius: '10px' }}
        >
          <FiDownload size={16} /><FiFile size={16} className="mr-1" /> CSV
        </button>
      </div>
      </CCardHeader>
      <CCardBody>
        <CTable align="middle" hover responsive className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} p-white`}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Ticket Type</CTableHeaderCell>
              <CTableHeaderCell>Qty</CTableHeaderCell>
              <CTableHeaderCell>Guest?</CTableHeaderCell>
              <CTableHeaderCell>Checked In</CTableHeaderCell>
              <CTableHeaderCell>Purchased Date</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {attendees.map((attendee, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{attendee.name}</CTableDataCell>
                <CTableDataCell>{attendee.ticketType}</CTableDataCell>
                <CTableDataCell>{attendee.quantity}</CTableDataCell>
                <CTableDataCell>{attendee.isGuest ? 'Yes' : 'No'}</CTableDataCell>
                <CTableDataCell>{attendee.checkedInCount}/{attendee.quantity}</CTableDataCell>
                <CTableDataCell>{attendee.purchasedDate}</CTableDataCell>
                <CTableDataCell>{attendee.email}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-3 flex-wrap">
          <CPagination align="center">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </CPaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <CPaginationItem
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default AttendeesTable;
