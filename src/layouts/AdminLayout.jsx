import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, AlertTriangle, Users, BarChart3, LogOut, Menu, X, Cpu } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ";
    const isActive = location.pathname === path;
    return baseClass + (isActive 
      ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30" 
      : "text-brand-text-muted hover:text-white hover:bg-brand-surface-light border border-transparent");
  };

  return (
    <div className="flex h-screen bg-brand-background overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-brand-surface border-r border-brand-surface-light flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <Shield className="text-brand-primary" size={32} />
            <span className="text-2xl font-bold font-heading text-white tracking-wider">Guard<span className="text-brand-primary">X</span></span>
          </div>
          <button 
            className="md:hidden text-brand-text-muted hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
            <LayoutDashboard size={18} />
            Overview Dashboard
          </Link>
          <Link to="/admin/alerts" className={getLinkClass('/admin/alerts')}>
            <AlertTriangle size={18} />
            Threat Alerts Feed
          </Link>
          <Link to="/admin/users" className={getLinkClass('/admin/users')}>
            <Users size={18} />
            User Monitoring
          </Link>
          <Link to="/admin/logic" className={getLinkClass('/admin/logic')}>
            <Cpu size={18} />
            AI Detection Rules
          </Link>
          <Link to="/admin/analytics" className={getLinkClass('/admin/analytics')}>
            <BarChart3 size={18} />
            Security Analytics
          </Link>
        </nav>

        <div className="p-4 border-t border-brand-surface-light mt-auto">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-brand-text-muted hover:text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors font-semibold text-sm"
          >
            <LogOut size={18} />
            Logout Command
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Sticky Top Navbar */}
        <header className="h-16 bg-brand-surface border-b border-brand-surface-light flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-brand-text-muted hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold hidden sm:block font-heading tracking-wide">
              ECLearnix / All College Event Security Command
            </h2>
            <h2 className="text-lg md:text-xl font-semibold sm:hidden font-heading">Command Center</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-success"></span>
              </span>
              <span className="text-xs md:text-sm text-brand-text-muted hidden sm:inline-block font-mono">SHIELD ACTIVE</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <span className="text-brand-primary text-sm font-bold">AD</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
