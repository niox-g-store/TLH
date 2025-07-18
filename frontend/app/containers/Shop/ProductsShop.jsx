import React, { useState } from 'react';
import Card from '../../components/store/Card';
import Pagination from '../../components/store/Pagination';
import Input from '../../components/Common/HtmlTags/Input';
import LoadingIndicator from '../../components/store/LoadingIndicator';

const ProductsShop = ({ products = [], isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (name, value) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="products-shop">
      <div className="container">
        <div className="products-header">
          <h2 className="head1">Our Products</h2>
          
          <Input 
            placeholder="Search products by name"
            type="search"
            value={searchTerm}
            onInputChange={handleSearch}
          />
        </div>

        <div className="products-list-wrapper">
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              <Pagination
                items={filteredProducts}
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
              <h2 style={{ textAlign: 'center', padding: '2em 0' }}>
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