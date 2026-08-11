import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

import LoginPage from '../pages/auth/LoginPage';
import NotFoundPage from '../pages/shared/NotFoundPage';

import { ROLES } from '../constants/roles';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';

// Teacher
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherStudentProfile from '../pages/teacher/StudentProfile';

// Student
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfile from '../pages/student/StudentProfile';

// Placeholders
const UserManagement = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">User Management</h1>
    <p>Placeholder content</p>
  </div>
);

const DataManagement = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Data Management</h1>
    <p>Placeholder content</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>

      {/* Root */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />
        }
      >
        <Route element={<MainLayout />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<UserManagement />}
          />

          <Route
            path="/admin/data"
            element={<DataManagement />}
          />

        </Route>
      </Route>

      {/* Teacher Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]} />
        }
      >
        <Route element={<MainLayout />}>

          <Route
            path="/teacher"
            element={<TeacherDashboard />}
          />

          <Route
            path="/teacher/student/:id"
            element={<TeacherStudentProfile />}
          />

        </Route>
      </Route>

      {/* Student Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]} />
        }
      >
        <Route element={<MainLayout />}>

          <Route
            path="/student"
            element={<StudentDashboard />}
          />

          <Route
            path="/student/profile"
            element={<StudentProfile />}
          />

        </Route>
      </Route>

      {/* Catch All */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  );
}