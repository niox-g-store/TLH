import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Authentication = ({ children }) => {
  const authenticated = useSelector((state) => state.authentication.authenticated);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Authentication;
