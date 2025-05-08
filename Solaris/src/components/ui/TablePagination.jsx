import React from 'react';
import './TablePagination.css';

const TablePagination = ({
  totalItems,
  currentPage,
  pageSize,
  itemName = 'items',
  onPageChange,
  onPageSizeChange
}) => {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const startItem = totalItems > 0 ? currentPage * pageSize + 1 : 0;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);
  
  return (
    <div className="table-pagination">
      <div className="pagination-info">
        Showing <span className="highlight">{startItem}</span> to <span className="highlight">{endItem}</span> of <span className="highlight">{totalItems}</span> {itemName}
      </div>
      
      <div className="pagination-controls">
        <button
          className="pagination-button pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 0}
          aria-label="Previous page"
        >
          Previous
        </button>
        
        <span className="pagination-pages">
          Page <span className="highlight">{currentPage + 1}</span> of <span className="highlight">{totalPages}</span>
        </span>
        
        <button
          className="pagination-button pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          aria-label="Next page"
        >
          Next
        </button>
        
        <div className="pagination-size-wrapper">
          <select
            className="pagination-size-selector"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Items per page"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;