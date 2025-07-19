import React, { useState } from 'react';
import Card from '../../../components/store/Card';
import Pagination from '../../../components/store/Pagination';
import Input from '../../../components/Common/HtmlTags/Input';
import LoadingIndicator from '../../../components/store/LoadingIndicator';
import SelectOption from '../../../components/store/SelectOption';

const ProductsShop = ({ products = [], isLoading, filterProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const sortOptions = [
    { value: 0, label: 'Newest First' },
    { value: 1, label: 'Price: High to Low' },
    { value: 2, label: 'Price: Low to High' }
  ];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getPrice = (product) => {
      return product.discountPrice > 0 
        ? product.price - (product.price * (product.discountPrice / 100))
        : product.price;
    };

    switch (sortOrder) {
      case 1: // Price: High to Low
        return getPrice(b) - getPrice(a);
      case 2: // Price: Low to High
        return getPrice(a) - getPrice(b);
      default: // Newest First
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const handleSearch = (name, value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (selectedOption) => {
    setSortOrder(selectedOption.value);
    if (filterProducts) {
      filterProducts('sorting', selectedOption.value);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="products-shop">
      <div className="container">
        <div className="products-header">
          <h2 className="head1 p-black">Our Products</h2>
          
          <div className="shop-filters">
            <div className="search-filter">
              <Input 
                placeholder="Search products by name"
                type="search"
                value={searchTerm}
                onInputChange={handleSearch}
              />
            </div>
            
            <div className="sort-filter">
              {sortedProducts.length > 0 &&
                <p className="product-count">
                  Showing 1–{Math.min(12, sortedProducts.length)} of {products.length} products
                </p>
              }
              <SelectOption
                placeholder="Select sorting option"
                value={sortOptions.find(option => option.value === sortOrder)}
                options={sortOptions}
                handleSelectChange={handleSortChange}
                multi={false}
              />
            </div>
          </div>
        </div>

        <div className="products-list-wrapper">
          {sortedProducts.length > 0 ? (
            <div className="products-grid">
              <Pagination
                items={sortedProducts}
                itemsPerPage={12}
                renderItem={(product, index) => (
                  <Card 
                    key={index} 
                    product={product} 
                    type="shop" 
                  />
                )}
              />
            </div>
          ) : (
            <div className="no-products">
              <h2 style={{ textAlign: 'center', padding: '2em 0', color: 'black' }}>
                {searchTerm ? 'No products found matching your search' : 'No products available'}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsShop;