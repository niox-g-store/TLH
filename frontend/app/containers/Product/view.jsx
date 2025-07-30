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
import SocialShare from '../../components/store/SocialShare';
import { FaShippingFast } from "react-icons/fa";
import { GrLocationPin } from "react-icons/gr";
import { LiaBoxOpenSolid } from "react-icons/lia";
import { ScrollTop } from '../../pages/ScrollTop';

const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="size-selector" style={{ marginBottom: '1em' }}>
      <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 'bold' }}>
        Size Chart
      </label>
      <div style={{ display: 'flex', gap: '0.5em', flexWrap: 'wrap' }}>
        {sizes.map((sizeItem, index) => (
          <button
            key={index}
            onClick={() => onSizeChange(sizeItem.size)}
            disabled={sizeItem.quantity <= 0}
            style={{
              padding: '0.5em 1em',
              border: selectedSize === sizeItem.size ? '2px solid #9172EC' : '1px solid #ddd',
              backgroundColor: selectedSize === sizeItem.size ? '#9172EC' : 'white',
              color: selectedSize === sizeItem.size ? 'white' : 'black',
              borderRadius: '4px',
              cursor: sizeItem.quantity > 0 ? 'pointer' : 'not-allowed',
              opacity: sizeItem.quantity > 0 ? 1 : 0.5
            }}
          >
            {sizeItem.size}
          </button>
        ))}
      </div>
    </div>
  );
};

const ColorSelector = ({ colors, selectedColor, onColorChange }) => {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="color-selector" style={{ marginBottom: '1em' }}>
      <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 'bold' }}>
        Colors Available
      </label>
      <div style={{ display: 'flex', gap: '0.5em', flexWrap: 'wrap' }}>
        <button
          onClick={() => onColorChange(null)}
          style={{
            padding: '0.5em 1em',
            border: selectedColor === null ? '2px solid #9172EC' : '1px solid #ddd',
            backgroundColor: selectedColor === null ? '#9172EC' : 'white',
            color: selectedColor === null ? 'white' : 'black',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Default
        </button>
        {colors.map((colorItem, index) => (
          <button
            key={index}
            onClick={() => {
              onColorChange(colorItem.color);
              ScrollTop({ height: 0 })
            }}
            style={{
              padding: '0.5em 1em',
              border: selectedColor === colorItem.color ? '2px solid #9172EC' : '1px solid #ddd',
              backgroundColor: selectedColor === colorItem.color ? '#9172EC' : 'white',
              color: selectedColor === colorItem.color ? 'white' : 'black',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {colorItem.color}
          </button>
        ))}
      </div>
    </div>
  );
};
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
    setNeedsDelivery,

    islandDeliveryFee = 0,
    mainlandDeliveryFee = 0
  } = props;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedColor, setSelectedColor] = useState(null);

  // Get available sizes and colors
  const availableSizes = product.SizeQuantity || [];
  const availableColors = product.colorAndImage || [];

  // Get current size availability
  const currentSizeItem = availableSizes.find(s => s.size === selectedSize) ||
                          availableSizes.find(s => s.size === 'Medium') ||
                          availableSizes[0];
  
  const maxQuantityForSize = currentSizeItem ? currentSizeItem.quantity : product.quantity;

  // Get images to display based on selected color
  const getDisplayImages = () => {
    if (selectedColor) {
      const colorItem = availableColors.find(c => c.color === selectedColor);
      if (colorItem && colorItem.imageUrl && colorItem.imageUrl.length > 0) {
        return colorItem.imageUrl;
      }
    }
    return product.imageUrls || [];
  };
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
    return discountPercentage
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // Reset quantity if it exceeds the new size's availability
    const sizeItem = availableSizes.find(s => s.size === size);
    if (sizeItem && quantity > sizeItem.quantity) {
      setQuantity(Math.min(quantity, sizeItem.quantity));
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };
const handleDeliveryInfoChange = (name, value) => {
  const updatedInfo = JSON.parse(JSON.stringify(deliveryInfo));

  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    if (!updatedInfo[parent]) updatedInfo[parent] = {};
    updatedInfo[parent][child] = value;

    if (child === 'island' || child === 'mainland') {
      updatedInfo[parent]['deliveryFee'] = child === 'island' ?
        islandDeliveryFee : mainlandDeliveryFee;
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
      type: 'product',
      selectedSize: availableSizes.length > 0 ? selectedSize : null,
      selectedColor: selectedColor
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
            fade={getDisplayImages()?.length > 1 ? false : true}
          >
            {getDisplayImages()?.map((item, index) => {
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
                    {(((product.price - product.discountPrice) / product.price) * 100).toFixed(2)}% OFF
                  </span>
                </div>
              ) : (
                <span className="regular-price">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className='product-price-color-selector'>
              <h4 className='info-text'><FaShippingFast color='#9172EC' size={20}/>&nbsp; Shipping information</h4>
              <p className='mb-1'><GrLocationPin color='#9172EC' size={20}/>&nbsp; Lagos Delivery only!!</p>
              <p className='mb-1'><LiaBoxOpenSolid color='#9172EC' size={20}/>&nbsp; For orders with 3 items or fewer, expect delivery within 2–5 working days.</p>
              <p className='mb-1'><LiaBoxOpenSolid color='#9172EC' size={20}/>&nbsp; For orders with more than 3 items, delivery will take 5–7 working days.</p>
            </div>
            <>
            {/* Color Selector */}
            <ColorSelector
              colors={availableColors}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
            </>

            <>
            {/* Size Selector */}
            <SizeSelector
              sizes={availableSizes}
              selectedSize={selectedSize}
              onSizeChange={handleSizeChange}
            />
            </>

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
                  disabled={quantity >= maxQuantityForSize || selectedProducts.includes(product._id)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="product-details-info">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong></strong> {maxQuantityForSize > 0 ? `${maxQuantityForSize} in stock` : 'Out of stock'}</p>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <div 
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
            </div>
            <SocialShare item={product} />

            <div className="product-seller-info">
              <div className="seller-badge">
                <h4>Sold by The Link Hangouts</h4>
                <p className='mb-1'>* This product is sold directly by The Link Hangouts. No organizers are affiliated with product sales.</p>
                <p className='mb-1'>* Products marked for delivery will be shipped to your provided address</p>
                <p className='mb-1'>* Products for pickup will be available at our next event</p>
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
                    label={`Mainland (₦ ${mainlandDeliveryFee.toLocaleString()})`}
                    name="address.mainland"
                    disabled={deliveryInfo.address.island}
                    checked={deliveryInfo.address.mainland}
                    onInputChange={handleDeliveryInfoChange}
                  />
                  <br />
                  <Input
                    type="checkbox"
                    label={`Island (₦ ${islandDeliveryFee.toLocaleString()})`}
                    name="address.island"
                    disabled={deliveryInfo.address.mainland}
                    checked={deliveryInfo.address.island}
                    onInputChange={handleDeliveryInfoChange}
                  />
              </div>
            )}

            <div className="product-actions">
              {!selectedProducts.includes(product._id) ?
                <Button 
                  text={maxQuantityForSize > 0 ? "Add to Cart" : "Out of Stock"}
                  disabled={maxQuantityForSize <= 0 || !isFormValid()}
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
  needsDelivery: state.product.needsDelivery,
  mainlandDeliveryFee: state.setting.settings.mainlandDeliveryFee,
  islandDeliveryFee: state.setting.settings.islandDeliveryFee
});

export default connect(mapStateToProps, actions)(withRouter(ProductView));