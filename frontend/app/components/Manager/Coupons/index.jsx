import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CImage,
  CButton,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AddCoupon from './Add';
import { coupons } from '../../Data/couponData';
import ResolveImage from '../../store/ResolveImage';
import AdminCoupon from './AdminCoupon';
import { ROLES } from '../../../constants';

const ManagerCoupon = (props) => {
  const { user, isLightMode } = props;
  const [visibleCodes, setVisibleCodes] = useState({});

  const toggleCodeVisibility = (idx) => {
    setVisibleCodes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const mostUsedCoupon = coupons.reduce((prev, curr) =>
    curr.usedCount > prev.usedCount ? curr : prev
  );
  const activeCount = coupons.filter(c => c.active).length;
  const inactiveCount = coupons.length - activeCount;

  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 10;

  const totalPages = Math.ceil(coupons.length / couponsPerPage);
  const startIndex = (currentPage - 1) * couponsPerPage;
  const endIndex = startIndex + couponsPerPage;
  const currentCoupons = coupons.slice(startIndex, endIndex);

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black': 'p-white'}`}>Coupons</h2>
      <AddCoupon />
      </div>
      {
        user.role === ROLES.Admin && <AdminCoupon {...props}/>
      }
      <hr className={`${isLightMode ? 'p-black': 'p-white'}`}></hr>

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
        {currentCoupons.map((coupon, idx) => (
          <CCol md={6} key={idx}>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
                <CImage
                  src={ResolveImage(coupon.image, 'coupon')}
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

      <div className='mt-4'>
      <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
        <span className={`${isLightMode ? 'p-black': 'p-white'} fw-bold`}>
          Page {currentPage} of {totalPages} — Viewing {startIndex + 1}-{
            endIndex > coupons.length ? coupons.length : endIndex
          } of {coupons.length} entries
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

export default ManagerCoupon;
