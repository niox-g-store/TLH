// Row.jsx
import React from 'react';
import './grid.css';

const Row = ({ children, className = '', ...props }) => {
  return (
    <div className={`custom-row ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Row;
