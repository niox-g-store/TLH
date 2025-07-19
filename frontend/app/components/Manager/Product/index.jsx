import React, { useState } from 'react';
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
  CPaginationItem
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import resolveImage from '../../store/ResolveImage';
import { API_URL } from '../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../Common/HtmlTags/Input';
import { withRouter } from '../../../withRouter';
import actions from '../../../actions';
import { connect } from 'react-redux';
import ManagerPagination from '../Pagination';

const ManagerProductHelper = (props) => {
  const { isLightMode, products = [] } = props;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const productsPerPage = 10;

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSearch = (name, value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const formatPrice = (price, discountPrice) => {
    if (discountPrice > 0) {
      const discountedPrice = price - (price * (discountPrice / 100));
      return (
        <div>
          <span style={{ textDecoration: 'line-through', color: 'red', marginRight: '8px' }}>
            ₦{price.toLocaleString()}
          </span>
          <span style={{ fontWeight: 'bold', color: 'green' }}>
            ₦{discountedPrice.toLocaleString()}
          </span>
          <span style={{ fontSize: '12px', color: 'orange', marginLeft: '8px' }}>
            ({discountPrice}% off)
          </span>
        </div>
      );
    }
    return <span>₦{price.toLocaleString()}</span>;
  };

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>Products</h2>
        <Button onClick={() => navigate('/dashboard/products/add')} type='third-btn' text='Create Product +' />
      </div>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search products by name..."
          name="searchProducts"
          value={searchTerm}
          onInputChange={handleSearch}
        />
      </div>

      {/* Product List */}
      {currentProducts.length > 0 ? (
        <CRow className="gy-4">
          {currentProducts.map((product, idx) => (
            <CCol md={6} key={idx}>
              <Link to={`/dashboard/products/edit/${product._id}`}>
                <CCard as={'div'} className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
                  <CImage
                    src={resolveImage(product.imageUrls && product.imageUrls[0] ? `${API_URL}${product.imageUrls[0]}` : '')}
                    alt={product.name}
                    style={{ width: '40%', objectFit: 'cover' }}
                  />
                  <CCardBody as={'div'}>
                    <CCardTitle className='mb-2'>{product.name}</CCardTitle>
                    <CBadge color={product.isActive ? 'success' : 'danger'} className='mb-2'>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </CBadge>
                    <CCardText as={'div'} className='mt-2'>
                      <strong>SKU:</strong> {product.sku}<br />
                      <strong>Price:</strong> {formatPrice(product.price, product.discountPrice)}<br />
                      <strong>Quantity:</strong> {product.quantity}<br />
                      <strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}
                    </CCardText>
                  </CCardBody>
                </CCard>
              </Link>
            </CCol>
          ))}
        </CRow>
      ) : (
        <div className={`text-center py-5 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <h3>No products found</h3>
        </div>
      )}

      <ManagerPagination
        isLightMode={isLightMode}
        data={filteredProducts}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

class ManagerProduct extends React.PureComponent {
  componentDidMount() {
    this.props.fetchAllProducts();
  }

  render() {
    return <ManagerProductHelper {...this.props} />;
  }
}

const mapStateToProps = state => ({
  products: state.product.products,
  isLoading: state.product.isLoading,
  isLightMode: state.dashboard.isLightMode
});

export default connect(mapStateToProps, actions)(withRouter(ManagerProduct));