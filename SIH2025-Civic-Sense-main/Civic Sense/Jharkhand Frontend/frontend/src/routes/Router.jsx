import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ReportPage from '../pages/ReportPage';
import CustomerDashboard from '../pages/CustomerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminInsights from '../components/AdminInsights';
import { useAuth } from '../hooks/useAuth';

export default function Router() {
  const { user } = useAuth();
  
  // Helper function to check if user has admin role
  const isAdmin = () => {
    return user && (user.user?.role === 'admin' || user.role === 'admin');
  };

  // Helper function to check if user has staff or admin role
  const isStaffOrAdmin = () => {
    return user && (user.user?.role === 'staff' || user.user?.role === 'admin' || 
                   user.role === 'staff' || user.role === 'admin');
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/report" element={user ? <ReportPage /> : <Navigate to="/login" />} />
      <Route path="/dashboard/customer" element={user ? <CustomerDashboard /> : <Navigate to="/login" />} />
      <Route
        path="/dashboard/admin"
        element={isStaffOrAdmin() ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard/admin/insights"
        element={isAdmin() ? <AdminInsights /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<div className="text-center py-20">404 Not Found</div>} />
    </Routes>
  );
}