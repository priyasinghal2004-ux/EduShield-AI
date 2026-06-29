import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import NotFoundPage from '../pages/shared/NotFoundPage';
import { ROLES } from '../constants/roles';

import AdminDashboard from '../pages/admin/AdminDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import StudentProfile from '../pages/teacher/StudentProfile';

// Placeholders for remaining pages
const UserManagement = () => <div className="p-6"><h1 className="text-2xl font-bold">User Management</h1><p>Placeholder content</p></div>;
const DataManagement = () => <div className="p-6"><h1 className="text-2xl font-bold">Data Management</h1><p>Placeholder content</p></div>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirection based on auth could be handled here or inside / */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/data" element={<DataManagement />} />
        </Route>
      </Route>

      {/* Teacher Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
        <Route element={<MainLayout />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/student/:id" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
