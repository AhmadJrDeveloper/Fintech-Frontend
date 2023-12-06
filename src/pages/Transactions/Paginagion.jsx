import React from 'react';
import { Pagination } from 'react-bootstrap';

const TransactionsPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination>
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default TransactionsPagination;
