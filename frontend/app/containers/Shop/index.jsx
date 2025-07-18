/**
 *
 * Shop
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import actions from '../../actions';
import { sortOptions } from '../../utils/store';

import ProductsShop from '../ProductsShop';

import Page404 from '../../components/Common/Page404';
import ProductFilter from '../../components/Store/ProductFilter';
import Pagination from '../../components/Common/Pagination';
import SelectOption from '../../components/Common/SelectOption';

class Shop extends React.PureComponent {
  componentDidMount() {
    document.body.classList.add('shop-page');
    this.props.minMaxPriceCalculator();
    this.props.resetAdvancedFilters();
  }

  componentWillUnmount() {
    document.body.classList.remove('shop-page');
    this.props.resetAdvancedFilters();
  }

  render() {
    const {
      products, advancedFilters,
      filterProducts, min,
      max, all_currency, selectCurrency
    } = this.props;
    const { totalPages, currentPage, count, limit, order } = advancedFilters;
    const displayPagination = totalPages > 1;
    const totalProducts = products.length;
    const left = limit * (currentPage - 1) + 1;
    const right = totalProducts + left - 1;

    const parseMinMax = (value) => {
      if (typeof value === 'number') return Math.round(value);
      if (typeof value === 'string') {
        const num = parseFloat(value.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : Math.round(num);
      }
      return 0;
    };
    const minLabel = parseMinMax(min);
    const maxLabel = parseMinMax(max);

    return (
      <div className='shop'>
        <div>
            {minLabel > 0 &&
            <ProductFilter
              filterProducts={filterProducts}
              min={min}
              max={max}
              minLabel={minLabel}
              maxLabel={maxLabel}
              all_currency={all_currency}
              selectCurrency={selectCurrency}
              />
            }
          <div>
                <span>Showing: </span>
                {totalProducts > 0
                  ? `${left}-${right} products of ${count} products`
                  : `${count} products`}
                <span>Sort by</span>
                <SelectOption
                  name={'sorting'}
                  value={{ value: order, label: sortOptions[order].label }}
                  options={sortOptions}
                  handleSelectChange={(n, v) => {
                    filterProducts('sorting', n.value);
                  }}
                />


            <Switch>
              <Route exact path='/shop' component={ProductsShop} />
              <Route path='*' component={Page404} />
            </Switch>

            {displayPagination && (
              <div className='pagination_container d-flex justify-content-center text-center mt-4'>
                <Pagination
                  totalPages={totalPages}
                  onPagination={filterProducts}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const sL = state.currency.select_currency.length;
  return {
    advancedFilters: state.product.advancedFilters,
    products: state.product.storeProducts,

    min: state.product.minPriceValue,
    max: state.product.maxPriceValue,
    all_currency: state.currency.all_currency,
    selectCurrency: sL > 0 ? state.currency.select_currency : state.currency.default_currency,
  };
};

export default connect(mapStateToProps, actions)(Shop);
