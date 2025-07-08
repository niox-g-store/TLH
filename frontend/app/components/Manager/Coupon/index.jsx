import React from 'react';
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
import Button from '../../Common/HtmlTags/Button';
import ResolveImage from '../../store/ResolveImage';
import { ROLES } from '../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import { withRouter } from '../../../withRouter';
import { connect } from 'react-redux';
import actions from '../../../actions';
import ManagerPagination from '../Pagination';

const ManagerCouponHelper = (props) => {
  const { user, isLightMode, coupons = [] } = props;
  const navigate = useNavigate();
  const [visibleCodes, setVisibleCodes] = useState({});

  const toggleCodeVisibility = (idx) => {
    setVisibleCodes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const mostUsedCoupon = coupons.length > 0 
    ? coupons.reduce((prev, curr) => curr.usedCount > prev.usedCount ? curr : prev)
    : { code: 'N/A', usedCount: 0 };
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
        <Button onClick={() => navigate('/dashboard/coupons/add')} type={"third-btn"} text={"Create Coupon +"} />
      </div>
      {
        user.role === ROLES.Admin && 
        <Button onClick={() => navigate("/dashboard/coupons/my-coupons")} cls={`${isLightMode ? 'bg-white p-black': 'bg-black p-white'} align-self-end`} type={"third-btn"} text={"My Coupons"}/>
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
            <Link to={`/dashboard/coupons/edit/${coupon._id}`}>
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
                <CImage
                  src={ResolveImage(coupon.image, 'coupon')}
                  alt={coupon.event?.name || 'Coupon'}
                  style={{ width: '40%', objectFit: 'cover' }}
                />
                <CCardBody>
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <CCardTitle><strong>Event: </strong>{coupon.event?.name || 'N/A'}</CCardTitle>
                    <CBadge color={coupon.active ? 'success' : 'danger'}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </CBadge>
                  </div>
                  <CButton
                    color='light'
                    size='sm'
                    className='mb-2'
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCodeVisibility(idx);
                    }}
                  >
                    {visibleCodes[idx] ? <FaEyeSlash /> : <FaEye />}
                  </CButton>
                  &nbsp;&nbsp;&nbsp;<span className='mb-2'>
                    <strong>Code:</strong> {visibleCodes[idx] ? coupon.code : '••••••••'}
                  </span>
                  <CCardText as={'div'} className="copon-card-text-container">
                    <div className='copon-card-text'>
                    <strong>Qty:</strong> {coupon.quantity}
                    </div>

                    <div className='copon-card-text'>
                    <strong>Used:</strong> {coupon.usedCount}
                    </div>

                    <div className='copon-card-text'>
                    <strong>Limit/User:</strong> {coupon.userLimit}
                    </div>

                    <div className='copon-card-text'>
                    <strong>Discount:</strong> {coupon.percentage}% Off
                    </div>

                    <div className='copon-card-text'>
                    <strong>Ticket Types:</strong> {coupon.ticket?.length > 0 ? coupon.ticket.map(t => t.type).join(', ') : 'N/A'}
                    </div>
                  </CCardText>
                </CCardBody>
              </CCard>
            </Link>
          </CCol>
        ))}
      </CRow>

      {totalPages > 1 && (
        <ManagerPagination
          isLightMode={isLightMode}
          data={coupons}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      )}
    </div>
  );
};

class ManagerCoupon extends React.PureComponent {
  componentDidMount() {
    this.props.fetchCoupons();
  }

  render() {
    return (
      <ManagerCouponHelper {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  coupons: state.coupon.coupons,
  couponIsLoading: state.coupon.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(ManagerCoupon));