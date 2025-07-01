import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CImage,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import { useState } from 'react';
import ResolveImage from '../../store/ResolveImage';
import { orders } from '../../Data/ordersData';
import ViewOrders from './View';

const OrderList = (props) => {
  const { isLightMode } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
        <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black': 'p-white'}`}>Orders</h2>
        <ViewOrders />
        </div>
        <hr className={`${isLightMode ? 'p-black': 'p-white'}`} style={{ margin: '.5em' }}></hr>
        <h2 className={`${isLightMode ? 'p-black': 'p-white'} font-size-20`}>50 Orders</h2>


      <CRow className='gy-4 w-100'>
        {currentOrders.map((order, idx) => (
          <CCol md={6} key={idx}>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
              <div style={{ width: '40%' }}>
                <CImage
                  src={ResolveImage(order.image || '')}
                  alt='Order Event'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <CCardBody>
                <CCardTitle className='mb-2'>
                  <strong>Billing:</strong> {order.billingEmail || 'N/A'}
                </CCardTitle>
                <CBadge color={order.paymentStatus === 'paid' ? 'success' : 'danger'} className='mb-2'>
                  {order.paymentStatus}
                </CBadge>
                <CRow className='mb-2'>
                  <CCol>
                    <strong>Method:</strong> {order.paymentMethod || 'N/A'}
                  </CCol>
                  <CCol className='text-end'>
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </CCol>
                </CRow>

                {order.discountAmount > 0 ? (
                  <div className='mt-2'>
                    <CRow>
                      <CCol><strong>Original:</strong></CCol>
                      <CCol className='text-end'>₦{order.amountBeforeDiscount}</CCol>
                    </CRow>
                    <CRow>
                      <CCol><strong>Discount:</strong></CCol>
                      <CCol className='text-end'>-₦{order.discountAmount}</CCol>
                    </CRow>
                    <CRow>
                      <CCol><strong>Final:</strong></CCol>
                      <CCol className='text-end fw-bold text-success'>₦{order.finalAmount}</CCol>
                    </CRow>
                  </div>
                ) : (
                  <div className='mt-2'>
                    <CRow>
                      <CCol><strong>Final Amount:</strong></CCol>
                      <CCol className='text-end fw-bold'>₦{order.finalAmount}</CCol>
                    </CRow>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <div className='mt-4'>
      <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
        <span className={`${isLightMode ? 'p-black': 'p-white'} fw-bold`}>
          Page {currentPage} of {totalPages} — Viewing {startIndex + 1}-{
            endIndex > orders.length ? orders.length : endIndex
          } of {orders.length} entries
        </span>
      </div>
  <CPagination align='center'>
    {[...Array(totalPages)].map((_, index) => (
      <CPaginationItem
        key={index + 1}
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
    </div>
  );
};

export default OrderList;
