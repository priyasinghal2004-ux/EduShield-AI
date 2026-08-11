import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect user to their own dashboard
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    if (currentUser.role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    }

    if (currentUser.role === 'student') {
      return <Navigate to="/student" replace />;
    }

    // Unknown role
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}