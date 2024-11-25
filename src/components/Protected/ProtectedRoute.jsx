import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    return <Navigate to="/" />; // Redirect to home if not an admin
  }

  return children; // Render children (e.g., AdminDashboard) if admin
};

export default ProtectedRoute;
