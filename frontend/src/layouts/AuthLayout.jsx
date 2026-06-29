import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
