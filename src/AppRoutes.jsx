// AppRoutes.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import CupPage from './pages/Cup/CupPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import PaymentPage from './pages/Payment/PaymentPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Auth/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Loading from './components/Loading/Loading';
import OrderStatus from './pages/OrderStatus/OrderStatus';
import ProtectedRoute from './components/Protected/ProtectedRoute'; // Import the ProtectedRoute component

export default function AppRoutes({ setUser, setIsAdmin }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  // Check if user is an admin
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    // Check for specific route transitions to show loading animation
    if (
      (location.pathname === '/' && location.state?.from === '/login') ||  // Login → Home
      (location.pathname === '/' && location.state?.from === '/register') ||  // Register → Home
      (location.pathname === '/payment' && location.state?.from === '/checkout') // Checkout → Payment
    ) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1500); // Show loading for 1.5 seconds
      return () => clearTimeout(timer);
    }
    setLoading(false);
  }, [location]);

  return (
    <>
      {loading && <Loading />} {/* Show loading spinner when loading is true */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/search/:searchTerm" element={<HomePage />} />
        <Route path="/tag/:tag" element={<HomePage />} />
        <Route path="/cup/:id" element={<CupPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-status/:orderId" element={<OrderStatus />} />
        <Route path="/order" element={<OrderStatus />} />

        {/* Protected Route for Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
