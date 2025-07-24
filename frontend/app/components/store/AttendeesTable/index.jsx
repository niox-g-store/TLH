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

const AttendeesTable = ({ attendees = [], currentPage = 1, totalPages = 1, onPageChange, isLightMode }) => {
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <CCard className={`${isLightMode ? '' : 'bg-dark-mode'} mb-4`}>
      <CCardHeader className={`${isLightMode ? 'p-black' : 'p-white'}`} style={{ fontSize: '2em' }}>Attendees</CCardHeader>
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
        <div className="d-flex justify-content-center mt-3">
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
