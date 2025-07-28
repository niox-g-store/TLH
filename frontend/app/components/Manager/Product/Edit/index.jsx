import React from 'react';
import { useNavigate } from 'react-router-dom';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import LoadingIndicator from '../../../store/LoadingIndicator';
import DescriptionBox from '../../../store/DescriptionBox';
import { GoBack } from '../../../../containers/goBack/inedx';
import { withRouter } from '../../../../withRouter';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import AdvancedUpload from '../../../store/AdanceFileUpload';
import { API_URL } from '../../../../constants';
import AdvancedUploadHelper from '../../../store/AdanceFileUpload/updateFileUpload';
import SizeChartManager from '../../../store/SizeChartManager';
import ColorImageManager from '../../../store/ColourImageManager';

const EditProductForm = (props) => {
  const {
    product,
    editFormErrors,
    productEditChange,
    updateProduct,
    isLoading,
    isLightMode,
    deleteProduct,
    productImageToRemove,
    productColorAndImageToRemove
  } = props;
  console.log(product)

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProduct(navigate);
  };

  const imageUrls = product.imageUrls?.map((url) => `${API_URL}${url}`) || [];

  return (
    <div className='edit-product d-flex flex-column mb-custom-5em'>
      {isLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Edit Product</h2>
        <GoBack navigate={navigate} />
      </div>

      <form noValidate>
        <Row>
          {/* Product Name */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={editFormErrors.name}
              label='Product Name'
              name='name'
              placeholder='Enter product name'
              value={product.name || ''}
              onInputChange={productEditChange}
            />
          </Col>

          {/* SKU */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={editFormErrors.sku}
              label='SKU'
              name='sku'
              placeholder='Enter product SKU'
              value={product.sku || ''}
              onInputChange={productEditChange}
            />
          </Col>

          {/* Price */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={editFormErrors.price}
              label='Price'
              name='price'
              placeholder='Enter product price'
              value={product.price || ''}
              onInputChange={productEditChange}
            />
          </Col>

          {/* Discount Price */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={editFormErrors.discountPrice}
              label='Discount Price'
              name='discountPrice'
              placeholder='Enter discount price'
              value={product.discountPrice || ''}
              onInputChange={productEditChange}
            />
          </Col>

          {/* Quantity */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={editFormErrors.quantity}
              label='Quantity'
              name='quantity'
              placeholder='Enter product quantity'
              value={product.quantity || ''}
              onInputChange={productEditChange}
            />
          </Col>

          {/* Description */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <DescriptionBox
              error={editFormErrors.description}
              formData={product}
              placeholder='Enter product description...'
              isLightMode={isLightMode}
              onChange={productEditChange}
            />
          </Col>

          {/* Image Upload */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <h5 style={{ paddingTop: '1em' }}>Upload new product images</h5>
            <AdvancedUpload
              error={editFormErrors.image}
              onFilesChange={(files) => productEditChange('image', files)}
              limit={5}
              vLimit={0}
              imageLimit={10 * 1024 * 1024}
            />
            
            <h5 style={{ paddingTop: '1em' }}>Current product images</h5>
            <AdvancedUploadHelper
              error={editFormErrors.image}
              initialUrls={imageUrls}
              onRemoveUrlChange={(url) => productImageToRemove(url)}
            />
          </Col>

          {/* Active Status Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-product'
              name='isActive'
              label='Is Active?'
              checked={product.isActive || false}
              toggleCheckboxChange={(value) => productEditChange('isActive', value)}
            />
          </Col>
        </Row>
      </form>

      <Row style={{ justifyContent: 'center' }}>
        <div style={{ gap: '2em' }} className='edit-product-actions mt-3 d-flex'>
          <Button onClick={handleSubmit} style={{ padding: '10px 20px' }} text='Update Product' />
          <Button
            onClick={() => deleteProduct(product._id, navigate)}
            style={{ padding: '10px 20px' }}
            text='Delete Product'
          />
        </div>
      </Row>
      
        {/* Size Chart Management */}
        <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
          <SizeChartManager
            sizeQuantity={product.SizeQuantity || []}
            onChange={(sizeQuantity) => productEditChange('SizeQuantity', sizeQuantity)}
            isLightMode={isLightMode}
          />
        </Col>

        <Row style={{ justifyContent: 'center' }}>
        <div style={{ gap: '2em' }} className='edit-product-actions mt-3 d-flex'>
          <Button onClick={handleSubmit} style={{ padding: '10px 20px' }} text='Update Product' />
        </div>
      </Row>

        {/* Color and Image Management */}
        <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
          <ColorImageManager
            colorAndImage={product.colorAndImage || []}
            onChange={(colorAndImage) => productEditChange('colorAndImage', colorAndImage)}
            isLightMode={isLightMode}
            productColorAndImageToRemove={productColorAndImageToRemove}
          />
        </Col>

        <Row style={{ justifyContent: 'center' }}>
        <div style={{ gap: '2em' }} className='edit-product-actions mt-3 d-flex'>
          <Button onClick={handleSubmit} style={{ padding: '10px 20px' }} text='Update Product' />
        </div>
      </Row>

    </div>
  );
};

class EditProduct extends React.PureComponent {
  componentDidMount() {
    this.props.resetProduct();
    const productId = this.props.match.params.id;
    this.props.fetchProduct(productId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetProduct();
      const productId = this.props.match.params.id;
      this.props.fetchProduct(productId);
    }
  }

  render() {
    return <EditProductForm {...this.props} />;
  }
}

const mapStateToProps = state => ({
  product: state.product.product,
  editFormErrors: state.product.editFormErrors,
  isLoading: state.product.isLoading,
  isLightMode: state.dashboard.isLightMode
});

export default connect(mapStateToProps, actions)(withRouter(EditProduct));