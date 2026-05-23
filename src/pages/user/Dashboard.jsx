import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ShieldCheck, Activity, Smartphone, MapPin, Clock, Key, AlertCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  
  // Track OTP state per user email in localStorage
  const [isOtpEnabled, setIsOtpEnabled] = useState(
    localStorage.getItem(`guardx_2fa_${user?.email}`) === 'true'
  );

  const [notification, setNotification] = useState(null);

  const toggleOtp = () => {
    const nextState = !isOtpEnabled;
    setIsOtpEnabled(nextState);
    localStorage.setItem(`guardx_2fa_${user?.email}`, nextState ? 'true' : 'false');
    
    setNotification({
      type: nextState ? 'success' : 'info',
      message: nextState 
        ? 'Two-Factor Authentication enabled! You will be prompted for an OTP code upon your next login.'
        : 'Two-Factor Authentication disabled. Your account risk rating may increase.'
    });

    setTimeout(() => setNotification(null), 5000);
  };

  const getRiskStatus = (score) => {
    // If 2FA is disabled, slightly bump mock user risk score for realistic behavior!
    const effectiveScore = isOtpEnabled ? Math.max(score - 10, 5) : score + 15;
    
    if (effectiveScore < 30) return { label: 'Low Risk', color: 'text-brand-success', bg: 'bg-brand-success/10', border: 'border-brand-success/30', icon: ShieldCheck, score: effectiveScore };
    if (effectiveScore < 60) return { label: 'Medium Risk', color: 'text-brand-warning', bg: 'bg-brand-warning/10', border: 'border-brand-warning/30', icon: Shield, score: effectiveScore };
    return { label: 'High Risk', color: 'text-brand-danger', bg: 'bg-brand-danger/10', border: 'border-brand-danger/30', icon: Shield, score: effectiveScore };
  };

  const status = getRiskStatus(user?.riskScore || 0);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Center</h1>
          <p className="text-brand-text-muted mt-1">Welcome back, {user?.name}. Monitor your account security status.</p>
        </div>
        
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${status.border} ${status.bg} transition-all`}>
          <StatusIcon className={status.color} size={24} />
          <div>
            <div className="text-xs text-brand-text-muted">Account Status</div>
            <div className={`font-bold ${status.color}`}>{status.label}</div>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${
          notification.type === 'success' 
            ? 'bg-brand-success/10 border-brand-success/30 text-brand-success' 
            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Overview */}
        <div className="md:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Security Actions & Controls</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2FA Card */}
            <div className={`p-4 rounded-lg bg-brand-surface-light/30 border transition-all ${isOtpEnabled ? 'border-brand-success/30' : 'border-brand-surface-light'} flex gap-4`}>
              <div className="mt-1">
                <Key className={isOtpEnabled ? 'text-brand-success' : 'text-brand-primary'} size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1 flex items-center gap-2">
                  Two-Factor Auth
                  {isOtpEnabled && <span className="text-[10px] bg-brand-success/10 border border-brand-success/20 text-brand-success px-1.5 py-0.5 rounded font-mono">SECURE</span>}
                </div>
                <div className="text-xs text-brand-text-muted mb-3">
                  {isOtpEnabled ? 'Protects your credentials using one-time verification tokens.' : 'Double protect your account with simulated SMS/Email OTP codes.'}
                </div>
                <button 
                  onClick={toggleOtp}
                  className={`text-xs font-semibold px-3 py-1.5 rounded transition-all ${
                    isOtpEnabled 
                      ? 'bg-brand-danger/10 border border-brand-danger/30 text-brand-danger hover:bg-brand-danger/20'
                      : 'bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20'
                  }`}
                >
                  {isOtpEnabled ? 'Disable 2FA Security' : 'Enable 2FA (OTP)'}
                </button>
              </div>
            </div>
            
            {/* Risk Indicator Card */}
            <div className="p-4 rounded-lg bg-brand-surface-light/30 border border-brand-surface-light flex gap-4">
              <div className="mt-1"><Activity className="text-brand-success" size={20} /></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">AI Risk Profiler</div>
                <div className="text-xs text-brand-text-muted mb-2">Anomalous Risk Index: <span className="text-white font-bold">{status.score}/100</span></div>
                <div className="w-full h-2 bg-brand-surface rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      status.score > 60 ? 'bg-brand-danger' : status.score > 30 ? 'bg-brand-warning' : 'bg-brand-success'
                    }`} 
                    style={{ width: `${Math.max(status.score, 5)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-brand-text-muted">
                  {isOtpEnabled ? '⚡ 2FA enabled discount applied (-10 risk points).' : '⚠️ Enable 2FA to improve risk reputation.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Session */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Device & Session Data</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Smartphone className="text-brand-text-muted mt-0.5" size={16} />
              <div>
                <div className="text-sm text-white font-medium">Chrome on Windows (10)</div>
                <div className="text-xs text-brand-text-muted">Device Fingerprint Match</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-brand-text-muted mt-0.5" size={16} />
              <div>
                <div className="text-sm text-white font-mono">192.168.1.1</div>
                <div className="text-xs text-brand-text-muted">Local IP Address</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-brand-text-muted mt-0.5" size={16} />
              <div>
                <div className="text-sm text-white">Active session (2h 15m)</div>
                <div className="text-xs text-brand-text-muted">Last Activity: Just now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Your Personal Security Logs</h2>
        <div className="space-y-3">
          {[
            { action: 'Successful Account Login', ip: '192.168.1.1', time: 'Just now', status: 'success' },
            { action: isOtpEnabled ? '2FA Protection Configured' : '2FA Configuration Updated', ip: '192.168.1.1', time: '1 min ago', status: 'success' },
            { action: 'Failed Authentication Request', ip: '203.0.113.5', time: '1 week ago', status: 'danger' }
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-brand-surface-light bg-brand-surface-light/10 hover:border-brand-primary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${log.status === 'success' ? 'bg-brand-success' : 'bg-brand-danger'}`}></div>
                <div>
                  <div className="text-sm font-medium text-white">{log.action}</div>
                  <div className="text-xs text-brand-text-muted font-mono">{log.ip}</div>
                </div>
              </div>
              <div className="text-xs text-brand-text-muted">{log.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
