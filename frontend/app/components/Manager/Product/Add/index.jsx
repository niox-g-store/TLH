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
import AdvancedUpload from '../../../store/AdanceFileUpload';
import { connect } from 'react-redux';
import { withRouter } from '../../../../withRouter';
import actions from "../../../../actions";

const AddProductForm = (props) => {
  const {
    productFormData,
    formErrors,
    productChange,
    addProduct,
    isLoading,
    isLightMode
  } = props;

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    addProduct(navigate);
  };

  return (
    <div className='add-product d-flex flex-column mb-custom-5em'>
      {isLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Create Product</h2>
        <GoBack navigate={navigate} />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Product Name */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={formErrors.name}
              label='Product Name'
              name='name'
              placeholder='Enter product name'
              value={productFormData.name}
              onInputChange={productChange}
            />
          </Col>

          {/* SKU */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={formErrors.sku}
              label='SKU (Optional)'
              name='sku'
              placeholder='Enter product SKU'
              value={productFormData.sku}
              onInputChange={productChange}
            />
          </Col>

          {/* Price */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={formErrors.price}
              label='Price'
              name='price'
              placeholder='Enter product price'
              value={productFormData.price}
              onInputChange={productChange}
            />
          </Col>

          {/* Discount Price */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={formErrors.discountPrice}
              label='Discount Percentage (Optional)'
              name='discountPrice'
              placeholder='Enter discount percentage (0-100)'
              value={productFormData.discountPrice}
              onInputChange={productChange}
            />
          </Col>

          {/* Quantity */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={formErrors.quantity}
              label='Quantity'
              name='quantity'
              placeholder='Enter product quantity'
              value={productFormData.quantity}
              onInputChange={productChange}
            />
          </Col>

          {/* Description */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <DescriptionBox
              error={formErrors.description}
              formData={productFormData}
              placeholder='Enter product description...'
              isLightMode={isLightMode}
              onChange={productChange}
            />
          </Col>

          {/* Image Upload */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <AdvancedUpload
              error={formErrors.image}
              onFilesChange={(files) => productChange('image', files)}
              limit={5}
              vLimit={0}
            />
          </Col>

          {/* Active Status Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-product'
              name='isActive'
              label='Is Active?'
              checked={productFormData.isActive}
              toggleCheckboxChange={(value) => productChange('isActive', value)}
            />
          </Col>
        </Row>

        <Row>
          <div className='add-product-actions mt-3'>
            <Button style={{ padding: '10px 20px' }} text='Save Product' />
          </div>
        </Row>
      </form>
    </div>
  );
};

class AddProduct extends React.PureComponent {
  render() {
    return <AddProductForm {...this.props} />;
  }
}

const mapStateToProps = state => ({
  productFormData: state.product.productFormData,
  formErrors: state.product.formErrors,
  isLoading: state.product.isLoading,
  isLightMode: state.dashboard.isLightMode
});

export default connect(mapStateToProps, actions)(withRouter(AddProduct));