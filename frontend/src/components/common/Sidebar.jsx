import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Database, GraduationCap } from 'lucide-react';
import { ROLES } from '../../constants/roles';

export default function Sidebar() {
  const { currentUser } = useAuth();
  
  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/data', icon: Database, label: 'Data Management' },
  ];

  const teacherLinks = [
    { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/teacher/student/STU-001', icon: GraduationCap, label: 'Student Profile' }, // Just an example link for now
  ];

  const links = currentUser?.role === ROLES.ADMIN ? adminLinks : teacherLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-brand-600 tracking-tight">EduShield<span className="text-brand-400">AI</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin' || link.to === '/teacher'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Logged in as</div>
        <div className="mt-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</div>
            <div className="text-xs text-gray-500 capitalize">{currentUser?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
