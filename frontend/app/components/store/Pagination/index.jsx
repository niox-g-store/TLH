import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import './style.css';
import { ScrollTop } from '../../../pages/ScrollTop';

const Pagination = ({
  items = [],
  itemsPerPage = 4,
  renderItem,
  scrollToTopHeight = 0,
}) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Track current page

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    const newOffset = (selectedPage * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setCurrentPage(selectedPage); // update current page state
    ScrollTop(scrollToTopHeight);
  };

  return (
    <div className="pagination-wrapper">
      {/* Current page indicator */}
      <div className="pagination-current-wrapper">
        <span className="pagination-current-page">
          Page {currentPage + 1} of {pageCount}
        </span>
      </div>

      <div className="paginated-content">
        {currentItems.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< Prev"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
        forcePage={currentPage} // keep in sync
      />
    </div>
  );
};

export default Pagination;
