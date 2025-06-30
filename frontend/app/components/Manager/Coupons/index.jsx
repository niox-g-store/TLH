import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CImage,
  CButton
} from '@coreui/react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AddCoupon from './Add';
import { coupons } from './couponData';
import ResolveImage from '../../store/ResolveImage';

const ManagerCoupon = ({ isLightMode }) => {
  const [visibleCodes, setVisibleCodes] = useState({});

  const toggleCodeVisibility = (idx) => {
    setVisibleCodes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const mostUsedCoupon = coupons.reduce((prev, curr) =>
    curr.usedCount > prev.usedCount ? curr : prev
  );
  const activeCount = coupons.filter(c => c.active).length;
  const inactiveCount = coupons.length - activeCount;

  return (
    <div className='container-lg px-4 d-flex flex-column align-items-end mb-custom-5em'>
      <AddCoupon />

      {/* Coupon Stats */}
      <CRow className="mb-4 g-2 w-100">
        <CCol sm={4}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Most Used Coupon</CCardTitle>
              <CCardText>{mostUsedCoupon.code} ({mostUsedCoupon.usedCount} used)</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Active Coupons</CCardTitle>
              <CCardText>{activeCount}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Inactive Coupons</CCardTitle>
              <CCardText>{inactiveCount}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Coupon List */}
      <CRow className="gy-4">
        {coupons.map((coupon, idx) => (
          <CCol md={6} key={idx}>
            <CCard className="flex-row overflow-hidden">
                <CImage
                  src={ResolveImage('coupon', coupon.image)}
                  alt={coupon.event}
                  style={{ width: '40%', objectFit: 'cover' }}
                />
              <CCardBody>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <CCardTitle><strong>Event: </strong>{coupon.event}</CCardTitle>
                  <CBadge color={coupon.active ? 'success' : 'danger'}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </CBadge>
                </div>
                <CButton
                  color='light'
                  size='sm'
                  className='mb-2'
                  onClick={() => toggleCodeVisibility(idx)}
                >
                  {visibleCodes[idx] ? <FaEyeSlash /> : <FaEye />}
                </CButton>
                <p className='mb-2'>
                  <strong>Code:</strong> {visibleCodes[idx] ? coupon.code : '••••••••'}
                </p>
                <CCardText>
                  <strong>Qty:</strong> {coupon.quantity}<br />
                  <strong>Used:</strong> {coupon.usedCount}<br />
                  <strong>Limit/User:</strong> {coupon.userLimit}<br />
                  <strong>Discount:</strong> {coupon.percentage}% Off<br />
                  <strong>Ticket Types:</strong> {coupon.ticketTypes.length > 0 ? coupon.ticketTypes.join(', ') : 'None'}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default ManagerCoupon;
