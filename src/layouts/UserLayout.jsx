import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';

const UserLayout = () => {
  const { logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-background flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-brand-surface border-b border-brand-surface-light flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <Shield className="text-brand-primary" size={24} />
          <span className="text-xl font-bold text-white tracking-wider">Guard<span className="text-brand-primary">X</span></span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/user/dashboard" className="flex items-center gap-2 text-brand-text-muted hover:text-white transition-colors">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          
          <div className="h-6 w-px bg-brand-surface-light"></div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={18} className="text-brand-primary" />
              <span className="text-sm">{user?.name || 'User'}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-danger transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden text-brand-text-muted hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-surface border-b border-brand-surface-light px-4 py-4 space-y-4 shadow-lg absolute top-16 left-0 right-0 z-20">
          <Link 
            to="/user/dashboard" 
            className="flex items-center gap-2 text-brand-text-muted hover:text-white transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <div className="h-px w-full bg-brand-surface-light"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <User size={18} className="text-brand-primary" />
              <span className="text-sm">{user?.name || 'User'}</span>
            </div>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-danger transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
