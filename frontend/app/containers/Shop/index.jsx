/**
 *
 * Shop
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import ProductsShop from './ProductsShop';
import HeroBanner from '../../components/store/HeroBanner/HeroBanner';

class Shop extends React.PureComponent {
  componentDidMount() {
    this.props.fetchProducts();
  }

  render() {
    const { products, isLoading } = this.props;

    return (
      <div className='shop'>
        <HeroBanner
          heading="Shop Our Products"
          desc="Discover amazing products from our collection"
          bannerImage={[]}
        />
        <ProductsShop products={products} isLoading={isLoading} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading
  };
};

export default connect(mapStateToProps, actions)(Shop);