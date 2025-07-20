import React, { useState } from 'react';
import { withRouter } from '../../withRouter';
import { connect } from 'react-redux';
import actions from '../../actions';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import Page404 from '../Page404';
import resolveImage from '../../components/store/ResolveImage';
import { API_URL } from '../../constants';
import Button from '../../components/Common/HtmlTags/Button';
import Switch from '../../components/store/Switch';
import Input from '../../components/Common/HtmlTags/Input';
import FadeSlider from '../../components/store/FadeSliderTwo';
import Cart from '../Cart';

const ProductViewer = (props) => {
  const {
    product = {},
    isLoading,
    productSlugChange,
    addProductToCart,
    selectedProducts,
    authenticated,
    user,
    deliveryInfo,
    setDeliveryInfo,
    needsDelivery,
    setNeedsDelivery
  } = props;
  
  const [quantity, setQuantity] = useState(1);
  /*const [deliveryInfo, setDeliveryInfo] = useState({
    name: authenticated ? name : '',
    email: authenticated ? user.email : '',
    phoneNumber: phoneNumber,
    address: {
      street: '',
      city: '',
      state: 'Lagos',
      island: false,
      mainland: false,
      deliveryFee: 0
    }
  })*/;
  console.log(deliveryInfo)

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (productSlugChange) {
    return (
      <Page404 text="Oops, the product you're looking for has changed or does not exist" />
    );
  }

  const isProductSelected = Object.keys(product).length > 0;

  if (!isProductSelected) {
    return <Page404 text="Product not found" />;
  }

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const getDiscountedPrice = (price, discountPercentage) => {
    return price - (price * (discountPercentage / 100));
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

const handleDeliveryInfoChange = (name, value) => {
  const updatedInfo = JSON.parse(JSON.stringify(deliveryInfo));

  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    if (!updatedInfo[parent]) updatedInfo[parent] = {};
    updatedInfo[parent][child] = value;

    if (child === 'island' || child === 'mainland') {
      updatedInfo[parent]['deliveryFee'] = child === 'island' ? 8500 : 5000;
    }
  } else {
    updatedInfo[name] = value;
  }

  setDeliveryInfo(updatedInfo);
};


  const handleAddToCart = () => {
    const finalPrice = product.discountPrice > 0 
      ? getDiscountedPrice(product.price, product.discountPrice)
      : product.price;

    const cartItem = {
      productId: product._id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      finalPrice,
      discount: product.discountPrice > 0,
      discountPrice: product.discountPrice > 0 ? getDiscountedPrice(product.price, product.discountPrice) : 0,
      discountPercentage: product.discountPrice,
      quantity,
      productQuantity: product.quantity,
      needsDelivery,
      deliveryInfo: needsDelivery ? deliveryInfo : null,
      type: 'product'
    };

    addProductToCart(cartItem);
  };

  const isFormValid = () => {
    if (!needsDelivery) return true;
    
    return deliveryInfo.name.trim() !== '' &&
           deliveryInfo.email.trim() !== '' &&
           deliveryInfo.phoneNumber.trim() !== '' &&
           deliveryInfo.address.street.trim() !== '' &&
           deliveryInfo.address.city.trim() !== '' &&
           deliveryInfo.address.state.trim() !== '' &&
           (deliveryInfo.address.island !== false ||
            deliveryInfo.address.mainland !== false
           );
  };

  return (
    <div className="product-view bg-white">
      <div className="container">
        <div className="product-details">
          <div className="product-image-section">
          <FadeSlider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2000}
            arrows={false}
            fade={product?.imageUrls?.length > 1 ? false : true}
          >
            {product?.imageUrls?.map((item, index) => {
              return (
                <img 
                  key={index}
                  src={resolveImage(`${API_URL}${item}` || '')}
                  alt={product.name}
                  className="product-main-image"
                />
              )
            })}
          </FadeSlider>
          </div>
          
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-pricing">
              {product.discountPrice > 0 ? (
                <div className="price-with-discount">
                  <span className="original-price">
                    {formatPrice(product.price)}
                  </span>
                  <span className="discounted-price">
                    {formatPrice(getDiscountedPrice(product.price, product.discountPrice))}
                  </span>
                  <span className="discount-badge">
                    {product.discountPrice}% OFF
                  </span>
                </div>
              ) : (
                <span className="regular-price">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <div 
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
            </div>

            <div className="product-seller-info">
              <div className="seller-badge">
                <h4>Sold by The Link Hangouts</h4>
                <p>This product is sold directly by The Link Hangouts. No organizers are affiliated with product sales.</p>
              </div>
            </div>

            <div className="product-details-info">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>Availability:</strong> {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}</p>
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || selectedProducts.includes(product._id)}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity || selectedProducts.includes(product._id)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="delivery-options">
              <Switch
                id="delivery-toggle"
                name="needsDelivery"
                label="I want this product delivered to me"
                checked={needsDelivery}
                toggleCheckboxChange={(value) => setNeedsDelivery(value)}
              />
              
              {!needsDelivery && (
                <div className="pickup-info">
                  <p className="pickup-notice">
                    📍 <strong>Pickup at Next Event:</strong> You can collect this product at the next Link Hangouts event.
                  </p>
                </div>
              )}
            </div>

            {needsDelivery && (
              <div className="delivery-form">
                <h4>Delivery Information</h4>
                <h4 className='info-text'>📍 Lagos Delivery only!!</h4>
                
                <div className="form-row">
                  <Input
                    type="text"
                    label="* Full Name"
                    name="name"
                    placeholder="Enter your full name"
                    value={deliveryInfo.name}
                    onInputChange={handleDeliveryInfoChange}
                  />
                </div>

                <div className="form-row">
                  <Input
                    type="email"
                    label="* Email Address"
                    name="email"
                    placeholder="Enter your email"
                    value={deliveryInfo.email}
                    onInputChange={handleDeliveryInfoChange}
                  />
                </div>

                <div className="form-row">
                  <Input
                    type="tel"
                    label="* Phone Number"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={deliveryInfo.phoneNumber}
                    onInputChange={handleDeliveryInfoChange}
                  />
                </div>

                <div className="form-row">
                  <Input
                    type="text"
                    label="* Street Address"
                    name="address.street"
                    placeholder="Enter your street address"
                    value={deliveryInfo.address.street}
                    onInputChange={handleDeliveryInfoChange}
                  />
                </div>

                <div className="form-row-group">
                  <Input
                    type="text"
                    label="* City"
                    name="address.city"
                    placeholder="Enter your city"
                    value={deliveryInfo.address.city}
                    onInputChange={handleDeliveryInfoChange}
                  />

                  <Input
                    type="text"
                    label="State"
                    name="address.state"
                    disabled={true}
                    placeholder="Enter your state"
                    value={deliveryInfo.address.state}
                    onInputChange={handleDeliveryInfoChange}
                  />
                </div>
                  <p className='p-purple mb-0'>Select your delivery location in lagos</p>
                  <p className='p-purple'>Delivery prices are fixed </p>
                  <Input
                    type="checkbox"
                    label="Mainland (₦5,000)"
                    name="address.mainland"
                    disabled={deliveryInfo.address.island}
                    value={deliveryInfo.address.mainland}
                    onInputChange={handleDeliveryInfoChange}
                  />
                  <br />
                  <Input
                    type="checkbox"
                    label="Island (₦8,500)"
                    name="address.island"
                    disabled={deliveryInfo.address.mainland}
                    value={deliveryInfo.address.island}
                    onInputChange={handleDeliveryInfoChange}
                  />
              </div>
            )}

            <div className="product-actions">
              {!selectedProducts.includes(product._id) ?
                <Button 
                  text={product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  disabled={product.quantity <= 0 || !isFormValid()}
                  onClick={handleAddToCart}
                  style={{ padding: '15px 30px', fontSize: '16px' }}
                />
                :
                <Button 
                  text={"Selected"}
                  disabled={true}
                  cls={'p-grey'}
                  style={{ padding: '15px 30px', fontSize: '16px' }}
              />
              }
            </div>
          </div>
        </div>
      </div>
      <Cart />
    </div>
  );
};

class ProductView extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    if (slug) {
      this.props.fetchStoreProduct(slug);
    }
  }

  componentWillUnmount() {
    this.props.vewingEventToggler(false);
    this.props.resetProductSlugChange()
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
      this.props.fetchStoreProduct(slug);
    }
  }

  render() {
    return <ProductViewer {...this.props} />;
  }
}

const mapStateToProps = state => ({
  authenticated: state.authentication.authenticated,
  user: state.account.user,
  product: state.product.storeProduct,
  isLoading: state.product.isLoading,
  productSlugChange: state.product.productSlugChange,
  selectedProducts: state.cart.selectedProducts,

  deliveryInfo: state.product.deliveryInfo,
  needsDelivery: state.product.needsDelivery
});

export default connect(mapStateToProps, actions)(withRouter(ProductView));