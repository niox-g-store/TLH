import React from 'react';
import { withRouter } from '../../withRouter';
import { connect } from 'react-redux';
import actions from '../../actions';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import Page404 from '../Page404';
import ResolveImage from '../../components/store/ResolveImage';
import { API_URL } from '../../constants';
import Button from '../../components/Common/HtmlTags/Button';

const ProductViewer = (props) => {
  const {
    product = {},
    isLoading,
    productSlugChange
  } = props;

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

  return (
    <div className="product-view bg-white">
      <div className="container">
        <div className="product-details">
          <div className="product-image-section">
            <img 
              src={ResolveImage(`${API_URL}${product.imageUrls?.[0]}` || '')}
              alt={product.name}
              className="product-main-image"
            />
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

            <div className="product-details-info">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>Availability:</strong> {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}</p>
            </div>

            <div className="product-actions">
              <Button 
                text={product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                disabled={product.quantity <= 0}
                style={{ padding: '15px 30px', fontSize: '16px' }}
              />
            </div>
          </div>
        </div>
      </div>
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
  product: state.product.storeProduct,
  isLoading: state.product.isLoading,
  productSlugChange: state.product.productSlugChange
});

export default connect(mapStateToProps, actions)(withRouter(ProductView));