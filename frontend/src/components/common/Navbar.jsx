import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <div className="md:hidden font-bold text-xl text-brand-600">EduShield<span className="text-brand-400">AI</span></div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
          <div className="text-xs text-gray-500">{currentUser?.email}</div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
