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
import resolveImage from '../../../store/ResolveImage';
import actions from '../../../../actions';
import { formatDate } from '../../../../utils/formatDate';
import TopSlideConfirmModal from '../../../store/ConfirmModal';
import { getCartPriceSummary } from '../../../store/CartSummary';
import { renderTicketBreakdown } from '../../../store/TicketSummary';
import Switch from '../../../store/Switch';

const OrderViewer = (props) => {
  const { order = {}, user,
          isLightMode, orderIsLoading,
          setDeleteOrderVisibility, deleteOrderVisibility,
          deleteOrder, secondDiscount, setSecondDiscount,
          invoice, downloadInvoice, updateOrderProductStatus
        } = props;
  const navigate = useNavigate();
  const { subTotal, total, deliveryFee } = getCartPriceSummary(order?.cart?.tickets, order?.cart?.products);
  const hasProducts = order?.products?.length > 0

  const isAdmin = user?.role === ROLES.Admin;
  const isOrganizer = user?.role === ROLES.Organizer;
  const isMember = user?.role === ROLES.Member;

  const firstImage =
    order?.cart?.tickets?.[0]?.eventId?.imageUrls?.[0] || order?.products?.[0]?.imageUrls?.[0] || '';
  const totalPrice = order?.cart?.tickets?.reduce((sum, ticket) => sum + ((ticket?.price * ticket.quantity) || 0), 0);

  const handleProductStatusChange = (status) => {
    updateOrderProductStatus(order._id, status);
  };

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
                src={resolveImage(API_URL + firstImage)}
                alt='Event'
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <CCardBody>
                <h3>{order?.guest ? 'Guest' : 'User'}</h3>
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

                {hasProducts && order?.productStatus && (
                  <CRow className='mb-2'>
                    <CCol><strong>Product Status:</strong></CCol>
                    <CCol className='text-end'>
                      <span style={{ 
                        color: order.productStatus === 'delivered' ? '#28a745' : 
                              order.productStatus === 'shipped' ? '#ffc107' : '#6c757d',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {order.productStatus}
                      </span>
                    </CCol>
                  </CRow>
                )}

                    <div className='mt-2'>
                      <CRow>
                        <CCol><strong>SubTotal:</strong></CCol>
                        <CCol className='text-end'>
                        ₦{subTotal}
                      </CCol>
                      </CRow>

                      {deliveryFee > 0 &&
                        <CRow>
                          <CCol><strong>Delivery fee: </strong></CCol>
                          <CCol className='text-end'>
                            ₦{deliveryFee.toLocaleString()}
                          </CCol>
                        </CRow>
                      }
                      <CRow>
                        <CCol><strong>Total:</strong></CCol>
                        <CCol className='text-end fw-bold text-success'>
                        ₦{total}
                      </CCol>
                      </CRow>
                    </div>
                <hr />

                {isAdmin && (
                  <>
                    <CRow>
                      <CCol><strong>Paystack Ref:</strong></CCol>
                      <CCol className='text-end'>{order?.payStackReference || 'N/A'}</CCol>
                    </CRow>
                    <CRow>
                      <CCol><strong>Paystack Fees:</strong></CCol>
                      <CCol className='text-end'>
                        ₦{order?.paymentFees ? order.paymentFees.toLocaleString() : '0'}
                      </CCol>
                    </CRow>
                  </>
                )}

              </CCardBody>
            </CCard>

            {/* Admin Product Status Controls */}
            {isAdmin && hasProducts && (
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} mt-3`}>
                <CCardBody>
                  <h3>Product Order Status</h3>
                  <div className="d-flex flex-column gap-3">
                    <Switch
                      id="processing-status"
                      name="processing"
                      label="Processing"
                      checked={order?.productStatus === 'processing'}
                      disabled={order?.productStatus && order?.productStatus === 'processing'}
                      toggleCheckboxChange={() => handleProductStatusChange('processing')}
                    />
                    <Switch
                      id="shipped-status"
                      name="shipped"
                      label="Shipped"
                      checked={order?.productStatus === 'shipped'}
                      disabled={order?.productStatus && order?.productStatus === 'shipped'}
                      toggleCheckboxChange={() => handleProductStatusChange('shipped')}
                    />
                    <Switch
                      id="delivered-status"
                      name="delivered"
                      label="Delivered"
                      checked={order?.productStatus === 'delivered'}
                      disabled={order?.productStatus && order?.productStatus === 'delivered'}
                      toggleCheckboxChange={() => handleProductStatusChange('delivered')}
                    />
                  </div>
                </CCardBody>
              </CCard>
            )}
          </CCol>
        </CRow>

        <CRow className='second-order-view'>
          <CCol>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
              <CCardBody>
                <h2>Ticket Details</h2>
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
                  : <p>No tickets in cart.</p>
                }

                { hasProducts &&
                  (
                    order.cart.products.map((product, index) => (
                      <div key={index} className='mb-3 border-bottom pb-2'>
                        <h2>Product Details</h2>
                        <p><strong>Product name: </strong>{product.productName || 'N/A'}</p>
                        <p><strong>Quantity: </strong> x {product.quantity || 'N/A'}</p>
                        {product.selectedSize && (
                          <p><strong>Size: </strong>{product.selectedSize}</p>
                        )}
                        {product.selectedColor && (
                          <p><strong>Color: </strong>{product.selectedColor}</p>
                        )}
                        <p><strong>Price: </strong>₦{(product.price).toLocaleString() || 'N/A'}</p>
                        {product.discount &&
                          <p><strong>Discount: </strong>₦{(product.discountPrice).toLocaleString() || 'N/A'}</p>
                        }
                        <p>📍 Delivery information</p>
                        {product.needsDelivery ?
                        <div style={{ border: '1px solid white', borderRadius: '10px', padding: '10px' }}>
                          <p>{product?.deliveryInfo?.name}</p>
                          <p>{product?.deliveryInfo?.email}</p>
                          <p>{product?.deliveryInfo?.phoneNumber}</p>
                          <p>{product?.deliveryInfo?.address?.street}</p>
                          <p>{product?.deliveryInfo?.address?.city}</p>
                          <p>{product?.deliveryInfo?.address?.state}</p>
                          <p>{product?.deliveryInfo?.address?.island ? 'Island Delivery' : 'Mainland Delivery'}</p>
                          <p>Delivery fee: ₦{product?.deliveryInfo?.address?.deliveryFee.toLocaleString()}</p>
                        </div>
                        :
                          'Pickup at Next Event'
                        }
                        <Button
                            text={`Download Product Inovice`}
                            onClick={() => downloadInvoice(false, order._id, true, product)}
                            style={{ padding: '10px 15px', margin: '1em 0em 0.5em 0em' }}
                          />
                      </div>
                    ))
                  )
                }
              </CCardBody>
            </CCard>
          </CCol>
                {isAdmin && (
                  <>
                    <CRow style={{ marginTop: '1em', justifyContent: 'center' }}>
                      <Button onClick={() => setDeleteOrderVisibility(true)} text={"Delete order"} cls="text-danger mt-2"/>
                    </CRow>
                    <TopSlideConfirmModal
                      visible={deleteOrderVisibility}
                      text={"Confirm to delete order"}
                      onConfirm={(v) => deleteOrder(v, navigate)}
                      onClose={() => setDeleteOrderVisibility(false)}
                      confirmValue={order._id}
                    />
                  </>
                )}
        </CRow>
      </div>
    </div>
  );
};

class ViewOrder extends React.PureComponent {
  componentDidMount () {
    const orderId = this.props.match.params.id;
    this.props.fetchOrder(orderId);
  }

  componentDidUpdate (prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const orderId = this.props.match.params.id;
      this.props.fetchOrder(orderId);
    }
  }

  render () {
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