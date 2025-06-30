import React from 'react'

const GetTicketPrice = ({ ticket }) => {
  const hasDiscount = ticket.discount && ticket.discountPrice

  return (
    <div className="d-flex flex-column">
      {hasDiscount ? (
        <>
          <span style={{ textDecoration: 'line-through', color: 'red', fontSize: '0.9em' }}>
            <strong>Price: </strong>
            ₦{ticket.price.toLocaleString()}
          </span>
          <span style={{ color: '#28a745' }}>
            <strong>Discount: </strong>
            ₦{ticket.discountPrice.toLocaleString()}
          </span>
        </>
      ) : (
        
        <span>
            <strong>Price: </strong>
          ₦{ticket.price.toLocaleString()}
        </span>
      )}
    </div>
  )
}

export default GetTicketPrice
