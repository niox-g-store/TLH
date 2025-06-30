import React, { useState } from 'react'
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
} from '@coreui/react'

const AttendeesTable = (props) => {
  const { data, isLightMode } = props;

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <CCard className={`${isLightMode ? '' : 'bg-dark-mode'} mb-4`}>
      <CCardHeader className={`${isLightMode ? 'p-black' : 'p-white'}`} style={{ fontSize: '30px' }}>Attendees</CCardHeader>
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
            {currentData.map((attendee, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{attendee.name}</CTableDataCell>
                <CTableDataCell>{attendee.ticketType}</CTableDataCell>
                <CTableDataCell>{attendee.quantity}</CTableDataCell>
                <CTableDataCell>{attendee.isGuest ? 'Yes' : 'No'}</CTableDataCell>
                <CTableDataCell>
                  {attendee.checkedInCount}/{attendee.quantity}
                </CTableDataCell>
                <CTableDataCell>{attendee.purchasedDate}</CTableDataCell>
                <CTableDataCell>{attendee.email}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-end mt-3">
          <CPagination align="end">
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
  )
}

export default AttendeesTable
