import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, ShieldBan, CheckCircle } from 'lucide-react';

const UserMonitoring = () => {
  const { usersDb, administrativeSetStatus } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback calculations to enrich the prototype's visual detail
  const getFallbackIP = (user) => {
    if (user.ip) return user.ip;
    if (user.role === 'admin') return '192.168.1.1';
    if (user.email.includes('spammer') || user.email.includes('bot') || user.email.includes('tempmail')) {
      return '45.22.11.9';
    }
    // Generate deterministic mock IP based on user ID string
    const seed = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `198.51.100.${(seed % 250) + 2}`;
  };

  const getFallbackDevice = (user) => {
    if (user.device) return user.device;
    if (user.role === 'admin') return 'Chrome / Windows (SecOps Node)';
    if (user.email.includes('spammer') || user.email.includes('bot') || user.email.includes('tempmail')) {
      return 'Headless Chrome / Playwright Script';
    }
    return 'Safari / iOS (Apple iPhone)';
  };

  const getFallbackLastLogin = (user) => {
    if (user.role === 'admin') return 'Just now';
    if (user.status === 'Blocked') return '1 day ago';
    // Generate deterministic last login
    const seed = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `${seed % 59} mins ago`;
  };

  const toggleStatus = (id, currentStatus) => {
    administrativeSetStatus(id, currentStatus === 'Active' ? 'Blocked' : 'Active');
  };

  const filteredUsers = usersDb.filter(user => {
    const query = searchQuery.toLowerCase();
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const ip = getFallbackIP(user).toLowerCase();
    return name.includes(query) || email.includes(query) || ip.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-wide">User Access & Monitoring</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Review real-time client risk profiles and manage system access states.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or IP address..." 
            className="w-full bg-brand-surface border border-brand-surface-light rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary text-sm transition-all"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-surface-light/50 border-b border-brand-surface-light">
                <th className="py-4 px-6 font-semibold text-brand-text-muted text-xs uppercase tracking-wider whitespace-nowrap">User Identity</th>
                <th className="py-4 px-6 font-semibold text-brand-text-muted text-xs uppercase tracking-wider whitespace-nowrap">Role</th>
                <th className="py-4 px-6 font-semibold text-brand-text-muted text-xs uppercase tracking-wider whitespace-nowrap">IP & Device Metadata</th>
                <th className="py-4 px-6 font-semibold text-brand-text-muted text-xs uppercase tracking-wider whitespace-nowrap">Risk Index</th>
                <th className="py-4 px-6 font-semibold text-brand-text-muted text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-4 px-6 font-semibold text-brand-text-muted text-xs uppercase tracking-wider text-right whitespace-nowrap">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-surface-light/60">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-brand-surface-light/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-sm">{user.name}</span>
                      <span className="text-xs text-brand-text-muted mt-0.5">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide ${user.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30' : 'bg-slate-800 text-slate-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-white">{getFallbackIP(user)}</span>
                      <span className="text-[10px] text-brand-text-muted mt-0.5">{getFallbackDevice(user)}</span>
                      <span className="text-[9px] text-brand-primary/60 mt-0.5">Last login: {getFallbackLastLogin(user)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`text-xs font-bold font-mono px-2 py-0.8 rounded border ${
                        user.riskScore > 75 
                          ? 'border-brand-danger text-brand-danger bg-brand-danger/10 shadow-[0_0_10px_rgba(255,0,60,0.15)]' 
                          : user.riskScore > 30 
                            ? 'border-orange-500 text-orange-500 bg-orange-500/10' 
                            : 'border-brand-success text-brand-success bg-brand-success/10'
                      }`}>
                        {user.riskScore}/100
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${user.status === 'Active' ? 'text-brand-success' : 'text-brand-danger animate-pulse'}`}>
                      {user.status === 'Active' ? <CheckCircle size={14} /> : <ShieldBan size={14} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {user.role === 'admin' ? (
                      <span className="text-xs text-brand-text-muted/50 italic pr-3">System Protected</span>
                    ) : (
                      <button 
                        onClick={() => toggleStatus(user.id, user.status)}
                        className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${
                          user.status === 'Active' 
                          ? 'text-brand-danger border border-brand-danger/30 hover:border-brand-danger hover:bg-brand-danger/10' 
                          : 'text-brand-success border border-brand-success/30 hover:border-brand-success hover:bg-brand-success/10'
                        }`}
                      >
                        {user.status === 'Active' ? 'Block Access' : 'Restore Access'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-text-muted text-sm italic">
                    No users matching search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.map(user => (
          <div key={user.id} className="glass-card p-5 space-y-4 hover:border-brand-primary/45 transition-all duration-300">
            {/* Header: Name, Email & Role */}
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="font-bold text-white text-sm truncate">{user.name}</h3>
                <p className="text-[11px] text-brand-text-muted mt-0.5 truncate">{user.email}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide shrink-0 ${user.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30' : 'bg-slate-800 text-slate-300'}`}>
                {user.role}
              </span>
            </div>

            {/* Content: Risk, Status & IP Metadata */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-surface-light/40 text-xs">
              <div>
                <span className="text-[9px] text-brand-text-muted uppercase tracking-wider block font-semibold mb-1">Risk Index</span>
                <div className={`inline-block text-[11px] font-bold font-mono px-2 py-0.5 rounded border ${
                  user.riskScore > 75 
                    ? 'border-brand-danger text-brand-danger bg-brand-danger/10' 
                    : user.riskScore > 30 
                      ? 'border-orange-500 text-orange-500 bg-orange-500/10' 
                      : 'border-brand-success text-brand-success bg-brand-success/10'
                }`}>
                  {user.riskScore}/100
                </div>
              </div>
              <div>
                <span className="text-[9px] text-brand-text-muted uppercase tracking-wider block font-semibold mb-1">Status</span>
                <span className={`flex items-center gap-1 text-[11px] font-semibold ${user.status === 'Active' ? 'text-brand-success' : 'text-brand-danger'}`}>
                  {user.status === 'Active' ? <CheckCircle size={12} /> : <ShieldBan size={12} />}
                  {user.status}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1.5 bg-brand-surface-light/20 p-3 rounded-lg border border-brand-surface-light/30">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-brand-text-muted">IP Address:</span>
                <span className="font-mono text-white">{getFallbackIP(user)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-brand-text-muted">Device:</span>
                <span className="text-white text-right truncate max-w-[170px]">{getFallbackDevice(user)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-brand-text-muted">Last Active:</span>
                <span className="text-brand-primary/80 font-medium">{getFallbackLastLogin(user)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-brand-surface-light/40 flex justify-end">
              {user.role === 'admin' ? (
                <span className="text-xs text-brand-text-muted/50 italic font-medium pr-1 py-1 w-full text-center">System Protected</span>
              ) : (
                <button 
                  onClick={() => toggleStatus(user.id, user.status)}
                  className={`w-full text-xs font-bold py-2 rounded-lg transition-all ${
                    user.status === 'Active' 
                    ? 'text-brand-danger border border-brand-danger/30 hover:border-brand-danger hover:bg-brand-danger/10 bg-brand-danger/5' 
                    : 'text-brand-success border border-brand-success/30 hover:border-brand-success hover:bg-brand-success/10 bg-brand-success/5'
                  }`}
                >
                  {user.status === 'Active' ? 'Block Access' : 'Restore Access'}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="glass-card py-8 text-center text-brand-text-muted text-sm italic">
            No users matching search query.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMonitoring;
