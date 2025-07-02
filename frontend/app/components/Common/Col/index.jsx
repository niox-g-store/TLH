// Col.jsx
import React from 'react';
import './grid.css';

// Support props: xs, sm, md, lg, xl
const Col = ({ xs, sm, md, lg, xl, className = '', children, ...props }) => {
  let colClass = 'custom-col';

  if (xs) colClass += ` col-xs-${xs}`;
  if (sm) colClass += ` col-sm-${sm}`;
  if (md) colClass += ` col-md-${md}`;
  if (lg) colClass += ` col-lg-${lg}`;
  if (xl) colClass += ` col-xl-${xl}`;

  return (
    <div className={`${colClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Col;
