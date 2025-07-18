import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CBadge,
  CImage
} from '@coreui/react';
import { ROLES, API_URL } from '../../../../constants';
import Button from '../../../Common/HtmlTags/Button';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';
import { withRouter } from '../../../../withRouter';
import { connect } from 'react-redux';
import ResolveImage from '../../../store/ResolveImage';
import actions from '../../../../actions';
import { formatDate } from '../../../../utils/formatDate';
import { renderTicketBreakdown } from '../../../store/TicketSummary';
import { getCartPriceSummary } from '../../../store/CartSummary';
const OrderViewer = (props) => {
  const {
    order = {},
    user,
    isLightMode,
    orderIsLoading,
    setDeleteOrderVisibility,
    deleteOrderVisibility,
    deleteOrder,
    secondDiscount,
    setSecondDiscount,
    invoice,
    downloadInvoice
  } = props;

  const navigate = useNavigate();
  const { subTotal, total } = getCartPriceSummary(order?.cart?.tickets);
  const isAdmin = user?.role === ROLES.Admin;

  const firstImage =
    order?.cart?.tickets?.[0]?.eventId?.imageUrls?.[0] || '';
  const totalPrice = order?.cart?.tickets?.reduce((sum, ticket) => sum + ((ticket?.price * ticket.quantity) || 0), 0);

  useEffect(() => {
    let secDiscount = 0;
    const ticketWithCoupon = order?.cart?.tickets?.find((t) => t.coupon);

    if (ticketWithCoupon) {
      const { couponPercentage, couponAmount, price } = ticketWithCoupon;
      secDiscount = couponPercentage > 0
        ? (price * couponPercentage) / 100
        : couponAmount;

      setSecondDiscount(secDiscount);
    }
  }, [order?.cart?.tickets]);

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      {orderIsLoading && <LoadingIndicator />}
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>Order</h2>
        <GoBack navigate={navigate} text='go back' />
      </div>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} style={{ margin: '.5em' }} />

      <div className='order-view-container'>
        <CRow className='first-order-view'>
          <CCol>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
              <CImage
                src={ResolveImage(API_URL + firstImage)}
                alt='Event'
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <CCardBody>
                <CCardTitle className='d-flex' style={{ justifyContent: 'space-between' }}>
                  <p className='mb-0'><strong>Id:</strong> {order?._id || 'N/A'}</p>
                  <CBadge color={order?.status === 'true' ? 'success' : 'danger'} className='mb-2'>
                    {(order?.status === 'true' ? 'success' : 'failed') || ''}
                  </CBadge>
                </CCardTitle>

                <CRow>
                  <CCol>
                    <strong>Email:</strong> {order?.billingEmail || 'N/A'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <strong>Name:</strong> {order?.guest?.name || order?.user?.name}
                  </CCol>
                </CRow>

                <CRow className='mb-2'>
                  <CCol><strong>Payment Method:</strong> {order?.paymentMethod || 'N/A'}</CCol>
                  <CCol className='text-end'>
                    <strong>Date:</strong> {order?.createdAt ? formatDate(order.createdAt) : 'N/A'}
                  </CCol>
                </CRow>
                  <div className='mt-2'>
                    <CRow>
                      <CCol><strong>SubTotal:</strong></CCol>
                      <CCol className='text-end'>
                        ₦{subTotal}
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol><strong>Total:</strong></CCol>
                      <CCol className='text-end fw-bold text-success'>
                        ₦{total}
                      </CCol>
                    </CRow>
                  </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow className='second-order-view'>
          <CCol>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
              <CCardBody>
                <h2>Cart Details</h2>
                {order?.cart?.tickets?.length > 0
                  ? order.cart.tickets.map((ticket, index) => {
                    const quantity = ticket?.quantity || 0;
                    const ticketId = ticket.ticketId;

                    return (
                      <div key={index} className='mb-3 border-bottom pb-2'>
                        <p><strong>Event:</strong> {ticket?.eventId?.name || 'N/A'}</p>
                        <p><strong>Ticket Type:</strong> {ticket?.ticketType || 'N/A'}</p>
                        <p><strong>Quantity:</strong> x {quantity}</p>
                          {renderTicketBreakdown(ticket, isLightMode)}
                        {invoice
                          .filter((inv) => inv.ticketId === ticketId)
                          .map((inv, idx) => (
                            <Button
                              key={inv.code || idx}
                              text={`Download (${idx + 1})`}
                              onClick={() => downloadInvoice(inv, order._id)}
                              style={{ padding: '10px 15px', margin: '1em 0em 0.5em 0em' }}
                            />
                          ))}
                      </div>
                    );
                  })
                  : <p>No tickets in cart.</p>}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

class ViewOrder extends React.PureComponent {
  componentDidMount() {
    const orderId = this.props.match.params.id;
    this.props.fetchOrder(orderId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const orderId = this.props.match.params.id;
      this.props.fetchOrder(orderId);
    }
  }

  render() {
    return (
      <OrderViewer {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  user: state.account.user,
  order: state.order.order,
  isLightMode: state.dashboard.isLightMode,
  orderIsLoading: state.order.isLoading,
  deleteOrderVisibility: state.order.deleteOrderVisibility,
  secondDiscount: state.order.secondDiscount,
  invoice: state.order.invoice
});

export default connect(mapStateToProps, actions)(withRouter(ViewOrder));
